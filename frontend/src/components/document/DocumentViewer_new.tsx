import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, message, Spin, Alert, Space, Typography } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { API_BASE_URL } from '@/config/api';
import { extractErrMessage } from '@/utils/errorHelpers.ts';
import {
  canPreviewDocument,
  getDocumentTypeName,
  formatFileSize,
  downloadFile,
  createDownloadUrl,
  revokeObjectUrl,
} from '../utils/documentHelpers';

const { Text } = Typography;

interface DocumentViewerProps {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface DocumentSource {
  uri: string;
  fileType?: string;
  fileName?: string;
}

/**
 * Компонент для просмотра документов с использованием react-doc-viewer
 * Поддерживает PDF, DOCX, DOC, PPTX, PPT, XLSX, XLS, TXT, изображения
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({
  fileId,
  fileName,
  fileSize,
  mimeType
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Получаем токен авторизации из store
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Определяем возможности файла
  const canPreview = canPreviewDocument(mimeType, fileName);
  const formattedFileSize = formatFileSize(fileSize);
  const documentType = getDocumentTypeName(mimeType, fileName);

  // Функция для загрузки файла с авторизацией
  const fetchFileBlob = useCallback(async (): Promise<Blob> => {
    const url = `${API_BASE_URL}/api/file/${fileId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки файла: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }, [fileId, accessToken]);

  // Загрузка файла для просмотра
  const loadFileForViewing = useCallback(async () => {
    if (!canPreview) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);
      
      const blob = await fetchFileBlob();
      
      if (blob.size === 0) {
        throw new Error('Файл пустой (размер 0 байт)');
      }
      
      setDocumentBlob(blob);
      const url = createDownloadUrl(blob);
      setDocumentUrl(url);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading file for viewing:', error);
      const errorMessage = extractErrMessage(error) || 'Ошибка загрузки документа для просмотра';
      setLoadError(errorMessage);
      setIsLoading(false);
    }
  }, [canPreview, fetchFileBlob]);

  // Подготовка документа для react-doc-viewer
  const documentSources: DocumentSource[] = documentUrl ? [{
    uri: documentUrl,
    fileName: fileName
  }] : [];

  // Скачивание файла
  const handleDownloadDocument = useCallback(async () => {
    try {
      setIsDownloading(true);
      
      // Если уже есть blob от просмотра, используем его
      if (documentBlob) {
        if (documentBlob.size === 0) {
          message.error('Файл пустой, не может быть скачан');
          return;
        }
        downloadFile(documentBlob, fileName);
        message.success('Файл скачан');
        return;
      }

      // Загружаем файл для скачивания
      const blob = await fetchFileBlob();
      
      if (blob.size === 0) {
        message.error('Получен пустой файл');
        return;
      }
      
      downloadFile(blob, fileName);
      message.success('Файл скачан');
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error(extractErrMessage(error) || 'Ошибка скачивания файла');
    } finally {
      setIsDownloading(false);
    }
  }, [documentBlob, fileName, fetchFileBlob]);

  // Автоматическая загрузка документа при монтировании
  useEffect(() => {
    if (accessToken) {
      loadFileForViewing();
    }
  }, [accessToken, loadFileForViewing]);

  // Очистка URL при размонтировании
  useEffect(() => {
    return () => {
      if (documentUrl) {
        revokeObjectUrl(documentUrl);
      }
    };
  }, [documentUrl]);

  // Состояние загрузки
  if (isLoading) {
    return (
      <div style={{ width: '100%' }}>
        <Card
          title={
            <Space>
              <FileTextOutlined />
              Загрузка документа
            </Space>
          }
          extra={
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadDocument}
              loading={isDownloading}
            >
              Скачать
            </Button>
          }
        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px'
          }}>
            <Space direction="vertical" align="center">
              <Spin size="large" />
              <Text>Загрузка документа...</Text>
              <Text type="secondary">
                {fileName} ({formattedFileSize})
              </Text>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  // Состояние ошибки загрузки
  if (loadError) {
    return (
      <div style={{ width: '100%' }}>
        <Card
          title={
            <Space>
              <FileTextOutlined />
              Ошибка загрузки
            </Space>
          }
          extra={
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadDocument}
              loading={isDownloading}
            >
              Скачать
            </Button>
          }
        >
          <Alert
            message="Не удалось загрузить документ для просмотра"
            description={loadError}
            type="error"
            showIcon
            action={
              <Button onClick={loadFileForViewing}>
                Попробовать снова
              </Button>
            }
          />
          <div style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Название: </Text>
                <Text>{fileName}</Text>
              </div>
              <div>
                <Text strong>Тип: </Text>
                <Text>{documentType}</Text>
              </div>
              <div>
                <Text strong>Размер: </Text>
                <Text>{formattedFileSize}</Text>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  // Просмотр документа с react-doc-viewer
  if (canPreview && documentUrl) {
    return (
      <div style={{ width: '100%' }}>
        <Card
          title={
            <Space>
              <FileTextOutlined />
              {fileName}
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadDocument}
              loading={isDownloading}
            >
              Скачать
            </Button>
          }
        >
          <div style={{ width: '100%', minHeight: '70vh' }}>
            <DocViewer
              documents={documentSources}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: false,
                  retainURLParams: false,
                }
              }}
              style={{
                width: '100%',
                height: '70vh',
              }}
            />
          </div>
        </Card>
      </div>
    );
  }

  // Информация для неподдерживаемых документов
  return (
    <div style={{ width: '100%' }}>
      <Card
        title={
          <Space>
            <FileTextOutlined />
            Информация о документе
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadDocument}
            loading={isDownloading}
          >
            Скачать
          </Button>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Название: </Text>
            <Text>{fileName}</Text>
          </div>
          <div>
            <Text strong>Тип: </Text>
            <Text>{documentType}</Text>
          </div>
          <div>
            <Text strong>Размер: </Text>
            <Text>{formattedFileSize}</Text>
          </div>
        </Space>
        
        <Alert
          message="Просмотр недоступен"
          description={
            <div>
              <p>
                Данный тип документа не поддерживается для просмотра в браузере.
                Скачайте файл для просмотра в соответствующем приложении.
              </p>
              <p style={{ marginBottom: 0 }}>
                <Text strong>Поддерживаемые форматы:</Text> PDF, DOCX, DOC, PPTX, PPT, XLSX, XLS, TXT, изображения
              </p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: '16px' }}
        />
      </Card>
    </div>
  );
};

export default DocumentViewer;
