import apiClient from './client';
import type { Post, PostCreate, PostUpdate, PostListParams } from '@/types/post';

export const getPosts = async (params?: PostListParams): Promise<Post[]> => {
  const { data } = await apiClient.get<Post[]>('/posts/', { params });
  return data;
};

export const getPost = async (postId: number): Promise<Post> => {
  const { data } = await apiClient.get<Post>(`/posts/${postId}`);
  return data;
};

export const createPost = async (post: PostCreate): Promise<Post> => {
  const { data } = await apiClient.post<Post>('/posts/', post);
  return data;
};

export const updatePost = async (postId: number, post: PostUpdate): Promise<Post> => {
  const { data } = await apiClient.put<Post>(`/posts/${postId}`, post);
  return data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await apiClient.delete(`/posts/${postId}`);
};
