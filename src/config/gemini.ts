import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDldb-aidcGMg8HubCOU0C-2O6hHuusMSo');

// Get the model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export { genAI, model };

// Gemini AI helper functions
export const generateRecipeResponse = async (prompt: string, recipeContext?: any) => {
  try {
    const contextualPrompt = recipeContext 
      ? `You are a professional cooking assistant helping with the recipe "${recipeContext.title}". 
         Recipe ingredients: ${recipeContext.ingredients?.join(', ')}
         User question: ${prompt}
         
         Please provide helpful, accurate cooking advice. Keep responses concise and practical.`
      : `You are a professional cooking assistant. User question: ${prompt}
         
         Please provide helpful, accurate cooking advice. Keep responses concise and practical.`;

    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return 'I apologize, but I\'m having trouble processing your request right now. Please try again later.';
  }
};

export const generateRecipeSuggestions = async (ingredients: string[]) => {
  try {
    const prompt = `Based on these available ingredients: ${ingredients.join(', ')}
    
    Please suggest 3 delicious recipes that can be made primarily with these ingredients. 
    For each recipe, provide:
    1. Recipe name
    2. Brief description
    3. Estimated cooking time
    4. Difficulty level (Easy/Medium/Hard)
    
    Format as a JSON array with objects containing: name, description, time, difficulty`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return null;
  }
};