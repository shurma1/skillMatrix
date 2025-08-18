import React from 'react';
import { Flex, theme } from 'antd';
import { useAppSelector } from '@/hooks/storeHooks';
import Login from '@/components/Auth/Login';

const LoginPageContainer: React.FC = () => {
  const { token } = theme.useToken();
  useAppSelector(state => state.theme);

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: token.colorBgContainer,
        color: token.colorText
      }}
    >
      <div
        style={{
          padding: 24,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Login />
      </div>
    </Flex>
  );
};

export default LoginPageContainer;
