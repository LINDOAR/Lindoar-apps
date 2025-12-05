
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined. Please create a .env file in the root of your project and add the line API_KEY=YOUR_API_KEY");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "The catchy name of the recipe." },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of ingredients with quantities."
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step instructions for preparing the meal."
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER, description: "Estimated number of calories per serving." },
        prepTime: { type: Type.STRING, description: "Estimated preparation time, e.g., '25 minutes'." },
      },
    },
    benefits: {
      type: Type.OBJECT,
      description: "Sofagirl's Scoop: Witty, relatable insights on why this food helps.",
      properties: {
        hormone: { type: Type.STRING, description: "How this recipe helps with hormone balance." },
        mood: { type: Type.STRING, description: "How this recipe can positively affect mood." },
        symptomRelief: { type: Type.STRING, description: "Specifics on how it helps with the user's selected symptoms." }
      }
    }
  },
  required: ['name', 'ingredients', 'instructions', 'stats', 'benefits']
};

const snackBoardSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A fun, catchy title for the snack board." },
    description: { type: Type.STRING, description: "A witty, enticing description of the board and its components." },
    components: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 5-7 specific food items for the snack board."
    },
    imagePrompt: { type: Type.STRING, description: "A detailed, visually rich prompt to generate an image of this snack board. e.g. 'A vibrant, overhead shot of a rustic wooden board laden with salty snacks...'" }
  },
  required: ['title', 'description', 'components', 'imagePrompt']
};

export const generateRecipe = async (ingredient: string, mealType: string, symptoms: string[], restrictions: string[]) => {
  const ingredientLine = ingredient
    ? `- Main Ingredient: ${ingredient}`
    : `- Main Ingredient: User has not specified one, please choose a suitable, healthy main ingredient based on their other selections.`;

  const prompt = `
    You are Sofagirl, a cozy, witty, and non-judgmental midlife bestie for menopausal women.
    Your goal is to create a delicious and supportive recipe.

    User's request:
    ${ingredientLine}
    - Meal Type: ${mealType}
    - Symptoms to address: ${symptoms.join(', ')}
    - Dietary Restrictions: ${restrictions.join(', ')}

    Your task:
    Generate a complete recipe that is specifically tailored to help alleviate the specified symptoms. For example, for 'Hot Flashes', suggest cooling foods. For 'Brain Fog', suggest omega-3 rich foods.
    If the user provided a main ingredient, it MUST be the star of the recipe. If not, you must choose an appropriate one that fits the user's needs.
    The recipe must adhere to all dietary restrictions.
    Crucially, you MUST provide "Sofagirl's Scoop" in the benefits section, with witty, supportive, and relatable insights.
    The tone should be like you're chatting with a friend on the sofa. Fun, encouraging, and never clinical.
    Return the response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Failed to generate recipe. Empty response from API.");

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Oops! Sofagirl is having a brain fog moment. Could you try again?");
  }
};

export const startChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are Sofagirl, a cozy, supportive, and slightly sassy midlife bestie chatting with a friend. Your user is a woman navigating menopause.
      Your personality is:
      - Witty & Relatable: Use humor and shared experiences. No judgment, ever.
      - Supportive & Comforting: Like a warm hug in chat form.
      - Knowledgeable but not Clinical: You know about wellness, food, and hormones, but you explain it like a friend, not a doctor.
      - A Little Sassy: You're not afraid of a playful eye-roll or a "you got this, girl" attitude.

      Your goal is to listen, support, and offer gentle advice or just be a friendly ear for anything she wants to talk about - health, mood, food, life. Keep your responses concise and conversational.`,
    },
  });
};

export const generateSnackBoard = async (vibe: string, symptoms: string[], restrictions: string[]) => {
  const prompt = `
    You are Sofagirl, creating an "Adult Snack Plate" concept.
    
    User's request:
    - Vibe: ${vibe}
    - Symptoms to consider: ${symptoms.join(', ')}
    - Dietary Restrictions: ${restrictions.join(', ')}

    Your task:
    Design a snack board concept that fits the vibe, helps with the symptoms, and respects the dietary restrictions.
    Create a fun title, a witty description, a list of 5-7 components, and a DETAILED, visually rich prompt for an AI image generator.
    Return the response in the specified JSON format.
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: snackBoardSchema,
      },
    });
    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Failed to generate snack board. Empty response.");
  } catch (error) {
    console.error("Error generating snack board:", error);
    throw new Error("Couldn't whip up a snack board idea. Let's try that again.");
  }
};

export const generateImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("The camera seems to be smudged. Couldn't get a good pic.");
  }
};
