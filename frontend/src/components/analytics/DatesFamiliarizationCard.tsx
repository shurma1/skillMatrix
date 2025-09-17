import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Typography, Space } from 'antd';
import { CalendarOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { 
  useGetAnalyticsDatesFamiliarizationQuery,
  useLazyDownloadAnalyticsDatesFamiliarizationQuery
} from '@/store/endpoints';
import Loader from '@/components/Loader';

const { Text, Title } = Typography;

interface DatesFamiliarizationCardProps {
  skillId: string;
}

const DatesFamiliarizationCard: React.FC<DatesFamiliarizationCardProps> = ({ skillId }) => {
  const [expanded, setExpanded] = useState(false);

  const { data, isFetching, error } = useGetAnalyticsDatesFamiliarizationQuery(skillId, {
    skip: !expanded,
  });
  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadAnalyticsDatesFamiliarizationQuery();

  const columns = useMemo(() => [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      width: '60%',
    },
    {
      title: 'Дата ознакомления',
      dataIndex: 'date',
      key: 'date',
      width: '40%',
      render: (date: string | null) => {
        if (!date) {
          return <span style={{ color: '#ff4d4f' }}>Не ознакомлен</span>;
        }
        return new Date(date).toLocaleDateString('ru-RU');
      },
    },
  ], []);

  const dataSource = useMemo(() => {
    if (!data) return [];
    return data.data?.map((item, index) => ({
      key: index,
      fio: item.fio,
      date: item.date,
    })) || [];
  }, [data]);

  return (
    <Card
      title={
        <Space>
          <CalendarOutlined />
          <span>Даты ознакомления с навыком</span>
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
              a.download = payload.filename || 'dates_familiarization.xlsx';
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

export default DatesFamiliarizationCard;
