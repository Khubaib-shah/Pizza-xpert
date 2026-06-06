import { httpClient } from '../../../infrastructure/http/client';
import { Pizza, Category } from '../../../types';

export const pizzaApi = {
  getAll: async () => {
    const { data } = await httpClient.get<Pizza[]>('/pizzas');
    return data;
  },
  getCategories: async () => {
    const { data } = await httpClient.get<Category[]>('/categories');
    return data;
  },
  getMenuConfig: async () => {
    const { data } = await httpClient.get('/menu-config');
    return data;
  }
};
