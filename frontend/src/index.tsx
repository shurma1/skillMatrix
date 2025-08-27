import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import Router from "./Router.tsx";
import {Provider} from "react-redux";
import {store} from "@/store/store.ts";
import './styles/index.css';
import ThemeProvider from '@/components/ThemeProvider';
import PermissionsGate from '@/components/PermissionsGate';


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<PermissionsGate app={<Router/>} />
			</ThemeProvider>
		</Provider>
	</StrictMode>,
)
