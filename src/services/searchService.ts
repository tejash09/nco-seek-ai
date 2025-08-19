import { supabase } from '@/lib/supabase';
import { SearchResult, SearchMode } from '@/types/search';

export const searchJobs = async (query: string, mode: SearchMode): Promise<SearchResult[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('nco-search', {
      body: {
        query,
        mode,
        top_n: 10
      }
    });

    if (error) {
      console.error('Search API error:', error);
      throw new Error('Search failed');
    }

    return data?.results || [];
  } catch (error) {
    console.error('Search service error:', error);
    throw error;
  }
};