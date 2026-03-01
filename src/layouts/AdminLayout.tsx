import { useState } from 'react';
import { Layout, Menu, Button, Typography, Space, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  DashboardOutlined,
  FileTextOutlined,
  TagsOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/posts', icon: <FileTextOutlined />, label: 'Posts' },
  { key: '/admin/categories', icon: <TagsOutlined />, label: 'Categories' },
  { key: '/admin/profile', icon: <UserOutlined />, label: 'Profile' },
  { type: 'divider' as const },
  { key: '/', icon: <HomeOutlined />, label: 'Back to Blog' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { token: { colorBgContainer } } = theme.useToken();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Typography.Title level={5} style={{ margin: 0, color: '#1677ff' }}>
            {collapsed ? 'B' : 'Blog Admin'}
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Space>
            <Typography.Text>{user?.username}</Typography.Text>
            <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: colorBgContainer, borderRadius: 8, minHeight: 360 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
