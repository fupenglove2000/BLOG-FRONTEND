import { useState } from 'react';
import { Table, Button, Tag, Space, Typography, Popconfirm, message, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { usePosts } from '@/hooks/usePosts';
import { deletePost } from '@/api/posts';
import { formatDate } from '@/utils/date';
import type { Post } from '@/types/post';

const PAGE_SIZE = 10;

export default function PostListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { posts, loading, refetch } = usePosts({
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: search || undefined,
  });

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId);
      message.success('Post deleted');
      refetch({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE, search: search || undefined });
    } catch {
      message.error('Failed to delete post');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string, record: Post) => (
        <a onClick={() => navigate(`/admin/posts/${record.id}/edit`)}>{title}</a>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 140,
      render: (_: unknown, record: Post) =>
        record.category ? <Tag color="blue">{record.category.name}</Tag> : '-',
    },
    {
      title: 'Status',
      dataIndex: 'published',
      key: 'published',
      width: 100,
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'orange'}>{published ? 'Published' : 'Draft'}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Post) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/posts/${record.id}/edit`)}
          />
          <Popconfirm title="Delete this post?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Posts</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/posts/create')}>
          New Post
        </Button>
      </div>

      <Input.Search
        placeholder="Search posts..."
        prefix={<SearchOutlined />}
        allowClear
        onSearch={(value) => { setSearch(value); setPage(1); }}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      <Table
        dataSource={posts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: posts.length === PAGE_SIZE ? page * PAGE_SIZE + 1 : page * PAGE_SIZE,
          onChange: (p) => {
            setPage(p);
            refetch({ skip: (p - 1) * PAGE_SIZE, limit: PAGE_SIZE, search: search || undefined });
          },
          showSizeChanger: false,
        }}
      />
    </>
  );
}
