import React, { useLayoutEffect, useMemo, useState, type FC } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { blue } from "@ant-design/colors";

type LeftCell = string | number | null;

interface JobRoleToSkillsDetailsData {
  left: { colLabels: string[]; data: LeftCell[][] };
  middle: { colLabels: [string[], string[], number[]]; data: number[][] };
  right: { colLabels: [string[], number[], number[]]; data: number[][] };
}

interface Props {
  data?: JobRoleToSkillsDetailsData;
}

// Renders a composite table: fixed left columns, middle columns with 3-row headers, and scrollable right matrix.
const JobRoleToSkillsDetailsTable: React.FC<Props> = ({ data }) => {
  const [biggestLabelLength, setBiggestLabelLength] = useState(0);

  useLayoutEffect(() => {
    if (!data || !data.left?.colLabels || !data.middle?.colLabels?.[0] || !data.right?.colLabels?.[0]) {
      return;
    }

    let biggestLength = 0;

    [...data.left.colLabels, ...data.middle.colLabels[0], ...data.right.colLabels[0]].forEach(item => {
      if (item && biggestLength < item.length) {
        biggestLength = item.length;
      }
    });

    setBiggestLabelLength(biggestLength);
  }, [data]);

  const columns = useMemo(() => {
    if (!data || !data.left?.colLabels || !data.middle?.colLabels || !data.right?.colLabels) return [];

    // Левые колонки (фиксированные)
    const leftCols = data.left.colLabels.map((label, idx) => ({
      title: (
        <div style={{
          textAlign: 'center',
          height: `${biggestLabelLength * 6}px`,
          width: '50px',
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
      width: 60,
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
          padding: '2px 1px'
        }
      }),
    }));

    // Средние колонки с тройным заголовком
    const [middleRow1, middleRow2, middleRow3] = data.middle.colLabels;

    const MiddleColComponent:FC<{children: React.ReactNode}> = ({children}) => (
        <div style={{
          textAlign: 'center',
          height: `${biggestLabelLength * 6}px`,
          width: '40px',
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
            overflow: 'hidden',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 'bold', color: blue[7] }}>
              {children}
            </div>
          </div>
        </div>
    )

    const middleCols = (middleRow1 || []).map((_, idx) => ({
      title: (
        <MiddleColComponent>
            {middleRow1?.[idx] || ''}
        </MiddleColComponent>
      ),
      key: `m_group_${idx}`,
      fixed: 'left' as const,
      width: 50,
      align: 'center' as const,
      onHeaderCell: () => ({
        style: {
          height: `${biggestLabelLength * 6}px`,
          verticalAlign: 'middle',
          padding: '2px 1px'
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
                {middleRow2?.[idx] || ''}
              </div>
            ),
            key: `m_subgroup_${idx}`,
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
                        {middleRow3?.[idx] || ''}
                      </div>
                    ),
                    dataIndex: `m_${idx}`,
                    key: `m_${idx}`,
                    width: 50,
                    align: 'center' as const,
                    render: (value: number) => (
                      <div style={{
                        fontWeight: 'bold',
                        fontSize: '10px',
                        color: blue[6]
                      }}>
                        {!value || value === 0 ? '' : value}
                      </div>
                    ),
                }
            ]
        }
      ]
    }));

    // Правые колонки с группированными заголовками
    const [users] = data.right.colLabels;

    const rightCols = (users || []).map((user, idx) => ({
      title: (
        <div style={{
          textAlign: 'center',
          height: `${biggestLabelLength * 6}px`,
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
            {user}
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
              {`${data.right.colLabels?.[1]?.[idx] ?? 0}%`}
            </div>
          ),
          key: `user_wrap_${idx}`,
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
                  {data.right.colLabels?.[2]?.[idx] ?? 0}
                </div>
              ),
              dataIndex: `user_${idx}`,
              key: `user_${idx}`,
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

    return [...leftCols, ...middleCols, ...rightCols] as ColumnsType<any>;
  }, [data, biggestLabelLength]);

  const dataSource = useMemo(() => {
    if (!data || !data.left?.data) return [];

    return (data.left.data || []).map((leftRow, rowIdx) => {
      const row: Record<string, any> = { key: rowIdx };

      // Заполняем левые колонки
      leftRow.forEach((cell, idx) => {
        row[`l_${idx}`] = cell;
      });

      // Заполняем средние колонки
      const middleRow = data.middle?.data?.[rowIdx] || [];
      middleRow.forEach((cell, idx) => {
        row[`m_${idx}`] = cell ?? 0;
      });

      // Заполняем правые колонки данными из матрицы
      const rightRow = data.right?.data?.[rowIdx] || [];
      rightRow.forEach((cell, idx) => {
        row[`user_${idx}`] = cell ?? 0;
      });

      return row;
    });
  }, [data]);

  // вычислим общую требуемую ширину для горизонтального скролла
  const totalRightLeafCols = data?.right?.colLabels?.[0]?.length || 0;
  const leafWidth = 60;
  const leftWidth = data?.left?.colLabels?.length ? data.left.colLabels.length * 60 : 0;
  const middleWidth = data?.middle?.colLabels?.[0]?.length ? data.middle.colLabels[0].length * 50 : 0;
  const rightWidth = totalRightLeafCols * leafWidth;
  const scrollX = leftWidth + middleWidth + rightWidth + 24;

  return (
    <div style={{ width: '100%' }}>
      <Table
        size="small"
        bordered
        scroll={{ x: scrollX }}
        pagination={false}
        sticky
        columns={columns}
        dataSource={dataSource}
        tableLayout="fixed"
      />
    </div>
  );
};

export default JobRoleToSkillsDetailsTable;
