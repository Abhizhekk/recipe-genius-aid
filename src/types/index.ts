
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: CookingStep[];
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  nutritionFacts: NutritionFacts;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  optional?: boolean;
  substitutes?: string[];
}

export interface CookingStep {
  id: number;
  instruction: string;
  duration?: number; // in seconds
  image?: string;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  sugar?: number;
  fiber?: number;
  sodium?: number;
}

export interface UserPreferences {
  dietary: string[];
  allergies: string[];
  cuisinePreferences: string[];
  cookingLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface RecipeGeneratorParams {
  ingredients: string[];
  dietary?: string[];
  cuisine?: string;
  difficulty?: string;
}
