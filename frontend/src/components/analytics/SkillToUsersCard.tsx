import React, { useMemo, useState } from 'react';
import { Card, Button, Table, Space, Typography, Tag } from 'antd';
import { TeamOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useGetAnalyticsSkillToUsersQuery, useLazyDownloadAnalyticsSkillToUsersQuery } from '@/store/endpoints';
import Loader from '@/components/Loader';

const { Text, Title } = Typography;

interface SkillToUsersCardProps {
  skillId: string;
}

const SkillToUsersCard: React.FC<SkillToUsersCardProps> = ({ skillId }) => {
  const [expanded, setExpanded] = useState(false);

  const { data, isFetching, error } = useGetAnalyticsSkillToUsersQuery(skillId, {
    skip: !expanded,
  });
  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadAnalyticsSkillToUsersQuery();

  const columns = useMemo(() => {
    if (!data) return [] as any[];
    return data.colLabels.map((label, idx) => ({
      title: label,
      dataIndex: `c_${idx}`,
      key: `c_${idx}`,
      align: idx >= 3 ? 'center' : 'left',
      width: idx >= 3 ? 140 : undefined,
      render: (val: any) => {
        if (idx === 2) {
          // Тип связи: Прямая / Через должность / Прямая + Через должность
          const color = 'default';
          return <Tag color={color}>{val}</Tag>;
        }
        if (idx >= 3 && typeof val === 'number') return val;
        return val ?? '-';
      }
    }));
  }, [data]);

  const dataSource = useMemo(() => {
    if (!data) return [] as any[];
    return data.data.map((row, r) => {
      const rec: any = { key: r };
      row.forEach((v, i) => { rec[`c_${i}`] = v; });
      return rec;
    });
  }, [data]);

  return (
    <Card
      title={
        <Space>
          <TeamOutlined />
          <span>Пользователи по навыку</span>
          {data?.skill?.title && (
            <Text type="secondary">({data.skill.title} v{data.skill.version})</Text>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button icon={<DownloadOutlined />} onClick={async () => {
            try {
              const res = await triggerDownload(skillId);
              const payload = res.data as unknown as { blob: Blob; filename?: string } | undefined;
              if (!payload) return;
              const url = URL.createObjectURL(payload.blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = payload.filename || 'skillToUsers.xlsx';
              a.click();
              URL.revokeObjectURL(url);
            } catch (error) {
              console.error('Ошибка скачивания:', error);
            }
          }} loading={isDownloading}>
            Скачать Excel
          </Button>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => setExpanded((e) => !e)} loading={isFetching}>
            {expanded ? 'Скрыть' : 'Показать аналитику'}
          </Button>
        </Space>
      }
      size="small"
    >
      {expanded && (
        <>
          {isFetching && <Loader />}
          {error && (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Text type="danger">Ошибка загрузки данных</Text>
            </div>
          )}
          {data && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <Title level={5} style={{ marginBottom: 0 }}>Навык</Title>
                <Text>
                  {(data.skill?.title ?? '-')}{' '}
                  {data.skill?.version != null ? `(v${data.skill.version})` : ''}{' '}
                  {data.skill?.documentId ? `• ${data.skill.documentId}` : ''}
                </Text>
              </div>
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                scroll={{ x: 'max-content' }}
                bordered
              />
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default SkillToUsersCard;
