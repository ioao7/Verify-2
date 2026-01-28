
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, MediaFile } from "../types";

// Inicializamos el cliente.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FLASH_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3-pro-preview";

const SYSTEM_INSTRUCTION_BASE = `ERES UN ANALISTA FORENSE DIGITAL DE ÉLITE Y VERIFICADOR DE HECHOS.
TU MISIÓN: Determinar si el contenido es REAL, MANIPULADO o GENERADO POR IA.

PROTOCOLO DE ACCIÓN:
1. IDENTIFICACIÓN DE IA: Busca "alucinaciones" visuales, texturas matemáticas y falta de coherencia anatómica. Si es generado íntegramente por IA, el veredicto DEBE ser IA_GENERADO.
2. MANIPULACIÓN HUMANA: Si la base es real pero hay edición (Photoshop, cortes, deepfakes parciales), es MANIPULADO.
3. DATOS EXTERNOS: Sé extremadamente preciso con nombres de creadores y fechas. Si no estás seguro por Google Search, no inventes.
4. IDIOMA: Responde siempre en ESPAÑOL.

RESPONDE EXCLUSIVAMENTE CON UN OBJETO JSON PLANO (SIN MARKDOWN).

Estructura:
{
  "isFake": boolean,
  "confidence": number,
  "verdict": "AUTÉNTICO" | "SOSPECHOSO" | "MANIPULADO" | "IA_GENERADO",
  "reasoning": ["punto 1", "punto 2", ...],
  "forensicDetails": {
    "artifactDetection": "Detalles técnicos",
    "lightingInconsistency": "Análisis de sombras/luz",
    "aiSignature": "Evidencia de IA"
  },
  "searchFound": boolean
}`;

async function runAnalysis(model: string, media: MediaFile, isEscalated: boolean = false): Promise<AnalysisResult> {
  const contents: any[] = [];
  const prompt = isEscalated 
    ? `ANÁLISIS DE ALTA PRECISIÓN REQUERIDO. El escaneo inicial fue inconcluso. Profundiza en los metadatos visuales y busca confirmación externa rigurosa.\n${SYSTEM_INSTRUCTION_BASE}`
    : SYSTEM_INSTRUCTION_BASE;

  if (media.type === 'link' && media.link) {
    contents.push({ text: `${prompt}\n\nAnaliza este link: ${media.link}` });
  } else if (media.file) {
    const base64Data = await fileToBase64(media.file);
    contents.push({
      inlineData: {
        mimeType: media.file.type,
        data: base64Data,
      },
    });
    contents.push({ text: prompt });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: { tools: [{ googleSearch: {} }] }
  });

  const textOutput = response.text || "";
  let parsed: any;
  
  try {
    const jsonStart = textOutput.indexOf('{');
    const jsonEnd = textOutput.lastIndexOf('}') + 1;
    parsed = JSON.parse(textOutput.substring(jsonStart, jsonEnd));
  } catch (e) {
    throw new Error("Error en el formato de respuesta de la IA.");
  }

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const searchSources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || "Fuente externa",
      uri: chunk.web.uri
    }));

  return {
    ...parsed,
    searchSources,
    // Marcamos si este resultado vino de una IA de mayor nivel
    highPrecision: isEscalated || model === PRO_MODEL 
  };
}

export async function analyzeMedia(media: MediaFile): Promise<AnalysisResult> {
  try {
    // Etapa 1: Análisis rápido con Flash
    console.log("Iniciando análisis rápido (Flash)...");
    const initialResult = await runAnalysis(FLASH_MODEL, media);

    // Lógica de escalado: si la confianza es baja (< 80) o el veredicto es ambiguo
    if (initialResult.confidence < 80 || initialResult.verdict === 'SOSPECHOSO') {
      console.log("Confianza baja o veredicto dudoso. Escalando a Pro...");
      return await runAnalysis(PRO_MODEL, media, true);
    }

    return initialResult;
  } catch (error) {
    console.error("Fallo en el pipeline de análisis:", error);
    // Si Flash falla por completo, intentamos Pro como último recurso
    return await runAnalysis(PRO_MODEL, media, true);
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
}
