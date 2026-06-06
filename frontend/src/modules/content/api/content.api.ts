import { httpClient } from '../../../infrastructure/http/client';

export const contentApi = {
  getLandingContent: async () => {
    const { data } = await httpClient.get('/content');
    return data;
  },
};
