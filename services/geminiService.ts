
import { GoogleGenAI, Type } from "@google/genai";
import type { Product, SimilarityResult, UploadedImage } from '../types';
import { urlToBase64 } from '../utils/imageUtils';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            productId: {
                type: Type.STRING,
                description: 'The unique ID of the product being compared.',
            },
            similarityScore: {
                type: Type.NUMBER,
                description: 'A score from 0 to 100 indicating visual similarity. 100 is a perfect match.',
            },
            justification: {
                type: Type.STRING,
                description: 'A brief explanation for the similarity score.',
            },
        },
        required: ["productId", "similarityScore", "justification"],
    },
};

async function productToInlineData(product: Product) {
    try {
        const { base64, mimeType } = await urlToBase64(product.imageUrl);
        return {
            inlineData: {
                data: base64,
                mimeType: mimeType
            }
        };
    } catch (error) {
        console.error(`Failed to process image for product ${product.id}:`, error);
        return null; // Skip products with inaccessible images
    }
}

export async function findSimilarProducts(userImage: UploadedImage, productDatabase: Product[]): Promise<SimilarityResult[]> {
    const model = 'gemini-2.5-flash';

    const userImagePart = {
        inlineData: {
            data: userImage.base64,
            mimeType: userImage.mimeType,
        },
    };

    const productParts = (await Promise.all(productDatabase.map(productToInlineData))).filter(part => part !== null);

    const prompt = `
        You are a visual product matching expert. Analyze the main subject in the first image provided (the user's image). 
        Then, for each of the subsequent product images, provide a similarity score from 0 to 100 of how visually similar it is to the user's image. 
        A score of 100 means it's nearly identical. A score of 0 means it's completely different.
        Also, provide a brief, one-sentence justification for each score.
        The product IDs are: ${productDatabase.map(p => p.id).join(', ')}.
        Return the results as a JSON array matching the provided schema. Only include products with a similarity score greater than 20.
    `;

    const contents = {
        parts: [
            userImagePart, 
            ...productParts,
            { text: prompt }
        ],
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const results = JSON.parse(jsonText);
        return results as SimilarityResult[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get similarity results from the AI model.");
    }
}
