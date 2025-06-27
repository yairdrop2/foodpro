import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface RecipeRequest {
  ingredients?: string[];
  cuisine?: string;
  dietaryRestrictions?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  cookingTime?: number;
  servings?: number;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisineType: string;
  dietaryRestrictions: string[];
}

export class AIService {
  static async generateRecipe(request: RecipeRequest): Promise<GeneratedRecipe> {
    try {
      const prompt = this.buildRecipePrompt(request);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional chef and recipe creator. Generate detailed, practical recipes in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      return this.parseRecipeResponse(response);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate recipe. Please try again.');
    }
  }

  static async getCookingAdvice(question: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful cooking assistant. Provide practical, clear advice about cooking, recipes, ingredients, and kitchen techniques."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not provide an answer at this time.';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get cooking advice. Please try again.');
    }
  }

  static async improveRecipe(recipe: Partial<GeneratedRecipe>, improvements: string): Promise<GeneratedRecipe> {
    try {
      const prompt = `
        Please improve this recipe based on the following feedback: "${improvements}"
        
        Current recipe:
        Title: ${recipe.title}
        Description: ${recipe.description}
        Ingredients: ${recipe.ingredients?.join(', ')}
        Instructions: ${recipe.instructions?.join(' ')}
        
        Please return the improved recipe in the same JSON format.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional chef. Improve recipes based on user feedback while maintaining the original structure."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      return this.parseRecipeResponse(response);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to improve recipe. Please try again.');
    }
  }

  private static buildRecipePrompt(request: RecipeRequest): string {
    let prompt = "Generate a detailed recipe with the following requirements:\n";
    
    if (request.ingredients && request.ingredients.length > 0) {
      prompt += `- Must include these ingredients: ${request.ingredients.join(', ')}\n`;
    }
    
    if (request.cuisine) {
      prompt += `- Cuisine type: ${request.cuisine}\n`;
    }
    
    if (request.dietaryRestrictions && request.dietaryRestrictions.length > 0) {
      prompt += `- Dietary restrictions: ${request.dietaryRestrictions.join(', ')}\n`;
    }
    
    if (request.difficulty) {
      prompt += `- Difficulty level: ${request.difficulty}\n`;
    }
    
    if (request.cookingTime) {
      prompt += `- Maximum cooking time: ${request.cookingTime} minutes\n`;
    }
    
    if (request.servings) {
      prompt += `- Number of servings: ${request.servings}\n`;
    }

    prompt += `
    Please return the recipe in this exact JSON format:
    {
      "title": "Recipe Name",
      "description": "Brief description of the dish",
      "ingredients": ["ingredient 1", "ingredient 2", ...],
      "instructions": ["step 1", "step 2", ...],
      "prepTime": number_in_minutes,
      "cookTime": number_in_minutes,
      "servings": number,
      "difficulty": "easy|medium|hard",
      "cuisineType": "cuisine name",
      "dietaryRestrictions": ["restriction1", "restriction2", ...]
    }`;

    return prompt;
  }

  private static parseRecipeResponse(response: string): GeneratedRecipe {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const required = ['title', 'description', 'ingredients', 'instructions', 'prepTime', 'cookTime', 'servings', 'difficulty', 'cuisineType'];
      for (const field of required) {
        if (!(field in parsed)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return {
        title: parsed.title,
        description: parsed.description,
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
        instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
        prepTime: Number(parsed.prepTime) || 0,
        cookTime: Number(parsed.cookTime) || 0,
        servings: Number(parsed.servings) || 1,
        difficulty: ['easy', 'medium', 'hard'].includes(parsed.difficulty) ? parsed.difficulty : 'medium',
        cuisineType: parsed.cuisineType || '',
        dietaryRestrictions: Array.isArray(parsed.dietaryRestrictions) ? parsed.dietaryRestrictions : []
      };
    } catch (error) {
      console.error('Failed to parse recipe response:', error);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }
}