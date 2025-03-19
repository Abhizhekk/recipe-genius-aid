
import { NutritionFacts as NutritionFactsType } from '@/types';
import { Progress } from '@/components/ui/progress';

interface NutritionFactsProps {
  nutrition: NutritionFactsType;
}

const NutritionFacts = ({ nutrition }: NutritionFactsProps) => {
  const { calories, protein, carbs, fats } = nutrition;
  
  // Calculate macronutrient distribution
  const totalMacros = protein + carbs + fats;
  const proteinPercentage = (protein / totalMacros) * 100;
  const carbsPercentage = (carbs / totalMacros) * 100;
  const fatsPercentage = (fats / totalMacros) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Calories</h3>
          <span className="font-bold text-lg">{calories} kcal</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Macronutrients</h3>
        
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Protein</span>
              <span className="font-medium">{protein}g ({Math.round(proteinPercentage)}%)</span>
            </div>
            <Progress 
              value={proteinPercentage} 
              className="h-2" 
              indicatorClassName="bg-blue-500" 
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Carbohydrates</span>
              <span className="font-medium">{carbs}g ({Math.round(carbsPercentage)}%)</span>
            </div>
            <Progress 
              value={carbsPercentage} 
              className="h-2" 
              indicatorClassName="bg-green-500" 
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Fats</span>
              <span className="font-medium">{fats}g ({Math.round(fatsPercentage)}%)</span>
            </div>
            <Progress 
              value={fatsPercentage} 
              className="h-2" 
              indicatorClassName="bg-yellow-500" 
            />
          </div>
        </div>
      </div>

      {(nutrition.fiber || nutrition.sugar || nutrition.sodium) && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          {nutrition.fiber && (
            <div className="text-center p-2">
              <p className="text-sm text-muted-foreground">Fiber</p>
              <p className="font-medium">{nutrition.fiber}g</p>
            </div>
          )}
          
          {nutrition.sugar && (
            <div className="text-center p-2">
              <p className="text-sm text-muted-foreground">Sugar</p>
              <p className="font-medium">{nutrition.sugar}g</p>
            </div>
          )}
          
          {nutrition.sodium && (
            <div className="text-center p-2">
              <p className="text-sm text-muted-foreground">Sodium</p>
              <p className="font-medium">{nutrition.sodium}mg</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionFacts;
