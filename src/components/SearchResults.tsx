import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SearchResult, SearchMode } from '@/types/search';
import { TrendingUp, Hash, FileText, Sparkles, Zap } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  mode: SearchMode;
}

export const SearchResults = ({ results, query, mode }: SearchResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'score-high';
    if (score >= 0.6) return 'score-medium';
    return 'score-low';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.8) return <TrendingUp className="w-3 h-3" />;
    if (score >= 0.6) return <TrendingUp className="w-3 h-3" />;
    return <TrendingUp className="w-3 h-3" />;
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1) + '%';
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-16 space-y-4 animate-fade-in">
        <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">No Results Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any occupations matching "<span className="font-medium">{query}</span>". 
          Try using different keywords or a more general description.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {mode === 'semantic' ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            <span className="font-medium">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </span>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {mode === 'semantic' ? 'Semantic Search' : 'Hybrid Search'}
        </Badge>
      </div>

      {/* Results List */}
      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card 
            key={result.job_id} 
            className="p-6 hover:shadow-card transition-all duration-300 border-0 bg-gradient-card group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              {/* Header with ID and Score */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    <Hash className="w-3 h-3 mr-1" />
                    {result.job_id}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium`}
                      style={{ 
                        backgroundColor: `hsl(var(--${getScoreColor(result.final_score || result.similarity_score || 0)}) / 0.1)`,
                        color: `hsl(var(--${getScoreColor(result.final_score || result.similarity_score || 0)}))`
                      }}
                    >
                      {getScoreIcon(result.final_score || result.similarity_score || 0)}
                      {formatScore(result.final_score || result.similarity_score || 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Title */}
              <div>
                <h3 className="text-xl font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                  {result.job_name}
                </h3>
              </div>

              <Separator />

              {/* Job Description */}
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {result.job_description}
                </p>
              </div>

              {/* Detailed Scores for Hybrid Search */}
              {mode === 'hybrid' && result.semantic_score && result.bm25_score && (
                <>
                  <Separator />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Semantic: {formatScore(result.semantic_score)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Keyword: {formatScore(result.bm25_score)}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>Combined: {formatScore(result.final_score || 0)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          Results sorted by {mode === 'semantic' ? 'semantic similarity' : 'combined relevance score'}
        </p>
      </div>
    </div>
  );
};