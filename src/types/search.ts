export interface SearchResult {
  job_id: string;
  job_name: string;
  job_description: string;
  similarity_score?: number;
  semantic_score?: number;
  bm25_score?: number;
  final_score?: number;
}

export type SearchMode = 'semantic' | 'hybrid';

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  mode: SearchMode;
  total_results: number;
}