import React from 'react';
import { Avatar, Typography, Flex, theme, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { RoutePaths } from '@/config/route.tsx';
import { useAppSelector } from '@/hooks/storeHooks.ts';
import {API_BASE_URL} from "@/config/api.ts";
import ThemeSwitcher from './ThemeSwitcher';

const UserBar: React.FC = () => {
  const user = useAppSelector(s => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  if (!user) return null;
  const isActive = location.pathname === RoutePaths.Profile;
  const bg = isActive ? token.colorPrimaryBg : 'transparent';
  const textColor = isActive ? token.colorPrimary : token.colorText;
  const secondaryColor = isActive ? token.colorPrimary : token.colorTextSecondary;
  
  return (
    <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}>
      {/* Переключатель темы */}
      <div style={{ padding: '8px 16px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <ThemeSwitcher />
      </div>
      
      {/* Профиль пользователя */}
      <Button
        type="text"
        block
        aria-current={isActive ? 'page' : undefined}
        onClick={() => !isActive && navigate(RoutePaths.Profile)}
        style={{
          justifyContent: 'flex-start',
          display: 'flex',
          padding: '12px 16px',
          height: 'auto',
          background: bg,
          borderRadius: 0,
          transition: 'background .2s',
        }}
        onMouseEnter={(e) => { if (!isActive) (e.currentTarget.style.background = token.colorFillSecondary); }}
        onMouseLeave={(e) => { if (!isActive) (e.currentTarget.style.background = 'transparent'); }}
      >
        <Flex align="center" gap={12} style={{ width: '100%' }}>
          <Avatar
            icon={!user.avatar_id ? <UserOutlined /> : undefined}
            src={user.avatar_id ? `${API_BASE_URL}/api/image/${user.avatar_id}?thumb=true` : undefined}
            size={40}
          />
          <div style={{ overflow: 'hidden' }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 140, color: textColor }}>
              {user.firstname || user.login}
            </Typography.Text>
            <Typography.Text ellipsis style={{ display: 'block', maxWidth: 140, fontSize: 12, color: secondaryColor }}>
              {user.login}
            </Typography.Text>
          </div>
        </Flex>
      </Button>
    </div>
  );
};

export default UserBar;
