import { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('Login successful');
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      message.error(detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <div>
          <ReadOutlined style={{ fontSize: 40, color: '#1677ff' }} />
          <Typography.Title level={3} style={{ marginTop: 8 }}>Blog Admin</Typography.Title>
          <Typography.Text type="secondary">Sign in to your account</Typography.Text>
        </div>
        <Form layout="vertical" onFinish={onFinish} size="large" style={{ textAlign: 'left' }}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign In
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Don't have an account? <Link to="/admin/register">Register</Link>
            </Typography.Text>
          </div>
        </Form>
      </Space>
    </Card>
  );
}
