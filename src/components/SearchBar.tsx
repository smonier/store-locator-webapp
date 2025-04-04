
import React, { useState, useEffect } from 'react';
import { useStores } from '../contexts/useStores';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [query, setQuery] = useState('');
  const { searchStores } = useStores();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchStores(query);
  };
  
  // Debounce search for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      searchStores(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, searchStores]);
  
  return (
    <form onSubmit={handleSearch} className={`relative ${className || ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search stores by name or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-16 bg-background border-muted"
        />
        <Button 
          type="submit" 
          size="sm" 
          variant="ghost"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 text-xs"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
