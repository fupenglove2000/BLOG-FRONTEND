import { RouterProvider } from 'react-router';
import { ConfigProvider, App as AntdApp } from 'antd';
import { AuthProvider } from '@/contexts/AuthContext';
import router from '@/router';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
