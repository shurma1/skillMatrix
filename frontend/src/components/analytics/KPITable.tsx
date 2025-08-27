import React, { useMemo } from 'react';
import { Table } from 'antd';

interface KPITableProps {
	data?: {
		colLabels: string[];
		rowLabels: string[];
		data: number[][];
	};
}

const KPITable: React.FC<KPITableProps> = ({ data }) => {
	const columns = useMemo(() => {
		const dynamicCols = (data?.colLabels || []).map((label, idx) => ({
			title: label,
			dataIndex: `col_${idx}`,
			key: `col_${idx}`,
			align: 'center' as const,
			onCell: (_: any, index?: number) => {
				// Правая нижняя клетка (последняя строка, последняя колонка)
				const isLastRow = index === (data?.rowLabels?.length || 0) - 1;
				const isLastCol = idx === (data?.colLabels?.length || 0) - 1;
				const isBottomRight = isLastRow && isLastCol;
				
				return {
					style: {
						backgroundColor: isBottomRight ? '#1890ff' : 'transparent',
						color: isBottomRight ? 'white' : 'inherit',
					}
				};
			},
			render: (value: number) => {
				// Если это колонка с '%', добавляем символ процента
				const displayValue = label.includes('%') ? `${value}%` : value;
				return displayValue;
			}
		}));
		
		// First column with row labels title "KPI"
		return [
			{ title: 'KPI', dataIndex: 'rowLabel', key: 'rowLabel' },
			...dynamicCols,
		];
	}, [data?.colLabels, data?.rowLabels]);

	const dataSource = useMemo(() => {
		const rows = data?.rowLabels || [];
		const matrix = data?.data || [];
		// matrix has shape [col][row], need to rotate to rows by rowLabels
		// data.length equals colLabels.length, each inner array length equals rowLabels.length
		return rows.map((rowLabel, rowIdx) => {
			const row: Record<string, unknown> = { key: rowLabel, rowLabel };
			matrix.forEach((col, colIdx) => {
				row[`col_${colIdx}`] = col[rowIdx] ?? 0;
			});
			return row;
		});
	}, [data?.rowLabels, data?.data]);

	return (
		<Table
			size="small"
			bordered
			columns={columns}
			dataSource={dataSource}
			pagination={false}
		/>
	);
};

export default KPITable;
