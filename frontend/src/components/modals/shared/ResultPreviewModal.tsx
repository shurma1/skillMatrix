import { useEffect, useMemo, useState } from 'react';
import { Modal, Input, Table, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FC } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetUserResultPreviewQuery } from '@/store/endpoints';
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

  // When opened, trigger immediate refetch to ensure fresh data regardless of cache
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const columns = useMemo<ColumnsType<UserResultPreviewDTO>>(
    () => [
      {
        title: 'ФИО',
        key: 'fio',
        render: (_, rec) => `${rec.lastname} ${rec.firstname} ${rec.patronymic ?? ''}`.trim(),
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
        />
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
