import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Skip } from '../types/skip';

interface SkipsResponse {
  data?: Skip[];
}

const fetchSkips = async (
  postcode: string = import.meta.env.VITE_DEFAULT_POSTCODE || 'NR32',
  area: string = import.meta.env.VITE_DEFAULT_AREA || 'Lowestoft'
): Promise<Skip[]> => {
  const response = await apiService.getSkipsByLocation(postcode, area);
  
  // Handle different response formats
  if (Array.isArray(response)) {
    return response;
  } else if (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    Array.isArray((response as SkipsResponse).data)
  ) {
    return (response as SkipsResponse).data || [];
  }
  
  return [];
};

export const useSkips = (
  postcode?: string,
  area?: string
) => {
  const queryClient = useQueryClient();
  const finalPostcode = postcode || import.meta.env.VITE_DEFAULT_POSTCODE || 'NR32';
  const finalArea = area || import.meta.env.VITE_DEFAULT_AREA || 'Lowestoft';
  
  const query = useQuery({
    queryKey: ['skips', finalPostcode, finalArea],
    queryFn: () => fetchSkips(finalPostcode, finalArea),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
  });

  // Handle caching individual skip data when query succeeds
  useEffect(() => {
    if (query.data && query.isSuccess) {
      query.data.forEach((skip) => {
        queryClient.setQueryData(['skip', skip.id], skip);
      });
    }
  }, [query.data, query.isSuccess, queryClient]);

  return query;
};
 
export const useSkip = (skipId: string | number) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['skip', skipId],
    queryFn: async () => {
      // This will likely be served from cache if skip was prefetched
      const cachedSkip = queryClient.getQueryData(['skip', skipId]);
      if (cachedSkip) return cachedSkip;
      
      // Fallback: fetch from API if not in cache
      return apiService.get(`/skips/${skipId}`);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for individual skip data
    enabled: !!skipId,
  });
};
 
export const usePrefetchSkips = () => {
  const queryClient = useQueryClient();
  
  return {
    prefetchSkipsByLocation: (postcode: string, area: string) => {
      queryClient.prefetchQuery({
        queryKey: ['skips', postcode, area],
        queryFn: () => fetchSkips(postcode, area),
        staleTime: 5 * 60 * 1000,
      });
    },
    
    prefetchSkip: (skipId: string | number) => {
      queryClient.prefetchQuery({
        queryKey: ['skip', skipId],
        queryFn: () => apiService.get(`/skips/${skipId}`),
        staleTime: 10 * 60 * 1000,
      });
    }
  };
};