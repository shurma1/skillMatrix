import React from 'react';
import { Card, Alert, Spin } from 'antd';
import KPITable from './KPITable';

interface AnalyticsCardProps {
	data?: {
		colLabels: string[];
		rowLabels: string[];
		data: number[][];
	};
	isFetching: boolean;
	error: any;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ data, isFetching, error }) => {
	return (
		<Card title="KPI">
			{isFetching && (
				<div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
					<Spin />
				</div>
			)}
			{error && (
				<Alert type="error" message="Ошибка загрузки KPI" showIcon style={{ marginBottom: 16 }} />
			)}
			{!isFetching && !error && (
				<KPITable data={data} />
			)}
		</Card>
	);
};

export default AnalyticsCard;
