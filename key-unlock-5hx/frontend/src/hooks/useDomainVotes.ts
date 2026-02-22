import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Local storage key for domain votes
const DOMAIN_VOTES_KEY = 'moap_domain_votes';

interface DomainVote {
  upvotes: number;
  downvotes: number;
}

interface DomainVotes {
  [domain: string]: DomainVote;
}

function getDomainVotes(): DomainVotes {
  try {
    const stored = localStorage.getItem(DOMAIN_VOTES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveDomainVotes(votes: DomainVotes): void {
  try {
    localStorage.setItem(DOMAIN_VOTES_KEY, JSON.stringify(votes));
  } catch (error) {
    console.error('Failed to save domain votes:', error);
  }
}

export function useDomainVotes() {
  return useQuery<DomainVotes>({
    queryKey: ['domainVotes'],
    queryFn: getDomainVotes,
    staleTime: 0, // Always fresh to show real-time updates
  });
}

export function useVoteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ domain, voteType }: { domain: string; voteType: 'up' | 'down' }) => {
      const votes = getDomainVotes();
      
      if (!votes[domain]) {
        votes[domain] = { upvotes: 0, downvotes: 0 };
      }
      
      if (voteType === 'up') {
        votes[domain].upvotes += 1;
      } else {
        votes[domain].downvotes += 1;
      }
      
      saveDomainVotes(votes);
      return votes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domainVotes'] });
    },
  });
}
