import { useState, useEffect, useCallback, useRef } from 'react';
import type { Post, PostListParams } from '@/types/post';
import { getPosts } from '@/api/posts';

export function usePosts(initialParams?: PostListParams) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // We useRef to keep track of the initial parameters to avoid it causing re-renders
  // if an object literal is passed into the hook.
  const paramsRef = useRef(initialParams);

  const fetchPosts = useCallback(async (params?: PostListParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(params ?? paramsRef.current);
      setPosts(data);
    } catch {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
