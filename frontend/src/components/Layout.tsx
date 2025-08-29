import {Layout as ANTDLayout, Menu, type MenuProps, Typography, theme, Tooltip, Button} from 'antd';
import { blue } from '@ant-design/colors';
import { LockOutlined } from '@ant-design/icons';
import { AppRoutes, routeConfig, RouteKeysByPath, RoutePaths } from '@/config/route.tsx';
import type {FC, ReactNode} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {getString} from "@/utils/getString.ts";
import { useAppSelector } from '@/hooks/storeHooks.ts';
import { useProfileSync } from '@/hooks/useProfileSync';
import UserBar from './UserBar';

const { Content, Sider } = ANTDLayout;

interface LayoutProps {
	children: ReactNode | ReactNode[];
}

const Layout: FC<LayoutProps> = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const user = useAppSelector(s => s.auth.user);
	const isDark = useAppSelector(s => s.theme.isDark);
	const permissions = useAppSelector(s => s.auth.permissions);
	const currentRouteKey = RouteKeysByPath[location.pathname];
	const { token } = theme.useToken();
	
	// Синхронизируем профиль пользователя при загрузке
	useProfileSync();
	

	// Элементы навигации с проверкой прав: disabled + замок и тултип
	const names = new Set(permissions.map(p => p.name));
	const navItems: MenuProps['items'] = (Object.keys(routeConfig) as AppRoutes[])
		.filter(key => routeConfig[key].meta.showInNav)
		.map(key => {
			const cfg = routeConfig[key];
			const need = (cfg as { permissionsNeed?: string[] }).permissionsNeed ?? [];
			const allowed = need.length === 0 || need.every(n => names.has(n));
			const label = allowed
				? getString(cfg.meta.navNameKey!)
				: (
					<Tooltip title="Нет прав для просмотра">
						<span>
							<LockOutlined style={{ marginRight: 8 }} />
							{getString(cfg.meta.navNameKey!)}
						</span>
					</Tooltip>
				);
			return {
				key,
				label,
				disabled: !allowed,
			};
		});
	
	const {Title} = Typography;
	const serverOnline = useAppSelector(s => s.app.serverOnline);

	const OfflineOverlay = () => (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				gap: 16,
				background: isDark ? 'rgba(0,0,0, .4)' : 'rgba(255,255,255, .4)',
				backdropFilter: 'blur(8px)',
				zIndex: 2000,
			}}
		>
			<Title level={2} style={{ color: token.colorText, margin: 0 }}>Нет соединения с сервером</Title>
			<Button type="primary" onClick={() => window.location.reload()}>
				Обновить страницу
			</Button>
		</div>
	);

	const handleClick: MenuProps['onClick'] = (e) => {
		if (location.pathname === RoutePaths[e.key as AppRoutes]) return;
		navigate(RoutePaths[e.key as AppRoutes]);
	};

	return (
		<ANTDLayout style={{ height: '100vh', overflow: 'hidden' }}>
			<Sider width={250} style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
				<Title
					level={4}
					style={{
						textAlign: 'center',
						padding: '16px 0',
						margin: 0,
					}}
				>
					PALMA <span  style={{color: blue[5]}}>SkillMatrix</span>
				</Title>
				<div style={{flex: 1, overflow: 'auto'}}>
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
						height: '100vh',
						overflow: 'auto',
						backgroundColor: isDark ? '#000000' : blue[0],
						color: token.colorText
					}}
				>
					{children}
					{!serverOnline && <OfflineOverlay />}
				</Content>
			</ANTDLayout>
		</ANTDLayout>
	);
};

export default Layout;
