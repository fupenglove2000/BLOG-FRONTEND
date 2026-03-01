import type { Category } from './category';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  author_id: number;
  category_id: number | null;
  created_at: string;
  updated_at: string | null;
  category: Category | null;
}

export interface PostCreate {
  title: string;
  content: string;
  published?: boolean;
  category_id?: number;
}

export interface PostUpdate {
  title?: string;
  content?: string;
  published?: boolean;
  category_id?: number;
}

export interface PostListParams {
  skip?: number;
  limit?: number;
  search?: string;
  category_id?: number;
}
