import {Flex, Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const Loader = () => {
	return (
		<Flex
			justify="center"
			align="center"
			style={{ minHeight: '100dvh', width: '100%' }}
		>
			<Spin indicator={<LoadingOutlined spin />} size="large"/>
		</Flex>
	);
};

export default Loader;
