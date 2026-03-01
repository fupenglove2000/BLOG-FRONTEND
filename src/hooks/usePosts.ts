import { useState, useEffect, useCallback } from 'react';
import type { Post, PostListParams } from '@/types/post';
import { getPosts } from '@/api/posts';

export function usePosts(initialParams?: PostListParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (params?: PostListParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(params ?? initialParams);
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
