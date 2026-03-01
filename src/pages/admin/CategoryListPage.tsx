import { useState } from 'react';
import { Table, Button, Typography, Popconfirm, message, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCategories } from '@/hooks/useCategories';
import { createCategory, deleteCategory } from '@/api/categories';
import { formatDate } from '@/utils/date';
import type { Category } from '@/types/category';

export default function CategoryListPage() {
  const { categories, loading, refetch } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async (values: { name: string; slug: string }) => {
    setCreating(true);
    try {
      await createCategory(values);
      message.success('Category created');
      setModalOpen(false);
      form.resetFields();
      refetch();
    } catch {
      message.error('Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      message.success('Category deleted');
      refetch();
    } catch {
      message.error('Failed to delete category');
    }
  };

  const handleNameChange = () => {
    const name = form.getFieldValue('name') || '';
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    form.setFieldsValue({ slug });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: unknown, record: Category) => (
        <Popconfirm title="Delete this category?" onConfirm={() => handleDelete(record.id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Categories</Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          New Category
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title="New Category"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
            <Input placeholder="Category name" onChange={handleNameChange} />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please enter a slug' }]}>
            <Input placeholder="category-slug" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={creating}>Create</Button>
            <Button onClick={() => { setModalOpen(false); form.resetFields(); }}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
}
