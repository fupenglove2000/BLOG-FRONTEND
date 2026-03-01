import { RouterProvider } from 'react-router';
import { ConfigProvider, App as AntdApp, theme } from 'antd';
import { AuthProvider } from '@/contexts/AuthContext';
import router from '@/router';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1', // Indigo to match Tailwind
          borderRadius: 8,
          colorBgContainer: 'rgba(30, 41, 59, 0.4)', // Glassmorphism dark background 
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
