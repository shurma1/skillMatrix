import React from 'react';
import { Card, Alert, Spin, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useLazyDownloadAnalyticsKPIQuery } from '@/store/endpoints';
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
		const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadAnalyticsKPIQuery();

		const handleDownload = async () => {
			const res = await triggerDownload().unwrap().catch(() => undefined as any);
			const payload = res as unknown as { blob: Blob; filename?: string } | undefined;
			if (!payload) return;
			const url = URL.createObjectURL(payload.blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = payload.filename || 'kpi.xlsx';
			a.click();
			URL.revokeObjectURL(url);
		};

		return (
			<Card title="KPI" extra={<Button icon={<DownloadOutlined />} onClick={handleDownload} loading={isDownloading}>Скачать Excel</Button>}>
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
