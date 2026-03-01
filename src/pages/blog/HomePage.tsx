import { useState, useRef, useCallback } from 'react';
import { Row, Col, Card, Tag, Typography, Input, Pagination, Empty, Skeleton, List } from 'antd';
import { CalendarOutlined, FolderOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { fromNow } from '@/utils/date';

const PAGE_SIZE = 10;

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>();
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const { posts, loading: postsLoading, refetch } = usePosts({
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: search || undefined,
    category_id: activeCategoryId,
  });
  const { categories, loading: catsLoading } = useCategories();

  const handleSearch = useCallback((value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
      refetch({ skip: 0, limit: PAGE_SIZE, search: value || undefined, category_id: activeCategoryId });
    }, 300);
  }, [activeCategoryId, refetch]);

  const handleCategoryClick = (categoryId?: number) => {
    setActiveCategoryId(categoryId);
    setPage(1);
    refetch({ skip: 0, limit: PAGE_SIZE, search: search || undefined, category_id: categoryId });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    refetch({ skip: (p - 1) * PAGE_SIZE, limit: PAGE_SIZE, search: search || undefined, category_id: activeCategoryId });
  };

  const hasMore = posts.length === PAGE_SIZE;

  return (
    <Row gutter={32}>
      <Col xs={24} lg={17}>
        <Input.Search
          placeholder="Search posts..."
          size="large"
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 24 }}
        />

        {postsLoading ? (
          <List
            dataSource={[1, 2, 3]}
            renderItem={() => (
              <Card style={{ marginBottom: 16 }}>
                <Skeleton active />
              </Card>
            )}
          />
        ) : posts.length === 0 ? (
          <Empty description="No posts found" />
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
                <Typography.Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ marginBottom: 12 }}
                >
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
      </Col>

      <Col xs={24} lg={7}>
        <Card title="Categories" size="small">
          {catsLoading ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Tag
                color={!activeCategoryId ? 'blue' : undefined}
                style={{ cursor: 'pointer' }}
                onClick={() => handleCategoryClick(undefined)}
              >
                All
              </Tag>
              {categories.map((cat) => (
                <Tag
                  key={cat.id}
                  color={activeCategoryId === cat.id ? 'blue' : undefined}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.name}
                </Tag>
              ))}
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
}
