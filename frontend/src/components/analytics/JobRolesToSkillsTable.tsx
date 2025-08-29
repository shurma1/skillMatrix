import React, {useLayoutEffect, useMemo, useState} from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {blue} from "@ant-design/colors";

type LeftCell = string | number | null;

interface JobRolesToSkillsData {
  left: { colLabels: string[]; data: LeftCell[][] };
  // Backend provides three arrays: [jobRoles, actual, totals]. We use the first two; third is ignored.
  right: { colLabels: [string[], number[], number[]]; data: number[][] };
}

interface Props {
  data?: JobRolesToSkillsData;
}

// Renders a composite table: fixed left columns and scrollable right matrix.
const JobRolesToSkillsTable: React.FC<Props> = ({ data }) => {
	
  const [biggestLabelLength, setBiggestLabelLength] = useState(0);
	
	useLayoutEffect(() => {
		if(!data) {
			return;
		}
		
		let biggestLength = 0;
		
		[...data.right.colLabels[0], ...data.left.colLabels].forEach(item => {
			if(biggestLength < item.length) {
				biggestLength = item.length;
			}
		})
		
		setBiggestLabelLength(biggestLength);
	}, [data]);
	
  const columns = useMemo(() => {
    if (!data) return [];

    // Левые колонки (фиксированные)
    const leftCols = data.left.colLabels.map((label, idx) => ({
      title: (
        <div style={{
          textAlign: 'center',
		  tableLayout:"fixed",
          width: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <div style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            textOrientation: 'mixed',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.1,
            fontSize: '10px',
            maxHeight: `${biggestLabelLength * 6}px`,
            overflow: 'hidden'
          }}>
            {label}
          </div>
        </div>
      ),
      dataIndex: `l_${idx}`,
      key: `l_${idx}`,
      fixed: 'left' as const,
      width: 90,
      
      render: (value: LeftCell) => (
        <div style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          lineHeight: 1.15,
          padding: '0 2px'
        }}>
          {value}
        </div>
      ),
      onCell: () => ({
        style: {
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }
      }),
      onHeaderCell: () => ({
        style: {
          height: `${biggestLabelLength * 6}px`,
          verticalAlign: 'middle',
          padding: '4px 2px'
        }
      }),
    }));

    // Правые колонки с группированными заголовками
  const [jobRoles, actual] = data.right.colLabels;

  const rightCols = jobRoles.map((jobRole, idx) => ({
      title: (
        <div style={{
          textAlign: 'center',
          height: `${biggestLabelLength * 6}px`,
      // ширина возьмётся из суммы листовых колонок
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <div style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            textOrientation: 'mixed',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.1,
            fontSize: '10px',
            fontWeight: 'bold',
            maxHeight: `${biggestLabelLength * 6}px`,
            overflow: 'hidden'
          }}>
            {jobRole}
          </div>
        </div>
      ),
      key: `group_${idx}`,
      align: 'center' as const,
      onHeaderCell: () => ({
        style: {
          height: `${biggestLabelLength * 6}px`,
          verticalAlign: 'middle',
          padding: '4px 2px'
        }
      }),
      children: [
        {
          title: (
            <div style={{
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              color: blue[5],
              padding: '2px'
            }}>
				  ЦЕЛЬ
            </div>
          ),
          key: `target_wrap_${idx}`,
          align: 'center' as const,
          children: [
            {
              title: (
                <div style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: blue[5],
                  padding: '2px'
                }}>
                  {actual[idx] ?? 0}
                </div>
              ),
              dataIndex: `actual_${idx}`,
              key: `actual_${idx}`,
              align: 'center' as const,
              width: 60,
              render: (value: number) => (
                <div style={{ fontWeight: 'bold', fontSize: '10px' }}>
                  {!value || value === 0 ? '' : value}
                </div>
              )
            },
          ],
        },
      ],
    }));
  

    return [...leftCols, ...rightCols] as ColumnsType<any>;
  }, [data, biggestLabelLength]);

  const dataSource = useMemo(() => {
    if (!data) return [];
    
    return (data.left.data || []).map((leftRow, rowIdx) => {
      const row: Record<string, any> = { key: rowIdx };
      
      // Заполняем левые колонки
      leftRow.forEach((cell, idx) => {
        row[`l_${idx}`] = cell;
      });
      
      // Заполняем правые колонки данными из матрицы
      const rightRow = data.right.data[rowIdx] || [];
      
      rightRow.forEach((cell, idx) => {
        // В обе колонки помещаем значение из матрицы данных
        row[`target_${idx}`] = cell ?? 0;
        row[`actual_${idx}`] = cell ?? 0;
      });
      
      return row;
    });
  }, [data]);

  // вычислим общую требуемую ширину для горизонтального скролла
  const totalRightLeafCols = data ? data.right.colLabels[0].length : 0; // листовые (actual)
  const leafWidth = 60; // ширина одной листовой колонки actual
  const leftWidth = data ? data.left.colLabels.length * 90 : 0; // ширина фиксированных колонок
  const rightWidth = totalRightLeafCols * leafWidth;
  const scrollX = leftWidth + rightWidth + 24; // запас

  return (
    <Table
      size="small"
      bordered
      scroll={{ x: scrollX }}
      pagination={false}
      sticky
      columns={columns}
      dataSource={dataSource}
    />
  );
};

export default JobRolesToSkillsTable;
