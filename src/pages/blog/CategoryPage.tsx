import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Typography, Tag, Pagination, Empty, Skeleton, List, Breadcrumb } from 'antd';
import { CalendarOutlined, FolderOutlined } from '@ant-design/icons';
import { getPosts } from '@/api/posts';
import { getCategories } from '@/api/categories';
import type { Post } from '@/types/post';
import type { Category } from '@/types/category';
import { fromNow } from '@/utils/date';

const PAGE_SIZE = 10;

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async (p: number) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const data = await getPosts({
        category_id: Number(categoryId),
        skip: (p - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    getCategories().then((cats) => {
      const found = cats.find((c) => c.id === Number(categoryId));
      setCategory(found ?? null);
    });
    setPage(1);
    fetchPosts(1);
  }, [categoryId, fetchPosts]);

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchPosts(p);
  };

  const hasMore = posts.length === PAGE_SIZE;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/')}>Home</a> },
          { title: category?.name ?? 'Category' },
        ]}
        style={{ marginBottom: 24 }}
      />

      <Typography.Title level={3}>
        <FolderOutlined style={{ marginRight: 8 }} />
        {category?.name ?? 'Category'}
      </Typography.Title>

      {loading ? (
        <List
          dataSource={[1, 2, 3]}
          renderItem={() => (
            <Card style={{ marginBottom: 16 }}>
              <Skeleton active />
            </Card>
          )}
        />
      ) : posts.length === 0 ? (
        <Empty description="No posts in this category" />
      ) : (
        <>
          {posts.map((post) => (
            <Card
              key={post.id}
              hoverable
              style={{ marginBottom: 16 }}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <Typography.Title level={4} style={{ marginBottom: 8 }}>
                {post.title}
              </Typography.Title>
              <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
              </Typography.Paragraph>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {post.category && (
                  <Tag color="blue" icon={<FolderOutlined />}>{post.category.name}</Tag>
                )}
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  <CalendarOutlined style={{ marginRight: 4 }} />
                  {fromNow(post.created_at)}
                </Typography.Text>
              </div>
            </Card>
          ))}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={hasMore ? page * PAGE_SIZE + 1 : page * PAGE_SIZE}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
