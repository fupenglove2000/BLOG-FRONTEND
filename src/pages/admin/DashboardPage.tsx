import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Skeleton } from 'antd';
import { FileTextOutlined, TagsOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { getPosts } from '@/api/posts';
import { getCategories } from '@/api/categories';
import type { Post } from '@/types/post';
import type { Category } from '@/types/category';
import { fromNow } from '@/utils/date';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPosts({ limit: 5 }),
      getCategories(),
    ])
      .then(([postsData, catsData]) => {
        setPosts(postsData);
        setCategories(catsData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;

  return (
    <>
      <Typography.Title level={4}>Dashboard</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <Card hoverable onClick={() => navigate('/admin/posts')}>
            <Statistic title="Posts" value={posts.length >= 5 ? '5+' : posts.length} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card hoverable onClick={() => navigate('/admin/categories')}>
            <Statistic title="Categories" value={categories.length} prefix={<TagsOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <Card title="Recent Posts" size="small">
            <List
              dataSource={posts}
              renderItem={(post) => (
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                  extra={
                    <Tag color={post.published ? 'green' : 'orange'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Tag>
                  }
                >
                  <List.Item.Meta
                    title={post.title}
                    description={
                      <span>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {fromNow(post.created_at)}
                        {post.category && (
                          <Tag color="blue" style={{ marginLeft: 8 }}>{post.category.name}</Tag>
                        )}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Categories" size="small">
            <List
              dataSource={categories}
              renderItem={(cat) => (
                <List.Item>
                  <List.Item.Meta title={cat.name} description={cat.slug} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
