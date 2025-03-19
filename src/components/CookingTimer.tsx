
import { useState, useEffect, useRef } from 'react';
import { Recipe, CookingStep } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  Timer, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  X, 
  AlertCircle
} from 'lucide-react';

interface CookingTimerProps {
  recipe: Recipe;
  onClose: () => void;
}

const CookingTimer = ({ recipe, onClose }: CookingTimerProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const currentStep = recipe.steps[currentStepIndex];
  const totalSteps = recipe.steps.length;
  
  // Initialize timer for the current step
  useEffect(() => {
    if (currentStep && currentStep.duration) {
      setTimeRemaining(currentStep.duration);
    } else {
      setTimeRemaining(0);
    }
    
    // Calculate overall progress
    const completedSteps = currentStepIndex;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    setOverallProgress(progressPercentage);
    
    // Read out the current step if audio is enabled
    if (audioEnabled) {
      speakText(currentStep.instruction);
    }
  }, [currentStepIndex, currentStep, totalSteps]);
  
  // Timer logic
  useEffect(() => {
    let timerId: number;
    
    if (isRunning && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0 && currentStep?.duration) {
      // Timer completed
      if (audioEnabled) {
        playAlertSound();
      }
      
      toast({
        title: "Step completed!",
        description: "Move to the next step when you're ready",
      });
      
      setIsRunning(false);
    }
    
    return () => {
      clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, currentStep, toast, audioEnabled]);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsRunning(false);
    }
  };
  
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setIsRunning(false);
    }
  };
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (speechSynthesisRef.current && !audioEnabled) {
      window.speechSynthesis.cancel();
    }
  };
  
  const speakText = (text: string) => {
    if (!audioEnabled) return;
    
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower rate
      utterance.pitch = 1;
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const playAlertSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.src = "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-2573.mp3";
      }
      
      audioRef.current.play();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Card className="border border-border/50 shadow-elevation">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Cooking: {recipe.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-medium">Step {currentStepIndex + 1} of {totalSteps}</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
        
        <div className="space-y-4">
          <div className="bg-accent/30 p-4 rounded-lg">
            <p className="text-lg">{currentStep.instruction}</p>
            
            {currentStep.duration ? (
              <div className="mt-4 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
                  <Timer className="h-4 w-4" />
                  <span>Time: {formatTime(timeRemaining)}</span>
                </div>
                
                {isRunning ? (
                  <div className="w-36 h-36 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center animate-pulse-soft">
                    <span className="text-3xl font-semibold">{formatTime(timeRemaining)}</span>
                  </div>
                ) : (
                  <div className="w-36 h-36 rounded-full bg-muted/30 border-4 border-muted flex items-center justify-center">
                    <span className="text-3xl font-semibold">{formatTime(timeRemaining)}</span>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTimer}
                    className="h-10 w-10 rounded-full"
                  >
                    {isRunning ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex justify-center">
                <Badge variant="outline" className="py-1.5">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  No timer for this step
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="default"
            onClick={nextStep}
            disabled={currentStepIndex === totalSteps - 1}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          className="h-10 w-10 rounded-full"
        >
          {audioEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CookingTimer;
