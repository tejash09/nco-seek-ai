
import { SearchResult, SearchMode } from '@/types/search';

const API_BASE_URL = 'http://localhost:5000/api';

export const searchJobs = async (query: string, mode: SearchMode): Promise<SearchResult[]> => {
  try {
    if (!query.trim()) {
      return [];
    }

    const endpoint = mode === 'semantic' ? '/search/semantic' : '/search/hybrid';
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        top_n: 10,
        ...(mode === 'hybrid' && { alpha: 0.7 })
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search service error:', error);
    if (error instanceof Error) {
      throw new Error(`Search failed: ${error.message}`);
    }
    throw new Error('Search failed: Unknown error');
  }
};
