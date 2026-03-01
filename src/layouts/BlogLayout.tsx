import { Layout, Menu, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router';
import { ReadOutlined, SettingOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

export default function BlogLayout() {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 48px' }}>
        <Typography.Title
          level={4}
          style={{ margin: 0, marginRight: 32, cursor: 'pointer', color: '#1677ff' }}
          onClick={() => navigate('/')}
        >
          <ReadOutlined style={{ marginRight: 8 }} />
          Blog
        </Typography.Title>
        <Menu
          mode="horizontal"
          style={{ flex: 1, border: 'none' }}
          items={[
            { key: 'home', label: 'Home', onClick: () => navigate('/') },
            { key: 'admin', label: 'Admin', icon: <SettingOutlined />, onClick: () => navigate('/admin/dashboard') },
          ]}
        />
      </Header>
      <Content style={{ padding: '32px 48px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', color: '#999' }}>
        Blog &copy; {new Date().getFullYear()} - Built with FastAPI & React
      </Footer>
    </Layout>
  );
}
