
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RecipeGenerator from '@/components/RecipeGenerator';
import SavedRecipes from '@/components/SavedRecipes';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChefHat, 
  Clock, 
  Utensils, 
  BarChart,
  MessageCircle,
  Globe,
  Camera,
  BookOpen,
  Video,
  Share2
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('generator');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (query: string, type: 'ingredients' | 'recipe') => {
    scrollToSection('generator');
    // The actual search will be handled by the RecipeGenerator component
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[70%] bg-gradient-to-b from-accent/30 to-transparent -z-10" />
          
          <div className={`max-w-7xl mx-auto ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="mb-4 inline-block">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Powered by Gemini 1.5 Flash
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Cook Smarter, Not Harder with AI
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Transform your available ingredients into delicious recipes with our AI-powered cooking assistant. No more food waste, no more recipe hunting.
              </p>
              
              <div className="mb-8 max-w-xl mx-auto">
                <SearchBar 
                  onSearch={handleSearch} 
                  placeholder="Search for recipes like 'Pasta Carbonara' or ingredients..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white shadow-button transition-all"
                  onClick={() => scrollToSection('generator')}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 text-primary hover:bg-primary/5"
                  onClick={() => scrollToSection('features')}
                >
                  How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Recipe Generator */}
        <section id="generator" className={`py-10 px-6 md:px-10 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
          <RecipeGenerator />
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 px-6 md:px-10 bg-accent/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Discover All Features</h2>
              <p className="text-muted-foreground">
                Our AI-powered platform offers a comprehensive set of tools to make your cooking experience seamless and enjoyable.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<ChefHat />}
                title="AI Recipe Generator"
                description="Turn your available ingredients into delicious, customized recipes in seconds."
                delay={0.3}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<Utensils />}
                title="Ingredient Substitutions"
                description="Missing an ingredient? Our AI suggests perfect alternatives."
                delay={0.4}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<Clock />}
                title="Step-by-Step Cooking Guide"
                description="Follow voice-guided instructions with integrated timers for each step."
                delay={0.5}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<BarChart />}
                title="Nutrition Analysis"
                description="Get detailed nutritional information and health benefits for every recipe."
                delay={0.6}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<Globe />}
                title="Multi-Language Support"
                description="Enjoy recipes and cooking instructions in multiple languages."
                delay={0.7}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<BookOpen />}
                title="Personalized Recipe Book"
                description="Save your favorite recipes and create customized meal plans."
                delay={0.8}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<Camera />}
                title="Food Recognition"
                description="Snap a photo of your ingredients and let AI identify them for you."
                delay={0.9}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<Video />}
                title="Cooking Videos"
                description="AI-generated short video guides with narrated instructions."
                delay={1.0}
                isLoaded={isLoaded}
              />
              <FeatureCard 
                icon={<Share2 />}
                title="Community & Sharing"
                description="Share your creations and discover recipes from other users."
                delay={1.1}
                isLoaded={isLoaded}
              />
            </div>
          </div>
        </section>
        
        {/* Saved Recipes Section */}
        <section id="saved-recipes" className="py-20 px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <SavedRecipes />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Cooking?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start creating delicious recipes with what you already have in your kitchen.
              Let AI help you cook smarter, reduce waste, and enjoy new flavors.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white shadow-button transition-all"
              onClick={() => scrollToSection('generator')}
            >
              Generate Your First Recipe
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isLoaded: boolean;
}

const FeatureCard = ({ icon, title, description, delay, isLoaded }: FeatureCardProps) => {
  return (
    <Card 
      className={`border border-border/50 hover:shadow-elevation transition-all duration-300 h-full overflow-hidden ${
        isLoaded ? 'animate-fade-in' : 'opacity-0'
      }`} 
      style={{ animationDelay: `${delay}s` }}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground flex-grow">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
