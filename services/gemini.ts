
import { GoogleGenAI, Type } from "@google/genai";

// Medical Summary Generator
export const generateMedicalSummary = async (keywords: string): Promise<string> => {
  try {
    // Initializing SDK inside the function to ensure the most up-to-date API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Com base nas seguintes notas médicas (palavras-chave), gere um resumo profissional e estruturado para um prontuário eletrônico. Use tom clínico e formal: ${keywords}`,
    });
    // Accessing .text property directly as per SDK guidelines
    return response.text || "Não foi possível gerar o resumo.";
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "Erro ao processar resumo com IA.";
  }
};

// Medical Image Analyzer
export const analyzeMedicalImage = async (imageBase64: string): Promise<string> => {
  try {
    // Initializing SDK inside the function to ensure the most up-to-date API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // Using the parts array structure for multimodal input
      contents: {
        parts: [
          { text: "Analise esta imagem médica (exame) e identifique pontos de atenção para o médico. Forneça uma descrição técnica breve." },
          { inlineData: { mimeType: "image/png", data: imageBase64.split(',')[1] } }
        ]
      },
    });
    // Accessing .text property directly as per SDK guidelines
    return response.text || "Análise não disponível.";
  } catch (error) {
    console.error("AI Image Analysis Error:", error);
    return "Erro ao analisar imagem.";
  }
};
