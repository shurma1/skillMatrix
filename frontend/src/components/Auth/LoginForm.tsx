import type { FormProps } from 'antd';
import { Button, Form, Input, Typography } from 'antd';
import type {FC} from "react";

type FieldType = {
	identifier?: string;
	password?: string;
};


interface IProps {
	onFinish: FormProps<FieldType>['onFinish'];
	onFinishFailed: FormProps<FieldType>['onFinishFailed'];
	isLoading: boolean;
}

const LoginForm: FC<IProps> = ({
	onFinish,
	onFinishFailed,
	isLoading
}) => (
	<div style={{ width: '100%' }}>
		<Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
			Авторизация
		</Typography.Title>
		<Form
			name="login"
			layout="vertical"
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off"
		>
		<Form.Item<FieldType>
			label="Логин или Email"
			name="identifier"
			rules={[{
				required: true,
				message: 'Пожалуйста, введите логин или email!'
			}]}
		>
			<Input
				placeholder="username@example.com"
			/>
		</Form.Item>

		<Form.Item<FieldType>
			label="Пароль"
			name="password"
			rules={[{
				required: true,
				message: 'Пожалуйста, введите пароль!'
			}]}
		>
			<Input.Password
				placeholder="••••••••"
			/>
		</Form.Item>

				<Form.Item>
					<Button
						block
						type="primary"
						htmlType="submit"
						loading={isLoading}
					>
						Войти
					</Button>
				</Form.Item>
			</Form>
		</div>
);

export default LoginForm;
