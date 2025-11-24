import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * 
 * @param base64Image The base64 encoded string of the source image (without data:image/png;base64 prefix).
 * @param prompt The user's instruction (e.g., "Add strawberries and condensed milk").
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const editAcaiImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using the requested model for image tasks
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png', // Assuming PNG for simplicity, could be JPEG
            },
          },
          {
            text: `Edit this image of an açaí bowl. ${prompt}. Keep it photorealistic and appetizing. Return only the image.`,
          },
        ],
      },
      // Config to ensure we get an image back if possible, though 2.5 flash image handles this via prompt usually
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    
    console.warn("No image data found in response");
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates an initial image if the user starts from scratch.
 */
export const generateAcaiImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A professional food photography shot of a delicious Brazilian Açaí bowl. ${prompt}. High resolution, vibrant colors, dark background.`,
          },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return part.inlineData.data;
          }
        }
    }
    return null;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};