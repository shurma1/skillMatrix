import React, { useCallback, useEffect } from 'react';
import { Alert } from 'antd';
import { useLoginMutation } from '@/store/endpoints.ts';
import { useAppDispatch } from '@/hooks/storeHooks.ts';
import { setAuth } from '@/store/authSlice.ts';
import type { LoginRequestDTO, AuthDTO } from '@/types/api/auth.ts';
import LoginForm from "@/components/Auth/LoginForm.tsx";

interface LoginProps {
	onSuccess?: (auth: AuthDTO) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
	const [login, {
			data,
			isLoading,
			isError,
			error
		}] = useLoginMutation();
	const dispatch = useAppDispatch();
	
	const handleFinish = useCallback((values: { identifier?: string; password?: string }) => {
		
		if (!values.identifier || !values.password) {
			return;
		}
		
		const payload: LoginRequestDTO = {
			identifier: values.identifier,
			password: values.password
		};
		
		login(payload);
	}, [login]);

	const handleFinishFailed = useCallback(() => {}, []);

	useEffect(() => {
		if (data) {
			dispatch(setAuth(data));
			onSuccess?.(data);
		}
	}, [data, dispatch]);
	
	
	return (
		<div style={{ width: '100%', maxWidth: 350 }}>
			<LoginForm
				onFinish={handleFinish}
				onFinishFailed={handleFinishFailed}
				isLoading={isLoading}
			/>
            {isError && (
				<Alert
					style={{ marginBottom: 16 }}
					type="error"
					message={typeof error === 'object' && error !== null ? 'Неверные учетные данные' : 'Ошибка авторизации'}
					showIcon
					closable
				/>
			)}
		</div>
	);
};

export default Login;
