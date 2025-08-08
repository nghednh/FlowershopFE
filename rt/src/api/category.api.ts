import { IBackendRes, ICategory } from "../types/backend";
import instance from "../config/axios-customize";

export const CategoryService = {
  getCategories: (): Promise<ICategory[]> => {
    return instance.get('/api/category');
  },

  createCategory: (category: Omit<ICategory, 'id'>): Promise<IBackendRes<ICategory>> => {
    return instance.post('/api/category', category);
  },

  updateCategory: (id: number, category: Partial<ICategory>): Promise<IBackendRes<ICategory>> => {
    return instance.put(`/api/category/${id}`, category);
  },

  deleteCategory: (id: number): Promise<{ success: boolean }> => {
    return instance.delete(`/api/category/${id}`);
  },
};
