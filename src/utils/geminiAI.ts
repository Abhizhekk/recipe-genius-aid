
import { Recipe, RecipeGeneratorParams } from '@/types';
import { toast } from 'sonner';

// Mock API key - in production, this should be securely handled
const API_KEY = 'AIzaSyBdf7PsvrPgNzLS0rvZYvbbt6auEIc7fi8';
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

export async function generateRecipe(params: RecipeGeneratorParams): Promise<Recipe | null> {
  try {
    const { ingredients, dietary, cuisine, difficulty } = params;
    
    // Format ingredients for prompt
    const ingredientsList = ingredients.join(', ');
    
    // Build dietary restrictions string
    const dietaryString = dietary && dietary.length > 0 
      ? `The recipe should be suitable for ${dietary.join(', ')} diets.` 
      : '';
    
    // Build cuisine preference string
    const cuisineString = cuisine 
      ? `The cuisine should be ${cuisine}.` 
      : '';
    
    // Build difficulty preference string
    const difficultyString = difficulty 
      ? `The difficulty level should be ${difficulty}.` 
      : '';

    // Create the prompt for Gemini
    const prompt = `
      Generate a detailed cooking recipe using these ingredients: ${ingredientsList}.
      ${dietaryString}
      ${cuisineString}
      ${difficultyString}
      
      Format the response as a JSON object with the following structure:
      {
        "title": "Recipe Title",
        "description": "Brief description",
        "ingredients": [{"name": "ingredient name", "amount": "quantity", "unit": "measurement unit", "optional": boolean, "substitutes": ["alternative1", "alternative2"]}],
        "steps": [{"id": 1, "instruction": "step instruction", "duration": seconds}],
        "imageUrl": "placeholder url",
        "prepTime": minutes,
        "cookTime": minutes,
        "servings": number,
        "cuisine": "cuisine type",
        "difficulty": "easy/medium/hard",
        "tags": ["tag1", "tag2"],
        "nutritionFacts": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        }
      }
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response text to extract the JSON
    const responseText = data.candidates[0].content.parts[0].text;
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString) as Recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    toast.error('Failed to generate recipe. Please try again.');
    return null;
  }
}

export async function getSubstitutions(ingredient: string): Promise<string[]> {
  try {
    const prompt = `Suggest 3 substitutions for ${ingredient} in cooking recipes. Only return a JSON array of strings with the substitutions.`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Parse JSON array from the response
    const jsonStart = responseText.indexOf('[');
    const jsonEnd = responseText.lastIndexOf(']') + 1;
    const jsonString = responseText.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString) as string[];
  } catch (error) {
    console.error('Error getting substitutions:', error);
    return [];
  }
}

export async function getNutritionalAnalysis(recipe: Recipe): Promise<string> {
  try {
    const ingredients = recipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`).join(', ');
    
    const prompt = `
      Analyze the nutritional benefits of this recipe:
      Recipe: ${recipe.title}
      Ingredients: ${ingredients}
      
      Provide a brief paragraph about its health benefits and dietary suitability.
    `;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    return 'Nutritional analysis unavailable';
  }
}
