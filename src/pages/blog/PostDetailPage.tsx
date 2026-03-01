import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Typography, Tag, Breadcrumb, Divider, Result, Button } from 'antd';
import { CalendarOutlined, FolderOutlined, EditOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPost } from '@/api/posts';
import type { Post } from '@/types/post';
import { formatDate } from '@/utils/date';
import Loading from '@/components/common/Loading';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    getPost(Number(postId))
      .then(setPost)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <Loading />;
  if (error || !post) {
    return (
      <Result
        status="404"
        title="Post Not Found"
        extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
      />
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/')}>Home</a> },
          { title: post.title },
        ]}
        style={{ marginBottom: 24 }}
      />

      <Typography.Title level={2}>{post.title}</Typography.Title>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {post.category && (
          <Tag
            color="blue"
            icon={<FolderOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/category/${post.category_id}`)}
          >
            {post.category.name}
          </Tag>
        )}
        <Typography.Text type="secondary">
          <CalendarOutlined style={{ marginRight: 4 }} />
          {formatDate(post.created_at)}
        </Typography.Text>
        {post.updated_at && (
          <Typography.Text type="secondary">
            <EditOutlined style={{ marginRight: 4 }} />
            Updated: {formatDate(post.updated_at)}
          </Typography.Text>
        )}
      </div>

      <Divider />

      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
