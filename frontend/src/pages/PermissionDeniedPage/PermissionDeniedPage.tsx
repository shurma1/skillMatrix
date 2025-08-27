import type { FC } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/config/route';

const PermissionDeniedPage: FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status={403}
      title="403"
      subTitle="У вас нет нужных разрешений для просмотра этой страницы"
      icon={<img src="/images/403.svg" alt="403 Forbidden" style={{ maxWidth: 240 }} />}
      extra={
        <Button type="primary" onClick={() => navigate(RoutePaths.Home)}>
          На главную
        </Button>
      }
    />
  );
};

export default PermissionDeniedPage;
