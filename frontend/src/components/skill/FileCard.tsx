import React from 'react';
import { Card, Button, Typography, Space, Spin } from 'antd';
import { EyeOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { FileDTO } from '@/types/api/file';

const { Text } = Typography;

interface FileCardProps {
  fileInfo?: FileDTO;
  loading: boolean;
  skillId: string;
}

const FileCard: React.FC<FileCardProps> = ({ 
  fileInfo, 
  loading, 
  skillId 
}) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/skills/${skillId}/document`);
  };
  if (loading) {
    return (
      <Card title="Файл">
        <Spin />
      </Card>
    );
  }

  if (!fileInfo) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    if (bytes === 0) return '0 Б';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      title={
        <Space>
          <FileOutlined />
          Файл документа
        </Space>
      }
      extra={
        <Button 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={handleOpen}
        >
          Открыть
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Название: </Text>
          <Text>{fileInfo.name}</Text>
        </div>
        <div>
          <Text strong>Размер: </Text>
          <Text>{formatFileSize(fileInfo.size)}</Text>
        </div>
        <div>
          <Text strong>Загружен: </Text>
          <Text>{formatDate(fileInfo.createdAt)}</Text>
        </div>
      </Space>
    </Card>
  );
};

export default FileCard;
