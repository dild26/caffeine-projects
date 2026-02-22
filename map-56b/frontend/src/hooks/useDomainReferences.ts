import { useQuery } from '@tanstack/react-query';
import { DEFAULT_DOMAIN_REFERENCES } from '../data/defaultDomainReferences';
import type { DomainReference } from '../types';

export function useGetAllDomainReferences() {
  return useQuery<DomainReference[]>({
    queryKey: ['domainReferences'],
    queryFn: async () => {
      // Return all 26 default domain references
      return DEFAULT_DOMAIN_REFERENCES;
    },
    staleTime: Infinity, // Data never goes stale since it's static
  });
}
