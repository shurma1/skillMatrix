import React, { useLayoutEffect, useState } from 'react';
import { Table } from 'antd';

export interface UserToSkillsAnalyticsData {
  left: { colLabels: string[]; data: (string | number | null)[][] };
  middle: { colLabels: Array<[string[], string[], number[]]>; data: number[][] };
  right: { colLabels: [string[], number[], number[]]; data: number[][] };
}

interface Props {
  data: UserToSkillsAnalyticsData;
}

const AnalyticsUserToSkillsTable: React.FC<Props> = ({ data }) => {
  const { left, middle, right } = data;

  // Dynamic header height for vertical labels
  const [headerHeight, setHeaderHeight] = useState(120);
  useLayoutEffect(() => {
    const mid = middle.colLabels?.[0] || [[], [], []];
    const userName = String(right.colLabels?.[0]?.[0] ?? '');
    const topMidText = String((mid?.[0]?.[0] ?? ''));
    let biggest = 0;
    [...(left.colLabels || []), topMidText, userName].forEach((s) => {
      const len = (s ?? '').toString().length;
      if (len > biggest) biggest = len;
    });
    const h = Math.max(100, biggest * 6);
    setHeaderHeight(h);
  }, [left.colLabels, middle.colLabels, right.colLabels]);

  const verticalHeader = (text: string, width = 50) => (
    <div style={{
      textAlign: 'center',
      height: `${headerHeight}px`,
      width: `${width}px`,
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
        maxHeight: `${headerHeight}px`,
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: 600,
      }}>
        {text}
      </div>
    </div>
  );

  // Left columns
  const leftColumns = left.colLabels.map((label, index) => ({
    title: verticalHeader(String(label), 50),
    dataIndex: `left_${index}`,
    key: `left_${index}`,
    width: 60,
    onHeaderCell: () => ({
      style: { height: `${headerHeight}px`, verticalAlign: 'middle', padding: '2px 1px' }
    }),
    render: (value: any) => (
      <div style={{
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        lineHeight: 1.15,
        padding: '0 2px'
      }}>
        {value ?? '-'}
      </div>
    ),
    onCell: () => ({
      style: {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
      }
    }),
  }));

  // Middle (3-level header)
  const mid = middle.colLabels?.[0] || [[], [], []];
  const [midRow1, midRow2, midRow3] = mid; // [ [""], ["ЦЕЛЬ"], [totalTarget] ]
  const middleColumn: any = {
    title: verticalHeader(String(midRow1?.[0] ?? ''), 40),
    key: 'm_group_0',
    width: 50,
    align: 'center' as const,
    onHeaderCell: () => ({
      style: { height: `${headerHeight}px`, verticalAlign: 'middle', padding: '2px 1px' }
    }),
    children: [
      {
        title: (
          <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, padding: '2px' }}>
            {String(midRow2?.[0] ?? '')}
          </div>
        ),
        key: 'm_subgroup_0',
        children: [
          {
            title: (
              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, padding: '2px' }}>
                {String(midRow3?.[0] ?? '')}
              </div>
            ),
            dataIndex: 'm_0',
            key: 'm_0',
            width: 50,
            align: 'center' as const,
            render: (value: number) => (value ? value : ''),
          }
        ]
      }
    ]
  };

  // Right (3-level header)
  const userName = String(right.colLabels[0]?.[0] ?? '');
  const totalPercent = Number((right.colLabels[1]?.[0] as number) ?? 0);
  const totalCurrent = Number((right.colLabels[2]?.[0] as number) ?? 0);
  const rightColumn: any = {
    title: verticalHeader(userName, 50),
    key: 'r_group_0',
    align: 'center' as const,
    onHeaderCell: () => ({
      style: { height: `${headerHeight}px`, verticalAlign: 'middle', padding: '4px 2px' }
    }),
    children: [
      {
        title: (
          <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, padding: '2px' }}>
            {`${totalPercent}%`}
          </div>
        ),
        key: 'r_wrap_0',
        align: 'center' as const,
        children: [
          {
            title: (
              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, padding: '2px' }}>
                {totalCurrent}
              </div>
            ),
            dataIndex: 'r_0',
            key: 'r_0',
            align: 'center' as const,
            width: 60,
            render: (value: number) => (value ? value : ''),
          },
        ],
      },
    ],
  };

  const columns = [...leftColumns, middleColumn, rightColumn];

  const dataSource = left.data.map((leftRow, index) => {
    const row: any = { key: index };
    leftRow.forEach((value, colIndex) => {
      row[`left_${colIndex}`] = value;
    });
    row.m_0 = middle.data[index]?.[0] ?? 0;
    row.r_0 = right.data[index]?.[0] ?? 0;
    return row;
  });

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      size="small"
      scroll={{ x: 'max-content' }}
      bordered
      tableLayout="fixed"
      style={{ marginTop: 16 }}
    />
  );
};

export default AnalyticsUserToSkillsTable;
