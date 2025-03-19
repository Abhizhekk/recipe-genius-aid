
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Recipe } from '@/types';
import { Camera, Star, Image, Plus, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

interface CookingFeedbackProps {
  recipe: Recipe;
  onClose: () => void;
  onGeneratePractice?: () => void;
}

const CookingFeedback = ({ recipe, onClose, onGeneratePractice }: CookingFeedbackProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImages([...images, reader.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback!"
    });
    onClose();
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => (
      <Button
        key={i}
        variant="ghost"
        size="icon"
        onClick={() => setRating(i + 1)}
        className={`h-10 w-10 ${rating && i < rating ? 'text-yellow-500' : 'text-muted-foreground'}`}
      >
        <Star className="h-6 w-6" fill={rating && i < rating ? 'currentColor' : 'none'} />
      </Button>
    ));
  };

  return (
    <Card className="border border-border/50 shadow-elevation animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">How did your cooking go?</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Rate your experience</h3>
          <div className="flex items-center justify-center">
            {renderStars()}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Share your thoughts</h3>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="How did it taste? Was the recipe easy to follow?"
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Share photos of your dish</h3>
          <div className="flex flex-wrap gap-3">
            {images.map((src, index) => (
              <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden">
                <img src={src} alt="Food" className="w-full h-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center rounded-md">
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <Camera className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium">Would you like to practice more?</h3>
          <div className="flex gap-3">
            <Badge 
              variant="outline" 
              className="cursor-pointer py-2 px-4 flex items-center gap-2 text-base hover:bg-accent"
              onClick={onGeneratePractice}
            >
              <Image className="h-4 w-4" />
              Get similar recipes
            </Badge>
            <Badge 
              variant="outline" 
              className="cursor-pointer py-2 px-4 flex items-center gap-2 text-base hover:bg-accent"
              onClick={onGeneratePractice}
            >
              <Plus className="h-4 w-4" />
              Advanced version
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} className="flex items-center gap-2">
          <ThumbsDown className="h-4 w-4" />
          Skip
        </Button>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Submit Feedback
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CookingFeedback;
