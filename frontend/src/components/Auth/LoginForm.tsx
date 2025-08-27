import type { FormProps } from 'antd';
import { Button, Form, Input, Typography, Tooltip } from 'antd';
import { useState } from 'react';
import type {FC} from "react";
import ResultPreviewModal from '@/components/modals/shared/ResultPreviewModal';
import { EyeOutlined } from '@ant-design/icons';

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
}) => {
	const [previewOpen, setPreviewOpen] = useState(false);
	return (
		<div style={{ width: '100%', position: 'relative' }}>
			<div style={{ position: 'absolute', top: 8, right: 0, zIndex: 1 }}>
				<Tooltip title="Просмотр предварительных результатов" placement="left">
					<Button
						icon={<EyeOutlined />}
						aria-label="Просмотр предварительных результатов"
						onClick={() => setPreviewOpen(true)}
						shape="circle"
					/>
				</Tooltip>
			</div>
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

				<ResultPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
			</div>
	);
};

export default LoginForm;
