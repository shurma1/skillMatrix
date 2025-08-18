import React, { type ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useAppSelector } from '@/hooks/storeHooks';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDark } = useAppSelector(state => state.theme);

  return (
    <ConfigProvider 
      theme={{ 
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Layout: {
            siderBg: isDark ? '#141414' : '#ffffff',
            triggerBg: isDark ? '#141414' : '#ffffff',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
