import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/common/Loading';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
