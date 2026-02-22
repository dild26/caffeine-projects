import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Local storage key for domain clicks
const DOMAIN_CLICKS_KEY = 'moap_domain_clicks';

interface DomainClicks {
  [domain: string]: number;
}

function getDomainClicks(): DomainClicks {
  try {
    const stored = localStorage.getItem(DOMAIN_CLICKS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveDomainClicks(clicks: DomainClicks): void {
  try {
    localStorage.setItem(DOMAIN_CLICKS_KEY, JSON.stringify(clicks));
  } catch (error) {
    console.error('Failed to save domain clicks:', error);
  }
}

export function useDomainClicks() {
  return useQuery<DomainClicks>({
    queryKey: ['domainClicks'],
    queryFn: getDomainClicks,
    staleTime: 0, // Always fresh to show real-time updates
  });
}

export function useTrackDomainClick() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domain: string) => {
      const clicks = getDomainClicks();
      clicks[domain] = (clicks[domain] || 0) + 1;
      saveDomainClicks(clicks);
      return clicks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domainClicks'] });
    },
  });
}
