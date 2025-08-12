import Login from "@/components/Auth/Login.tsx";
import { Flex } from "antd";

const LoginPage = () => {
	return (
		<Flex
			vertical
			justify="center"
			align="center"
			style={{ minHeight: '100dvh', width: '100%' }}
		>
			<div style={{ padding: 24, width: '100%', display: 'flex', justifyContent: 'center' }}>
				<Login />
			</div>
		</Flex>
	);
};

export default LoginPage;
