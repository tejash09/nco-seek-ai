import { useState } from 'react';
import { Search, Sparkles, Zap } from 'lucide-react';
import { searchJobs } from '@/services/searchService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchResult, SearchMode } from '@/types/search';
import { SearchResults } from './SearchResults';
import { LoadingSpinner } from './LoadingSpinner';

interface SearchInterfaceProps {
  onSearch?: (query: string, mode: SearchMode) => Promise<SearchResult[]>;
}

export const SearchInterface = ({ onSearch }: SearchInterfaceProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('semantic');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = onSearch ? 
        await onSearch(query, searchMode) : 
        await searchJobs(query, searchMode);
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-primary-foreground font-medium shadow-glow">
          <Sparkles className="w-4 h-4" />
          NCO Semantic Search
        </div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Find Your Perfect Career Match
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search through the National Classification of Occupations using advanced AI-powered semantic search
        </p>
      </div>

      {/* Search Interface */}
      <Card className="p-6 shadow-search bg-gradient-card border-0">
        <div className="space-y-4">
          {/* Search Mode Toggle */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={searchMode === 'semantic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('semantic')}
              className="transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Semantic Search
            </Button>
            <Button
              variant={searchMode === 'hybrid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('hybrid')}
              className="transition-all"
            >
              <Zap className="w-4 h-4 mr-2" />
              Hybrid Search
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="e.g., software engineer, data scientist, marketing manager..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 pr-20 h-14 text-lg border-0 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
              disabled={isLoading}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6"
            >
              {isLoading ? <LoadingSpinner className="w-4 h-4" /> : 'Search'}
            </Button>
          </div>

          {/* Search Mode Description */}
          <div className="text-center">
            <Badge variant="secondary" className="px-3 py-1">
              {searchMode === 'semantic' ? (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-powered meaning-based search
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 mr-1" />
                  Combines AI understanding with keyword matching
                </>
              )}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="animate-fade-in">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <LoadingSpinner className="w-8 h-8" />
            <p className="text-muted-foreground">Searching through NCO database...</p>
          </div>
        ) : hasSearched ? (
          <SearchResults results={results} query={query} mode={searchMode} />
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">
              Enter a job title or description to start searching
            </p>
          </div>
        )}
      </div>
    </div>
  );
};