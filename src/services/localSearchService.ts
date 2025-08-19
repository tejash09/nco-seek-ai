
import { SearchResult, SearchMode } from '@/types/search';
import { ncoJobs } from '@/data/ncoJobs';

// Simple text similarity function (cosine similarity simulation)
const calculateTextSimilarity = (text1: string, text2: string): number => {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Create word frequency maps
  const freq1 = new Map<string, number>();
  const freq2 = new Map<string, number>();
  
  words1.forEach(word => freq1.set(word, (freq1.get(word) || 0) + 1));
  words2.forEach(word => freq2.set(word, (freq2.get(word) || 0) + 1));
  
  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  const allWords = new Set([...words1, ...words2]);
  
  for (const word of allWords) {
    const f1 = freq1.get(word) || 0;
    const f2 = freq2.get(word) || 0;
    
    dotProduct += f1 * f2;
    magnitude1 += f1 * f1;
    magnitude2 += f2 * f2;
  }
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
};

// BM25-like scoring function
const calculateBM25Score = (query: string, document: string): number => {
  const queryTerms = query.toLowerCase().split(/\s+/);
  const docWords = document.toLowerCase().split(/\s+/);
  
  let score = 0;
  const docLength = docWords.length;
  const avgDocLength = 50; // Assumed average document length
  
  for (const term of queryTerms) {
    const termFreq = docWords.filter(word => word.includes(term) || term.includes(word)).length;
    if (termFreq > 0) {
      // Simplified BM25 formula
      const tf = (termFreq * 2.2) / (termFreq + 1.2 * (0.25 + 0.75 * (docLength / avgDocLength)));
      score += tf;
    }
  }
  
  return score / queryTerms.length;
};

const semanticSearch = (query: string): SearchResult[] => {
  const results = ncoJobs.map(job => {
    const fullText = `${job.job_name} ${job.job_description}`;
    const similarity = calculateTextSimilarity(query, fullText);
    
    return {
      job_id: job.job_id,
      job_name: job.job_name,
      job_description: job.job_description,
      similarity_score: similarity
    };
  });
  
  return results
    .filter(result => result.similarity_score > 0.1)
    .sort((a, b) => b.similarity_score - a.similarity_score);
};

const hybridSearch = (query: string): SearchResult[] => {
  const results = ncoJobs.map(job => {
    const fullText = `${job.job_name} ${job.job_description}`;
    const semanticScore = calculateTextSimilarity(query, fullText);
    const bm25Score = calculateBM25Score(query, fullText);
    
    // Combine scores with weights (70% semantic, 30% BM25)
    const finalScore = 0.7 * semanticScore + 0.3 * bm25Score;
    
    return {
      job_id: job.job_id,
      job_name: job.job_name,
      job_description: job.job_description,
      semantic_score: semanticScore,
      bm25_score: bm25Score,
      final_score: finalScore
    };
  });
  
  return results
    .filter(result => result.final_score > 0.1)
    .sort((a, b) => b.final_score - a.final_score);
};

export const searchJobs = async (query: string, mode: SearchMode): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) {
    return [];
  }
  
  const results = mode === 'semantic' ? semanticSearch(query) : hybridSearch(query);
  return results.slice(0, 10); // Return top 10 results
};
