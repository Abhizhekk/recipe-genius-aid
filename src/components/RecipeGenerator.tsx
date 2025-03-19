
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeGeneratorParams, Recipe } from '@/types';
import { generateRecipe } from '@/utils/geminiAI';
import { toast } from 'sonner';
import { 
  ChefHat, 
  Plus, 
  X, 
  Loader2, 
  Carrot, 
  UtensilsCrossed, 
  Timer 
} from 'lucide-react';
import RecipeCard from './RecipeCard';

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Low-Carb',
  'Paleo'
];

const cuisineOptions = [
  'Italian',
  'Mexican',
  'Asian',
  'Mediterranean',
  'Indian',
  'American',
  'French'
];

const difficultyOptions = [
  'Easy',
  'Medium',
  'Hard'
];

const RecipeGenerator = () => {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddIngredient = () => {
    if (inputValue.trim() !== '' && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
      e.preventDefault();
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };

  const toggleDietary = (option: string) => {
    if (dietary.includes(option)) {
      setDietary(dietary.filter(item => item !== option));
    } else {
      setDietary([...dietary, option]);
    }
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    setIsLoading(true);
    setRecipe(null);

    try {
      const params: RecipeGeneratorParams = {
        ingredients,
        dietary: dietary.length > 0 ? dietary : undefined,
        cuisine: cuisine || undefined,
        difficulty: difficulty || undefined
      };

      const generatedRecipe = await generateRecipe(params);
      if (generatedRecipe) {
        setRecipe(generatedRecipe);
        toast.success('Recipe generated successfully!');
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast.error('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIngredients([]);
    setDietary([]);
    setCuisine('');
    setDifficulty('');
    setRecipe(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <Card className="overflow-hidden border border-border/50 shadow-subtle transition-all duration-300 hover:shadow-elevation bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="ingredients" className="flex items-center gap-2">
                <Carrot className="h-4 w-4" />
                <span>Ingredients</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="result" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>Result</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium mb-4">What ingredients do you have?</h2>
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter ingredient (e.g., chicken, pasta, tomatoes)"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddIngredient}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                {ingredients.length > 0 && (
                  <div className="animate-fade-in">
                    <h3 className="text-lg font-medium mb-2">Your ingredients:</h3>
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="flex items-center gap-1 py-1.5 px-3 bg-secondary/70"
                        >
                          {ingredient}
                          <X 
                            className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" 
                            onClick={() => handleRemoveIngredient(ingredient)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => document.querySelector('[data-value="preferences"]')?.click()}
                    disabled={ingredients.length === 0}
                    className="mt-4"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium mb-4">Dietary Preferences</h2>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={dietary.includes(option) ? "default" : "outline"}
                        className={`cursor-pointer py-1.5 px-3 transition-all ${
                          dietary.includes(option) 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => toggleDietary(option)}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-medium mb-4">Cuisine Type</h2>
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={cuisine === option ? "default" : "outline"}
                        className={`cursor-pointer py-1.5 px-3 transition-all ${
                          cuisine === option 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => setCuisine(cuisine === option ? '' : option)}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-medium mb-4">Difficulty Level</h2>
                  <div className="flex flex-wrap gap-2">
                    {difficultyOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={difficulty === option ? "default" : "outline"}
                        className={`cursor-pointer py-1.5 px-3 transition-all ${
                          difficulty === option 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => setDifficulty(difficulty === option ? '' : option)}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="ingredients"]')?.click()}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isLoading || ingredients.length === 0}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ChefHat className="h-4 w-4" />
                        Generate Recipe
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="result" className="animate-fade-in">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="mt-4 text-lg">
                    Generating your perfect recipe...
                  </p>
                  <p className="text-muted-foreground mt-2">
                    This may take a moment as we craft something delicious for you
                  </p>
                </div>
              ) : recipe ? (
                <div className="animate-fade-in">
                  <RecipeCard recipe={recipe} />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={resetForm}>
                      Start Over
                    </Button>
                    <Button onClick={handleGenerateRecipe}>
                      Regenerate Recipe
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ChefHat className="h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-medium mt-4">No Recipe Yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-lg">
                    Add your ingredients and preferences, then click "Generate Recipe"
                    to see what delicious meals you can create!
                  </p>
                  <Button 
                    onClick={() => document.querySelector('[data-value="ingredients"]')?.click()}
                    className="mt-6"
                  >
                    Start Now
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeGenerator;
