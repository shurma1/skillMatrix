import { Flex, Spin, theme } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/storeHooks';
import {blue} from "@ant-design/colors";

const Loader = () => {
	const { token } = theme.useToken();
	const isDark = useAppSelector(s => s.theme.isDark);

	return (
		<Flex
			justify="center"
			align="center"
					style={{
						minHeight: '100dvh',
						width: '100%',
						backgroundColor: isDark ? '#000000' : blue[0],
						color: token.colorText,
					}}
		>
			<Spin
				indicator={
					<LoadingOutlined
						spin
						style={{ fontSize: 40, color: token.colorPrimary }}
					/>
				}
				size="large"
			/>
		</Flex>
	);
};

export default Loader;
