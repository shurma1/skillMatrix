import {Layout as ANTDLayout, Menu, type MenuProps, Typography, theme} from 'antd';
import { AppRoutes, routeConfig, RouteKeysByPath, RoutePaths } from '@/config/route.tsx';
import type {FC, ReactNode} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {getString} from "@/utils/getString.ts";
import { useAppSelector } from '@/hooks/storeHooks.ts';
import { useProfileSync } from '@/hooks/useProfileSync';
import UserBar from './UserBar';

const { Content, Sider } = ANTDLayout;

const navItems: MenuProps['items'] = (Object.keys(routeConfig) as AppRoutes[])
	.filter(key => routeConfig[key].meta.showInNav)
	.map(key => ({
		key,
		label: getString(routeConfig[key].meta.navNameKey!),
	}))

interface LayoutProps {
	children: ReactNode | ReactNode[];
}

const Layout: FC<LayoutProps> = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const user = useAppSelector(s => s.auth.user);
	const currentRouteKey = RouteKeysByPath[location.pathname];
	const { token } = theme.useToken();
	
	// Синхронизируем профиль пользователя при загрузке
	useProfileSync();
	
	const {Title} = Typography;

	const handleClick: MenuProps['onClick'] = (e) => {
		if (location.pathname === RoutePaths[e.key as AppRoutes]) return;
		navigate(RoutePaths[e.key as AppRoutes]);
	};

	return (
		<ANTDLayout style={{ minHeight: '100vh' }}>
			<Sider width={250} style={{ display: 'flex', flexDirection: 'column' }}>
				<Title
					level={4}
					style={{
						textAlign: 'center',
						padding: '16px 0',
						margin: 0,
					}}
				>
					SkillMatrix
				</Title>
				<div style={{ flex: 1, overflow: 'auto' }}>
					<Menu
						mode="inline"
						selectedKeys={currentRouteKey ? [currentRouteKey] : []}
						style={{ borderRight: 0 }}
						items={navItems}
						onClick={handleClick}
					/>
				</div>
				{user &&
					<div
						style={{
							bottom: 0,
							left: 0,
							right: 0,
							position: 'absolute'
					}}
					>
					  <UserBar />
					</div>
				}
			</Sider>
			<ANTDLayout>
				<Content
					style={{
						padding: 24,
						margin: 0,
						minHeight: '100vh',
						backgroundColor: token.colorBgContainer,
						color: token.colorText
					}}
				>
					{children}
				</Content>
			</ANTDLayout>
		</ANTDLayout>
	);
};

export default Layout;
