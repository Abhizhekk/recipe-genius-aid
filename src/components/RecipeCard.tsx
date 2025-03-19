
import { useState } from 'react';
import { Recipe, Ingredient } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSubstitutions, getNutritionalAnalysis } from '@/utils/geminiAI';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Bookmark, 
  PlayCircle,
  InfoIcon,
  UtensilsCrossed 
} from 'lucide-react';

import CookingTimer from './CookingTimer';
import NutritionFacts from './NutritionFacts';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState<string | null>(null);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [showNutrition, setShowNutrition] = useState(false);
  const [nutritionalAnalysis, setNutritionalAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCooking, setIsCooking] = useState(false);
  
  const { toast: uiToast } = useToast();

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Recipe removed from your cookbook' : 'Recipe saved to your cookbook');
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSubstitutionClick = async (ingredient: string) => {
    if (activeIngredient === ingredient) {
      setActiveIngredient(null);
      setSubstitutes([]);
      return;
    }
    
    setActiveIngredient(ingredient);
    setIsLoading(true);
    
    try {
      const subs = await getSubstitutions(ingredient);
      setSubstitutes(subs);
    } catch (error) {
      console.error('Error fetching substitutions:', error);
      uiToast({
        title: "Error",
        description: "Failed to get substitutions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNutritionAnalysisClick = async () => {
    if (showNutrition) {
      setShowNutrition(false);
      return;
    }
    
    setShowNutrition(true);
    setIsLoading(true);
    
    try {
      if (!nutritionalAnalysis) {
        const analysis = await getNutritionalAnalysis(recipe);
        setNutritionalAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error fetching nutritional analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCooking = () => {
    setIsCooking(true);
  };

  const stopCooking = () => {
    setIsCooking(false);
  };

  const totalTime = recipe.prepTime + recipe.cookTime;
  
  // Use placeholder image since the API doesn't provide real images
  const placeholderImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="w-full">
      {isCooking ? (
        <CookingTimer recipe={recipe} onClose={stopCooking} />
      ) : (
        <Card className="overflow-hidden border border-border/50 shadow-subtle bg-card/80 backdrop-blur-sm">
          <div className="relative h-64 w-full overflow-hidden">
            <img 
              src={placeholderImage} 
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                {recipe.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-black/30 text-white border-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">{recipe.title}</h1>
            </div>
          </div>

          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{totalTime} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <ChefHat className="h-4 w-4" />
                  <span>{recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleLike}
                  className={isLiked ? "text-red-500" : "text-muted-foreground"}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSave}
                  className={isSaved ? "text-primary" : "text-muted-foreground"}
                >
                  <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <p className="text-muted-foreground mb-6">{recipe.description}</p>

            <Tabs defaultValue="ingredients" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="ingredients" className="flex items-center gap-2 text-sm">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Ingredients</span>
                </TabsTrigger>
                <TabsTrigger value="steps" className="flex items-center gap-2 text-sm">
                  <ChefHat className="h-4 w-4" />
                  <span>Steps</span>
                </TabsTrigger>
                <TabsTrigger value="nutrition" className="flex items-center gap-2 text-sm">
                  <InfoIcon className="h-4 w-4" />
                  <span>Nutrition</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="animate-fade-in">
                <div className="space-y-6">
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient: Ingredient, index: number) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                          </span>
                          {ingredient.optional && (
                            <Badge variant="outline" className="text-xs">optional</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSubstitutionClick(ingredient.name)}
                          className="text-xs"
                        >
                          {activeIngredient === ingredient.name ? "Hide" : "Substitutes"}
                        </Button>
                      </li>
                    ))}
                  </ul>

                  {activeIngredient && (
                    <div className="bg-accent/50 p-4 rounded-lg animate-fade-in">
                      <h4 className="font-medium mb-2">Substitutes for {activeIngredient}:</h4>
                      {isLoading ? (
                        <p className="text-muted-foreground">Loading substitutes...</p>
                      ) : (
                        <ul className="space-y-1 ml-5 list-disc">
                          {substitutes.map((sub, index) => (
                            <li key={index}>{sub}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="steps" className="animate-fade-in">
                <ol className="space-y-6">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p>{step.instruction}</p>
                        {step.duration && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.duration} seconds
                          </Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </TabsContent>

              <TabsContent value="nutrition" className="animate-fade-in">
                <div className="space-y-6">
                  <NutritionFacts nutrition={recipe.nutritionFacts} />
                  
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={handleNutritionAnalysisClick}
                      className="w-full justify-center"
                    >
                      {showNutrition ? "Hide Analysis" : "Show Health Analysis"}
                    </Button>
                    
                    {showNutrition && (
                      <div className="mt-4 p-4 bg-accent/50 rounded-lg animate-fade-in">
                        {isLoading ? (
                          <p className="text-muted-foreground">Analyzing nutritional benefits...</p>
                        ) : (
                          <p className="text-sm">{nutritionalAnalysis}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="pt-0">
            <Button 
              onClick={startCooking} 
              className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-button transition-all"
            >
              <PlayCircle className="h-4 w-4" />
              Start Cooking
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default RecipeCard;
