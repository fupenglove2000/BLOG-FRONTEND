import { Card, Descriptions, Typography, Tag } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/date';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Typography.Title level={4}>Profile</Typography.Title>

      <Card style={{ maxWidth: 600 }}>
        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={user.is_active ? 'green' : 'red'}>
              {user.is_active ? 'Active' : 'Inactive'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Joined">{formatDate(user.created_at)}</Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
}
