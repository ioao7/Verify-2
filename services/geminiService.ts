
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, MediaFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Modelo de máxima capacidad de razonamiento y visión
const MODEL_NAME = "gemini-3-pro-preview";

const SYSTEM_INSTRUCTION_FORENSIC = `ACTÚA COMO UN INVESTIGADOR FORENSE DE ÉLITE ESPECIALIZADO EN DEEPFAKES Y GENERACIÓN SINTÉTICA. 

TU MISIÓN: DEMOSTRAR QUE EL ARCHIVO ES FALSO. NO BUSQUES "SI ES REAL", BUSCA EL "ERROR MATEMÁTICO".

PROTOCOLO DE DETECCIÓN DE IA DE ÚLTIMA GENERACIÓN:
1. ANATOMÍA IMPOSIBLE: Mira los lóbulos de las orejas, los párpados y las comisuras de los labios. La IA suele "fusionar" estas partes con la piel circundante de forma antinatural.
2. PERSISTENCIA DE DETALLES: Si es video, observa un detalle pequeño (un lunar, un botón, un reflejo). ¿Cambia de forma o posición entre frames? Si parpadea o se deforma, es IA_GENERADO.
3. FÍSICA DE FLUIDOS Y CABELLO: El cabello en la IA a menudo se mueve como una "masa" sólida o tiene hilos que aparecen y desaparecen. Analiza si el movimiento sigue las leyes de la inercia real.
4. MICRO-EXPRESIONES ASÍNCRONAS: Los humanos reales mueven docenas de micro-músculos al hablar. La IA suele tener una "máscara" facial donde solo se mueven ojos y boca, dejando el resto del rostro estático o con movimientos "gelatinosos".
5. ERROR DE RUIDO DE SENSOR: Las cámaras reales producen ruido aleatorio (ISO). La IA produce un "alisado" o patrones de ruido repetitivos. Busca "suavidad excesiva" en texturas complejas como la piel.

REGLAS DE DECISIÓN:
- TODO ES FALSO HASTA QUE SE DEMUESTRE LO CONTRARIO.
- Si la iluminación es "mágica" o "demasiado cinematográfica" sin una fuente de luz clara, marca como IA_GENERADO.
- Si detectas UN SOLO FRAME donde un objeto se deforma o desaparece, el veredicto es IA_GENERADO.

ESTRUCTURA OBLIGATORIA (JSON):
{
  "isFake": boolean,
  "confidence": number,
  "verdict": "AUTÉNTICO" | "SOSPECHOSO" | "MANIPULADO" | "IA_GENERADO",
  "reasoning": [
    "Evidencia de Renderizado: [Describe el fallo de textura o ruido]",
    "Inconsistencia Física: [Describe el fallo en movimiento o anatomía]",
    "Veredicto de Integridad: [Conclusión final basada en pruebas]"
  ],
  "forensicDetails": {
    "artifactDetection": "Detalle técnico del rastro algorítmico",
    "lightingInconsistency": "Análisis de sombras y rebotes de luz",
    "aiSignature": "Tipo de modelo generativo probable (Difusión, GAN, etc.)"
  },
  "searchFound": boolean
}

RESPONDE ÚNICAMENTE EL JSON EN ESPAÑOL.`;

export async function analyzeMedia(media: MediaFile): Promise<AnalysisResult> {
  const contents: any[] = [];
  
  // Identificador único para evitar sesgos de memoria en el modelo
  const sessionNonce = `FORENSIC_SIG_${Date.now()}_${Math.random().toString(36).toUpperCase()}`;
  const highPrecisionPrompt = `${SYSTEM_INSTRUCTION_FORENSIC}\n\n[PROTOCOLO_ID: ${sessionNonce}]\nINICIA EL ESCANEO DE ALTA PRECISIÓN:`;

  if (media.type === 'link' && media.link) {
    contents.push({ text: `${highPrecisionPrompt}\nURL_OBJETIVO: ${media.link}` });
  } else if (media.file) {
    const base64Data = await fileToBase64(media.file);
    contents.push({
      inlineData: {
        mimeType: media.file.type,
        data: base64Data,
      },
    });
    contents.push({ text: highPrecisionPrompt });
  }

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: { parts: contents },
    config: { 
      tools: [{ googleSearch: {} }],
      temperature: 0, // Cero creatividad, máxima fidelidad técnica
      thinkingConfig: { thinkingBudget: 32768 } // Máximo razonamiento para detectar Deepfakes de alta calidad
    }
  });

  const textOutput = response.text || "{}";
  try {
    const jsonStart = textOutput.indexOf('{');
    const jsonEnd = textOutput.lastIndexOf('}') + 1;
    const result = JSON.parse(textOutput.substring(jsonStart, jsonEnd));

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Evidencia Externa",
        uri: chunk.web.uri
      }));

    return { ...result, searchSources };
  } catch (e) {
    console.error("Forensic Parse Error:", textOutput);
    throw new Error("El archivo es demasiado complejo para el análisis actual o contiene metadatos corruptos.");
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
