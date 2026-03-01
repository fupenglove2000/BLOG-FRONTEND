import { createBrowserRouter } from 'react-router';
import BlogLayout from '@/layouts/BlogLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '@/pages/blog/HomePage';
import PostDetailPage from '@/pages/blog/PostDetailPage';
import CategoryPage from '@/pages/blog/CategoryPage';
import LoginPage from '@/pages/admin/LoginPage';
import RegisterPage from '@/pages/admin/RegisterPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import PostListPage from '@/pages/admin/PostListPage';
import PostCreatePage from '@/pages/admin/PostCreatePage';
import PostEditPage from '@/pages/admin/PostEditPage';
import CategoryListPage from '@/pages/admin/CategoryListPage';
import ProfilePage from '@/pages/admin/ProfilePage';
import { Result, Button } from 'antd';

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Page not found"
    extra={<Button type="primary" href="/">Back Home</Button>}
  />
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <BlogLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'post/:postId', element: <PostDetailPage /> },
      { path: 'category/:categoryId', element: <CategoryPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'posts', element: <PostListPage /> },
          { path: 'posts/create', element: <PostCreatePage /> },
          { path: 'posts/:postId/edit', element: <PostEditPage /> },
          { path: 'categories', element: <CategoryListPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
