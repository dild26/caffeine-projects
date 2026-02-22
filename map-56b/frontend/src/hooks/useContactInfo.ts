import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// Local type definition for ContactInfo (not yet in backend interface)
export interface ContactInfo {
  ceoName: string;
  email: string;
  phone: string;
  whatsapp: string;
  businessAddress: string;
  paypal: string;
  upi: string;
  eth: string;
  socialMedia: {
    facebook: string;
    linkedin: string;
    telegram: string;
    discord: string;
    blogspot: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export function useGetContactInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      
      // Backend method not yet implemented - read from localStorage
      const stored = localStorage.getItem('contactInfo');
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Return default contact info
      return {
        ceoName: 'DILEEP KUMAR D',
        email: 'dild26@gmail.com',
        phone: '+91-962-005-8644',
        whatsapp: '+91-962-005-8644',
        businessAddress: 'Bangalore - 560097, Karnataka, India',
        paypal: 'newgoldenjewel@gmail.com',
        upi: 'secoin@uboi',
        eth: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
        socialMedia: {
          facebook: 'https://facebook.com/dild26',
          linkedin: 'https://www.linkedin.com/in/dild26',
          telegram: 'https://t.me/dilee',
          discord: 'https://discord.com/users/dild26',
          blogspot: 'https://dildiva.blogspot.com',
          instagram: 'https://instagram.com/newgoldenjewel',
          twitter: 'https://twitter.com/dil_sec',
          youtube: 'https://m.youtube.com/@dileepkumard4484/videos',
        },
      };
    },
    enabled: !!actor && !actorFetching,
  });
}
