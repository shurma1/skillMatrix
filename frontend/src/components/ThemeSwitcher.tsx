import React, { useEffect } from 'react';
import { Select, Space, Typography } from 'antd';
import { SunOutlined, MoonOutlined, SettingOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/hooks/storeHooks';
import { setThemeMode, updateSystemTheme, type ThemeMode } from '@/store/themeSlice';

const { Text } = Typography;

const ThemeSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector(state => state.theme);

  // Слушаем изменения системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      dispatch(updateSystemTheme());
    };

    // Добавляем слушатель
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [dispatch]);

  const handleThemeChange = (value: ThemeMode) => {
    dispatch(setThemeMode(value));
  };

  const options = [
    {
      value: 'system' as const,
      label: (
        <Space>
          <SettingOutlined />
          <Text>Системная</Text>
        </Space>
      ),
    },
    {
      value: 'light' as const,
      label: (
        <Space>
          <SunOutlined />
          <Text>Светлая</Text>
        </Space>
      ),
    },
    {
      value: 'dark' as const,
      label: (
        <Space>
          <MoonOutlined />
          <Text>Темная</Text>
        </Space>
      ),
    },
  ];

  return (
    <Select
      value={mode}
      onChange={handleThemeChange}
      options={options}
      style={{ width: '100%' }}
      size="small"
      bordered={false}
    />
  );
};

export default ThemeSwitcher;
