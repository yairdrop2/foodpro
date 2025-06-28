import OpenAI from 'openai';

// Initialize OpenAI with proper error handling
let openai: OpenAI | null = null;

try {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && apiKey !== 'your_openai_api_key') {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }
} catch (error) {
  console.warn('OpenAI initialization failed:', error);
}

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
    if (!openai) {
      // Fallback to mock data when OpenAI is not available
      return this.generateMockRecipe(request);
    }

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
      // Fallback to mock data on error
      return this.generateMockRecipe(request);
    }
  }

  static async getCookingAdvice(question: string): Promise<string> {
    if (!openai) {
      return this.getMockCookingAdvice(question);
    }

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
      return this.getMockCookingAdvice(question);
    }
  }

  static async improveRecipe(recipe: Partial<GeneratedRecipe>, improvements: string): Promise<GeneratedRecipe> {
    if (!openai) {
      return this.generateMockRecipe({});
    }

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
      return this.generateMockRecipe({});
    }
  }

  // Mock data generators for when OpenAI is not available
  private static generateMockRecipe(request: RecipeRequest): GeneratedRecipe {
    const ingredients = request.ingredients || ['chicken breast', 'garlic', 'olive oil'];
    const cuisine = request.cuisine || 'Italian';
    const difficulty = request.difficulty || 'medium';

    return {
      title: `Delicious ${cuisine} ${ingredients[0]} Recipe`,
      description: `A wonderful ${difficulty} recipe featuring ${ingredients.join(', ')} with authentic ${cuisine} flavors.`,
      ingredients: [
        `2 lbs ${ingredients[0]}`,
        `3 cloves ${ingredients[1] || 'garlic'}, minced`,
        `2 tbsp ${ingredients[2] || 'olive oil'}`,
        '1 tsp salt',
        '1/2 tsp black pepper',
        '1 tsp dried herbs'
      ],
      instructions: [
        'Preheat your oven to 375°F (190°C).',
        'Season the main ingredient with salt and pepper.',
        'Heat oil in a large skillet over medium-high heat.',
        'Cook the main ingredient until golden brown on both sides.',
        'Add garlic and herbs, cook for another minute.',
        'Transfer to oven and bake for 15-20 minutes until cooked through.',
        'Let rest for 5 minutes before serving.'
      ],
      prepTime: request.cookingTime ? Math.floor(request.cookingTime * 0.3) : 15,
      cookTime: request.cookingTime ? Math.floor(request.cookingTime * 0.7) : 25,
      servings: request.servings || 4,
      difficulty: difficulty,
      cuisineType: cuisine,
      dietaryRestrictions: request.dietaryRestrictions || []
    };
  }

  private static getMockCookingAdvice(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('substitute') || lowerQuestion.includes('replace')) {
      return "For ingredient substitutions, consider the role the ingredient plays in the recipe. For example, if substituting eggs in baking, you can use applesauce, mashed banana, or commercial egg replacers. For dairy milk, try almond, oat, or soy milk. Always consider how the substitution might affect taste, texture, and cooking time.";
    }
    
    if (lowerQuestion.includes('temperature') || lowerQuestion.includes('cook') || lowerQuestion.includes('bake')) {
      return "Cooking temperatures are crucial for food safety and quality. For meat, use a thermometer to ensure proper internal temperatures: chicken should reach 165°F (74°C), beef steaks 145°F (63°C) for medium-rare, and ground meats 160°F (71°C). For baking, preheat your oven and use the middle rack for even cooking.";
    }
    
    if (lowerQuestion.includes('season') || lowerQuestion.includes('salt') || lowerQuestion.includes('spice')) {
      return "Seasoning is key to great cooking! Start with less and taste as you go. Salt enhances flavors, so add it gradually. Fresh herbs should be added near the end of cooking, while dried herbs can be added earlier. Toast whole spices before grinding for maximum flavor.";
    }
    
    return "That's a great cooking question! Here are some general tips: Always read the entire recipe before starting, prep all ingredients first (mise en place), taste as you cook, and don't be afraid to adjust seasonings. Cooking is both an art and a science - practice makes perfect!";
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