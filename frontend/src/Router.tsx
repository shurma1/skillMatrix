import { type FC, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppRoutes, routeConfig, RoutePaths } from '@/config/route.tsx';
import Layout from '@/components/Layout.tsx';
import Loader from '@/components/Loader.tsx';

const routesArray = Object.values(routeConfig) as Array<typeof routeConfig[AppRoutes]>;

const router = createBrowserRouter(
	routesArray.map(routerElement => {
		
		const Element = () => (
			<Suspense fallback={<Loader/>}>
				{routerElement.element}
			</Suspense>
		);
		
		return {
			path: routerElement.path,
			element: routerElement.path === RoutePaths.Login
				? <Element />
				: <Layout><Element /></Layout>
		};
	})
);

const Router: FC = () => {
	return <RouterProvider router={router} />;
};

export default Router;
