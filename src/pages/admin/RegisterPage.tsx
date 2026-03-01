import { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; username: string; password: string }) => {
    setLoading(true);
    try {
      await register({ email: values.email, username: values.username, password: values.password });
      message.success('Registration successful! Please sign in.');
      navigate('/admin/login');
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      message.error(detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <div>
          <ReadOutlined style={{ fontSize: 40, color: '#1677ff' }} />
          <Typography.Title level={3} style={{ marginTop: 8 }}>Create Account</Typography.Title>
          <Typography.Text type="secondary">Register a new account</Typography.Text>
        </div>
        <Form layout="vertical" onFinish={onFinish} size="large" style={{ textAlign: 'left' }}>
          <Form.Item name="email" rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Typography.Text type="secondary">
              Already have an account? <Link to="/admin/login">Sign In</Link>
            </Typography.Text>
          </div>
        </Form>
      </Space>
    </Card>
  );
}
