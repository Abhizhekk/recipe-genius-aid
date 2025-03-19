
import { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookMarked, Clock, ChefHat, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  
  // Mock data - in a real app, this would come from localStorage or a database
  useEffect(() => {
    // This would be replaced with actual data fetching
    setSavedRecipes([]);
    setRecentRecipes([]);
  }, []);
  
  const handleRemoveRecipe = (recipe: Recipe) => {
    // Remove from saved recipes
    setSavedRecipes(savedRecipes.filter(r => r.id !== recipe.id));
    toast.success(`Removed ${recipe.title} from saved recipes`);
  };
  
  if (savedRecipes.length === 0 && recentRecipes.length === 0) {
    return (
      <Card className="border border-border/50 shadow-subtle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5" />
            Your Recipe Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookMarked className="h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-medium mt-4">No Saved Recipes Yet</h3>
          <p className="text-muted-foreground mt-2 max-w-lg">
            Save your favorite recipes to access them quickly anytime.
            Click the bookmark icon on any recipe to add it to your collection.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border border-border/50 shadow-subtle">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookMarked className="h-5 w-5" />
          Your Recipe Collection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="saved">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              <span>Saved</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Recent</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved">
            {savedRecipes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No saved recipes yet</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {savedRecipes.map((recipe) => (
                    <RecipeItem 
                      key={recipe.id} 
                      recipe={recipe}
                      onRemove={() => handleRemoveRecipe(recipe)}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            {recentRecipes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No recent recipes</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {recentRecipes.map((recipe) => (
                    <RecipeItem 
                      key={recipe.id} 
                      recipe={recipe}
                      showRemoveButton={false}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface RecipeItemProps {
  recipe: Recipe;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

const RecipeItem = ({ recipe, onRemove, showRemoveButton = true }: RecipeItemProps) => {
  const placeholderImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
  
  return (
    <div className="flex gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors">
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={recipe.imageUrl || placeholderImage} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{recipe.title}</h4>
        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-3.5 w-3.5" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            View
          </Button>
          {showRemoveButton && onRemove && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRemove}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedRecipes;
