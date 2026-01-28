
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, MediaFile } from "../types";

// Inicializamos el cliente con la variable de entorno que ya configuraste en Vercel.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FLASH_MODEL = "gemini-3-flash-preview";
const PRO_MODEL = "gemini-3-pro-preview";

const SYSTEM_INSTRUCTION_FORENSIC = `ACTÚA COMO UN LABORATORIO DE INVESTIGACIÓN FORENSE DIGITAL.
TU OBJETIVO: Desmantelar desinformación y detectar contenido generado o manipulado.

PROTOCOLOS DE ANÁLISIS:
1. ANÁLISIS DE PÍXEL: Busca inconsistencias en bordes, ruido digital no uniforme y artefactos de compresión sospechosos.
2. COHERENCIA FÍSICA: Analiza sombras, reflejos en los ojos y leyes de la física. La IA suele fallar en la dirección de la luz.
3. RASTREO DE HISTORIAL: Utiliza Google Search para encontrar la PRIMERA aparición de este contenido. Si existe desde antes de la fecha del evento que dice representar, es FALSO.
4. DETECCIÓN DE IA: Identifica texturas "smooth" o excesivamente perfectas, errores en manos, dientes o fondos desenfocados de forma matemática.

ESTRUCTURA DE RESPUESTA (JSON PURO):
{
  "isFake": boolean,
  "confidence": number,
  "verdict": "AUTÉNTICO" | "SOSPECHOSO" | "MANIPULADO" | "IA_GENERADO",
  "reasoning": ["Evidencia técnica 1", "Evidencia técnica 2", ...],
  "forensicDetails": {
    "artifactDetection": "Descripción detallada de fallos en píxeles",
    "lightingInconsistency": "Análisis de vectores de luz",
    "aiSignature": "Probabilidad y rastro de modelo generativo"
  },
  "searchFound": boolean
}

IDIOMA: ESPAÑOL. NO INCLUYAS MARKDOWN NI TEXTO EXTRA.`;

async function runAnalysis(model: string, media: MediaFile, isEscalated: boolean = false): Promise<AnalysisResult> {
  const contents: any[] = [];
  const prompt = isEscalated 
    ? `MODO DE ALTA PRECISIÓN: Realiza un escaneo bit a bit. El análisis inicial requiere verificación profunda de fuentes externas.\n${SYSTEM_INSTRUCTION_FORENSIC}`
    : SYSTEM_INSTRUCTION_FORENSIC;

  if (media.type === 'link' && media.link) {
    contents.push({ text: `${prompt}\n\nURL DE INVESTIGACIÓN: ${media.link}` });
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
    config: { 
      tools: [{ googleSearch: {} }],
      temperature: 0.1 // Baja temperatura para mayor rigor técnico
    }
  });

  const textOutput = response.text || "{}";
  let parsed: any;
  
  try {
    const jsonStart = textOutput.indexOf('{');
    const jsonEnd = textOutput.lastIndexOf('}') + 1;
    parsed = JSON.parse(textOutput.substring(jsonStart, jsonEnd));
  } catch (e) {
    console.error("Error parsing JSON, raw text:", textOutput);
    throw new Error("El motor forense devolvió un formato no legible. Reintentando...");
  }

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const searchSources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || "Evidencia Web",
      uri: chunk.web.uri
    }));

  return {
    ...parsed,
    searchSources,
    highPrecision: isEscalated || model === PRO_MODEL 
  };
}

export async function analyzeMedia(media: MediaFile): Promise<AnalysisResult> {
  try {
    // Fase 1: Escaneo con Flash (Rápido y eficiente)
    const result = await runAnalysis(FLASH_MODEL, media);

    // Escalado automático si hay dudas razonables
    if (result.confidence < 85 || result.verdict === 'SOSPECHOSO') {
      return await runAnalysis(PRO_MODEL, media, true);
    }

    return result;
  } catch (error) {
    // Fallback a Pro si Flash encuentra errores
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
