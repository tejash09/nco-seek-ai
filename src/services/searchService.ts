
import { SearchResult, SearchMode } from '@/types/search';
import { searchJobs as localSearchJobs } from './localSearchService';

export const searchJobs = async (query: string, mode: SearchMode): Promise<SearchResult[]> => {
  try {
    return await localSearchJobs(query, mode);
  } catch (error) {
    console.error('Search service error:', error);
    throw error;
  }
};
