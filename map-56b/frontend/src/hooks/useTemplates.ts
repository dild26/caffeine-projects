import { useQuery } from '@tanstack/react-query';
import type { JsonSchemaTemplate, MlPromptTemplate } from '../types';

export function useGetAllJsonSchemaTemplates() {
  return useQuery<JsonSchemaTemplate[]>({
    queryKey: ['jsonSchemaTemplates'],
    queryFn: async () => {
      // Return empty array - templates feature not implemented in backend
      return [];
    },
    staleTime: Infinity,
  });
}

export function useGetAllMlPromptTemplates() {
  return useQuery<MlPromptTemplate[]>({
    queryKey: ['mlPromptTemplates'],
    queryFn: async () => {
      // Return empty array - templates feature not implemented in backend
      return [];
    },
    staleTime: Infinity,
  });
}
