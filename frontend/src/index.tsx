import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import Router from "./Router.tsx";
import {Provider} from "react-redux";
import {store} from "@/store/store.ts";
import './styles/index.css';
import ThemeProvider from '@/components/ThemeProvider';


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<Router/>
			</ThemeProvider>
		</Provider>
	</StrictMode>,
)
