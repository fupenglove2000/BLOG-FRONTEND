import apiClient from './client';
import type { Category, CategoryCreate } from '@/types/category';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/categories/');
  return data;
};

export const createCategory = async (category: CategoryCreate): Promise<Category> => {
  const { data } = await apiClient.post<Category>('/categories/', category);
  return data;
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await apiClient.delete(`/categories/${categoryId}`);
};
