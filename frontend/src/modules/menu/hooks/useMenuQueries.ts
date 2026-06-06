import { useQuery } from '@tanstack/react-query';
import { pizzaApi } from '../api/pizza.api';

export const usePizzas = () => {
  return useQuery({
    queryKey: ['pizzas'],
    queryFn: pizzaApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: pizzaApi.getCategories,
    staleTime: Infinity, // Infinity cache (rarely changes)
  });
};

export const useMenuConfig = () => {
  return useQuery({
    queryKey: ['menu-config'],
    queryFn: pizzaApi.getMenuConfig,
    staleTime: Infinity,
  });
};
