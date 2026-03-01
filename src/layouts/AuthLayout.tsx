import { Layout, Row, Col } from 'antd';
import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Outlet />
        </Col>
      </Row>
    </Layout>
  );
}
