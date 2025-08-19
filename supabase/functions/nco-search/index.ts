import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  query: string;
  mode: 'semantic' | 'hybrid';
  top_n?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, mode, top_n = 5 }: SearchRequest = await req.json()

    if (!query?.trim()) {
      return Response.json(
        { error: 'Query is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    let results;

    if (mode === 'semantic') {
      // Use Supabase vector search for semantic search
      const { data, error } = await supabaseClient.rpc('semantic_search_jobs', {
        query_text: query,
        match_count: top_n
      });

      if (error) throw error;
      results = data;
    } else {
      // Hybrid search combining semantic + keyword
      const { data, error } = await supabaseClient.rpc('hybrid_search_jobs', {
        query_text: query,
        match_count: top_n
      });

      if (error) throw error;
      results = data;
    }

    return Response.json(
      { results },
      { headers: corsHeaders }
    )

  } catch (error) {
    console.error('Search error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
})