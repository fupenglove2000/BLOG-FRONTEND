import apiClient from './client';
import type { User, Token, RegisterForm } from '@/types/auth';

export const login = async (username: string, password: string): Promise<Token> => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  const { data } = await apiClient.post<Token>('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return data;
};

export const register = async (form: RegisterForm): Promise<User> => {
  const { data } = await apiClient.post<User>('/auth/register', form);
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
};
