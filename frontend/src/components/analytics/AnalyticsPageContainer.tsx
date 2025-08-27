import { AnalyticsContainer } from '@/components/analytics';
import {Flex, Typography} from "antd";

const { Title } = Typography;

const AnalyticsPageContainer = () => {
	return (
		<Flex vertical>
			<Title
				level={3}
				style={{ marginTop: 0, marginBottom: 16 }}
			>Аналитика</Title>
			<AnalyticsContainer/>
		</Flex>
	);
};

export default AnalyticsPageContainer;
