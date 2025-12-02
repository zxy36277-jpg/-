
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptScore, ScriptSegment, Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Model Constants
const SCRIPT_MODEL = 'gemini-3-pro-preview';

/**
 * Generates the initial creative script based on user input.
 */
export const generateCreativeScript = async (idea: string, lang: Language): Promise<string> => {
  const langInstruction = lang === 'zh' 
    ? "Output the FINAL SCRIPT content in Simplified Chinese (简体中文)." 
    : "Output the FINAL SCRIPT content in English.";

  const prompt = `
    You are a world-class creative screenwriter and director.
    Based on the following idea, write a compelling, cinematic video script.
    
    User Idea: "${idea}"
    
    Requirements:
    - Format it professionally (Scene Headers, Action, Dialogue).
    - Focus on visual storytelling, emotion, and pacing.
    - Keep it concise enough for a short film or video content (approx 1-3 minutes).
    - ${langInstruction}
    - Output ONLY the script text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: SCRIPT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.8, // High creativity
      }
    });
    return response.text || "Failed to generate script.";
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate script. Please check your API key or try again.");
  }
};

/**
 * Refines the script based on user feedback.
 */
export const refineScript = async (currentScript: string, feedback: string, originalIdea: string, lang: Language): Promise<string> => {
  const langInstruction = lang === 'zh'
    ? "Rewrite the script in Simplified Chinese (简体中文)."
    : "Rewrite the script in English.";

  const prompt = `
    You are a professional script doctor.
    
    Original Idea: "${originalIdea}"
    Current Script:
    """
    ${currentScript}
    """
    
    User Feedback/Change Request: "${feedback}"
    
    Please rewrite the script incorporating the user's feedback while maintaining the high cinematic quality.
    ${langInstruction}
    Output ONLY the new script text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: SCRIPT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "Failed to refine script.";
  } catch (error) {
    console.error("Error refining script:", error);
    throw new Error("Failed to refine script.");
  }
};

/**
 * Translates the script to the target language.
 */
export const translateScript = async (script: string, targetLang: Language): Promise<string> => {
  const target = targetLang === 'zh' ? "Simplified Chinese (简体中文)" : "English";
  
  const prompt = `
    You are a professional translator for screenplays.
    Translate the following script to ${target}.
    
    Rules:
    - Maintain the professional screenplay format strictly (Scene Headers, Action, Dialogue).
    - Keep the original tone, emotion, and creativity.
    - Do not summarize; translate the full content.
    - Output ONLY the translated script text.

    Script:
    """
    ${script}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model: SCRIPT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for accurate translation
      }
    });
    return response.text || script;
  } catch (error) {
    console.error("Error translating script:", error);
    throw new Error("Failed to translate script.");
  }
};

/**
 * Evaluates the script for relevance and creativity.
 */
export const evaluateScript = async (originalIdea: string, finalScript: string, lang: Language): Promise<ScriptScore> => {
  const langInstruction = lang === 'zh'
    ? "Provide the 'feedback' text in Simplified Chinese (简体中文)."
    : "Provide the 'feedback' text in English.";

  const prompt = `
    Analyze the following script against the original user idea.
    
    Original Idea: "${originalIdea}"
    Final Script: "${finalScript}"
    
    Provide a score (1-10) for:
    1. Relevance (Is it based on the description?)
    2. Creativity (Is the structure vivid, emotional, and creative?)
    
    ${langInstruction}
    Also provide a brief textual summary of the critique (max 30 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: SCRIPT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevance: { type: Type.INTEGER, description: "Score from 1-10" },
            creativity: { type: Type.INTEGER, description: "Score from 1-10" },
            feedback: { type: Type.STRING, description: "Brief critique" }
          },
          required: ["relevance", "creativity", "feedback"]
        }
      }
    });
    
    const result = JSON.parse(response.text || "{}");
    return result as ScriptScore;
  } catch (error) {
    console.error("Error evaluating script:", error);
    // Fallback if JSON parsing fails
    return { relevance: 0, creativity: 0, feedback: "Error evaluating script." };
  }
};

/**
 * Breaks the script into 8s segments and generates specific prompts.
 */
export const generateProductionBreakdown = async (script: string, lang: Language): Promise<ScriptSegment[]> => {
  const langInstruction = lang === 'zh'
    ? "Translate the 'sceneContent' to Simplified Chinese. However, keep 'imagePrompt' and 'videoPrompt' strictly in English for better compatibility with AI generation tools."
    : "Keep all content in English.";

  const prompt = `
    You are a technical post-production supervisor and prompt engineer.
    
    Task 1: Break the following script into logical 8-second visual segments/shots.
    Task 2: For EACH segment, act as a Top-Tier Visual Composition Designer to write an AI Image Generation Prompt.
       - Image Prompt Focus: Lighting, camera angle, color palette, texture, composition, style (e.g., cinematic, photorealistic, 8k).
    Task 3: For EACH segment, act as a Top-Tier Hollywood Director to write an AI Video Generation Prompt.
       - Video Prompt Focus: Camera movement (pan, dolly, tracking), character action, physics, emotion, pacing.
    
    ${langInstruction}

    Script:
    """
    ${script}
    """
    
    Return the result as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: SCRIPT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              duration: { type: Type.STRING, description: "e.g., '0:00-0:08'" },
              sceneContent: { type: Type.STRING, description: "The content of the script covered in this segment" },
              imagePrompt: { type: Type.STRING, description: "Detailed MJ/Flux/SD prompt (English)" },
              videoPrompt: { type: Type.STRING, description: "Detailed Runway/Pika/Sora prompt (English)" }
            },
            required: ["id", "duration", "sceneContent", "imagePrompt", "videoPrompt"]
          }
        }
      }
    });

    const result = JSON.parse(response.text || "[]");
    return result as ScriptSegment[];
  } catch (error) {
    console.error("Error creating breakdown:", error);
    return [];
  }
};
