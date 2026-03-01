import { useState } from 'react';
import { Form, Input, Button, Switch, Select, Typography, message, Card } from 'antd';
import { useNavigate } from 'react-router';
import MDEditor from '@uiw/react-md-editor';
import { createPost } from '@/api/posts';
import { useCategories } from '@/hooks/useCategories';
import type { PostCreate } from '@/types/post';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { categories, loading: catsLoading } = useCategories();

  const handleSubmit = async (values: PostCreate) => {
    setSubmitting(true);
    try {
      await createPost({ ...values, content });
      message.success('Post created');
      navigate('/admin/posts');
    } catch {
      message.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Typography.Title level={4}>Create Post</Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ published: false }}>
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
            Create
          </Button>
          <Button onClick={() => navigate('/admin/posts')}>Cancel</Button>
        </div>
      </Form>
    </>
  );
}
