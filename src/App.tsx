import { RouterProvider } from 'react-router';
import { ConfigProvider } from 'antd';
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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  );
}
