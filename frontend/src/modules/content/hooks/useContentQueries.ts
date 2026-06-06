import { useQuery } from '@tanstack/react-query';
import { contentApi } from '../api/content.api';

export const useLandingContent = () => {
  return useQuery({
    queryKey: ['landing-content'],
    queryFn: contentApi.getLandingContent,
    staleTime: 30 * 60 * 1000, // 30 minutes cache for landing content
  });
};
