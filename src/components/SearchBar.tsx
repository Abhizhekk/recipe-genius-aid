
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, XCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, type: 'ingredients' | 'recipe') => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search recipes or ingredients..." }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'ingredients' | 'recipe'>('recipe');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <Card className="w-full border border-border/50 shadow-subtle">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="pr-10"
            />
            {query && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XCircle className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex bg-secondary rounded-md">
            <Button
              type="button"
              variant={searchType === 'recipe' ? "default" : "ghost"}
              size="sm"
              onClick={() => setSearchType('recipe')}
              className="rounded-r-none"
            >
              Recipe Name
            </Button>
            <Button
              type="button"
              variant={searchType === 'ingredients' ? "default" : "ghost"}
              size="sm"
              onClick={() => setSearchType('ingredients')}
              className="rounded-l-none"
            >
              Ingredients
            </Button>
          </div>
          
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
