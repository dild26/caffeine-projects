import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PaginatedSchemes } from '@/backend';

export function useSearchSchemes(
  searchText: string,
  ministryFilter: string | null,
  categoryFilter: string | null,
  page: number,
  pageSize: number
) {
  const { actor, isFetching } = useActor();

  return useQuery<PaginatedSchemes>({
    queryKey: ['schemes', 'search', searchText, ministryFilter, categoryFilter, page, pageSize],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.searchSchemes(
        searchText,
        ministryFilter,
        categoryFilter,
        BigInt(page),
        BigInt(pageSize)
      );
    },
    enabled: !!actor && !isFetching,
  });
}
