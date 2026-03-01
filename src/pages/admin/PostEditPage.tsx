import { useEffect, useState } from 'react';
import { Form, Input, Button, Switch, Select, Typography, message, Card, Result } from 'antd';
import { useParams, useNavigate } from 'react-router';
import MDEditor from '@uiw/react-md-editor';
import { getPost, updatePost } from '@/api/posts';
import { useCategories } from '@/hooks/useCategories';
import type { Post, PostUpdate } from '@/types/post';
import Loading from '@/components/common/Loading';

export default function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const { categories, loading: catsLoading } = useCategories();

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    getPost(Number(postId))
      .then((data) => {
        setPost(data);
        setContent(data.content);
        form.setFieldsValue({
          title: data.title,
          category_id: data.category_id ?? undefined,
          published: data.published,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [postId, form]);

  const handleSubmit = async (values: PostUpdate) => {
    if (!postId) return;
    setSubmitting(true);
    try {
      await updatePost(Number(postId), { ...values, content });
      message.success('Post updated');
      navigate('/admin/posts');
    } catch {
      message.error('Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !post) {
    return (
      <Result
        status="404"
        title="Post Not Found"
        extra={<Button type="primary" onClick={() => navigate('/admin/posts')}>Back to Posts</Button>}
      />
    );
  }

  return (
    <>
      <Typography.Title level={4}>Edit Post</Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card style={{ marginBottom: 16 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input placeholder="Post title" size="large" />
          </Form.Item>

          <Form.Item name="category_id" label="Category">
            <Select
              placeholder="Select a category"
              allowClear
              loading={catsLoading}
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>

          <Form.Item name="published" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Content</Typography.Text>
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={500}
          />
        </Card>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Save
          </Button>
          <Button onClick={() => navigate('/admin/posts')}>Cancel</Button>
        </div>
      </Form>
    </>
  );
}
