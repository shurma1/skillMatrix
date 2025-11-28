import { useEffect, useMemo, useState } from 'react';
import { Modal, Input, Table, Empty, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FC } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetUserResultPreviewQuery, useLazyDownloadAnalyticsResultPreviewQuery } from '@/store/endpoints';
import type { UserResultPreviewDTO } from '@/types/api/user';

interface ResultPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

const ResultPreviewModal: FC<ResultPreviewModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);

  // Fetch fresh on open or query change; skip when closed to avoid background fetch
  const { data, isFetching, refetch } = useGetUserResultPreviewQuery(
    { query: debounced },
    { skip: !open }
  );

  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadAnalyticsResultPreviewQuery();

  // When opened, trigger immediate refetch to ensure fresh data regardless of cache
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleDownload = async () => {
    try {
      const res = await triggerDownload({ query: debounced });
      const payload = res.data as unknown as { blob: Blob; filename?: string } | undefined;
      if (!payload) return;
      const url = URL.createObjectURL(payload.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = payload.filename || 'result_preview.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    }
  };

  const columns = useMemo<ColumnsType<UserResultPreviewDTO>>(
    () => [
      {
        title: 'ФИО',
        key: 'fio',
        render: (_, rec) => `${rec.lastname} ${rec.firstname} ${rec.patronymic ?? ''}`.trim(),
      },
      {
        title: 'Должность',
        dataIndex: 'jobRoles',
        key: 'jobRoles',
      },
      {
        title: '%',
        dataIndex: 'percent',
        key: 'percent',
        width: 100,
        render: (v: number) => `${Math.round(v)}%`,
        sorter: (a, b) => a.percent - b.percent,
        defaultSortOrder: 'descend',
      },
    ],
    []
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Предварительные результаты"
      footer={null}
      width={720}
      destroyOnClose
    >
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Input
          placeholder="Поиск по ФИО"
          allowClear
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={isDownloading}
          type="primary"
        >
          Скачать Excel
        </Button>
      </div>

      <Table<UserResultPreviewDTO>
        rowKey={(r) => r.userId}
        size="small"
        columns={columns}
        dataSource={data || []}
        loading={isFetching}
        locale={{ emptyText: <Empty description="Нет данных" /> }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </Modal>
  );
};

export default ResultPreviewModal;
