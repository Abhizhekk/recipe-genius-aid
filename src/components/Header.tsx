
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChefHat, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10",
      isScrolled 
        ? "bg-white/80 backdrop-blur-md shadow-subtle" 
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-primary animate-float" />
          <span className="font-medium text-xl">RecipeAI</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#" 
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Home
          </a>
          <a 
            href="#recipes" 
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Recipes
          </a>
          <a 
            href="#features" 
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Features
          </a>
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90 text-white shadow-button transition-all"
          >
            Get Started
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-subtle animate-slide-up">
          <nav className="flex flex-col py-4 px-6 space-y-4">
            <a 
              href="#" 
              className="py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#recipes" 
              className="py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recipes
            </a>
            <a 
              href="#features" 
              className="py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-white w-full justify-center shadow-button transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
