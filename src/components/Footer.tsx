
import { ChefHat, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-border/50 py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="font-medium text-lg">RecipeAI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered cooking assistant to help you create delicious meals with ingredients you already have.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-4">Features</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Recipe Generator</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Cooking Timer</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Nutritional Analysis</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Ingredient Substitutions</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-4">About</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">AI Technology</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RecipeAI. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
