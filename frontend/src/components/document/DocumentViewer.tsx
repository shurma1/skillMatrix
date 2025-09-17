import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Button, message, Spin, Alert, Space, Typography, Tabs } from 'antd';
import { DownloadOutlined, FileTextOutlined, FileImageOutlined, FilePdfOutlined, FileUnknownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
// API_BASE_URL no longer needed here; requests go through authManager
import { authManager } from '@/utils/AuthManager';
import { extractErrMessage } from '@/utils/errorHelpers.ts';
import {
  getDocumentTypeName,
  formatFileSize,
  downloadFile,
} from '../utils/documentHelpers';
import './documentViewer.css';

// Types
interface DocumentViewerProps {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

type SupportedRenderType = 'pdf' | 'image' | 'text' | 'docx' | 'xlsx' | 'unsupported';

interface XlsxSheet {
  name: string;
  html: string;
}

interface MammothConvertOptions {
  convertImage: (imageElement: ImageElement) => Promise<{ src: string }>;
}

interface ImageElement {
  read: (format: 'base64') => Promise<string>;
  contentType: string;
}

interface MammothResult {
  value: string;
}

interface MammothLib {
  convertToHtml: (input: { arrayBuffer: ArrayBuffer }, options?: MammothConvertOptions) => Promise<MammothResult>;
  images: {
    inline: (converter: (img: ImageElement) => Promise<{ src: string }>) => (imageElement: ImageElement) => Promise<{ src: string }>;
  };
}

interface XlsxLib {
  read: (data: ArrayBuffer, options?: { type: string }) => Workbook;
  utils: {
    sheet_to_html: (worksheet: WorkSheet) => string;
  };
}

interface Workbook {
  SheetNames: string[];
  Sheets: { [key: string]: WorkSheet };
}

interface WorkSheet {
  [key: string]: unknown;
}

// Lazy imports
let mammothLib: MammothLib | null = null;
let xlsxLib: XlsxLib | null = null;

const { Text } = Typography;

/**
 * Компонент для просмотра документов без внешних зависимостей
 * Поддерживаемые форматы:
 * - PDF (iframe)
 * - Изображения (img)
 * - Текстовые файлы (pre)
 * - DOCX (mammoth с поддержкой изображений)
 * - XLSX (отображение листов в виде таблиц)
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({
  fileId,
  fileName,
  fileSize,
  mimeType
}) => {
  // State
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [xlsxSheets, setXlsxSheets] = useState<XlsxSheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [documentBlob, setDocumentBlob] = useState<Blob | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Selectors
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Computed values
  const formattedFileSize = formatFileSize(fileSize);
  const documentType = getDocumentTypeName(mimeType, fileName);

  const renderType: SupportedRenderType = useMemo(() => {
    const nameLower = fileName.toLowerCase();
    
    if (mimeType === 'application/pdf' || nameLower.endsWith('.pdf')) {
      return 'pdf';
    }
    
    if (mimeType.startsWith('image/') || /(png|jpe?g|gif|webp|bmp|svg)$/i.test(nameLower)) {
      return 'image';
    }
    
    if (mimeType.startsWith('text/') || nameLower.endsWith('.txt') || nameLower.endsWith('.log')) {
      return 'text';
    }
    
    if (/\.docx$/i.test(nameLower)) {
      return 'docx';
    }
    
    if (/\.xlsx$/i.test(nameLower)) {
      return 'xlsx';
    }
    
    return 'unsupported';
  }, [mimeType, fileName]);

  // Helper functions
  const createImageConverter = () => {
    if (!mammothLib?.images) {
      throw new Error('Mammoth library not loaded');
    }
    
    return mammothLib.images.inline(async (img: ImageElement) => {
      const base64Data = await img.read('base64');
      return { src: `data:${img.contentType};base64,${base64Data}` };
    });
  };

  // API functions
  const fetchFileBlob = useCallback(async (): Promise<Blob> => {
    // Центральный маршрут: AuthManager добавит токен и выполнит refresh при необходимости
    const response = await authManager.fetch(`/api/file/${fileId}`);
    // Ошибочные статусы уже преобразуются в Error('HTTP xxx') — сюда не попадём если не ok
    return response.blob();
  }, [fileId]);

  // Document processing functions
  const processDocxFile = async (arrayBuffer: ArrayBuffer) => {
    try {
      if (!mammothLib) {
        mammothLib = await import('mammoth') as MammothLib;
      }

      const result = await mammothLib.convertToHtml(
        { arrayBuffer },
        { convertImage: createImageConverter() }
      );

      if (isMounted) {
        setDocxHtml(result.value);
      }
    } catch (error) {
      console.error('DOCX processing error:', error);
      throw error;
    }
  };

  const processXlsxFile = async (arrayBuffer: ArrayBuffer) => {
    try {
      if (!xlsxLib) {
        xlsxLib = await import('xlsx') as XlsxLib;
      }

      const workbook = xlsxLib.read(arrayBuffer, { type: 'array' });
      const sheets: XlsxSheet[] = workbook.SheetNames.map(sheetName => ({
        name: sheetName,
        html: xlsxLib!.utils.sheet_to_html(workbook.Sheets[sheetName])
      }));

      if (isMounted) {
        setXlsxSheets(sheets);
      }
    } catch (error) {
      console.error('XLSX processing error:', error);
      throw error;
    }
  };

  const processTextFile = async (blob: Blob) => {
    try {
      const text = await blob.text();
      if (isMounted) {
        setTextContent(text);
      }
    } catch (error) {
      console.error('Text processing error:', error);
      throw error;
    }
  };

  const createObjectUrl = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    if (isMounted) {
      setObjectUrl(url);
    }
    return url;
  };

  // Main loading function
  const loadFileForViewing = useCallback(async () => {
    if (!accessToken) {
      setLoadError('Отсутствует токен авторизации');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
  const blob = await fetchFileBlob();
      
      if (!isMounted) return;

      setDocumentBlob(blob);

      switch (renderType) {
        case 'pdf':
        case 'image':
          createObjectUrl(blob);
          break;

        case 'text':
          await processTextFile(blob);
          break;

        case 'docx':
          const arrayBuffer = await blob.arrayBuffer();
          await processDocxFile(arrayBuffer);
          break;

        case 'xlsx':
          const xlsxArrayBuffer = await blob.arrayBuffer();
          await processXlsxFile(xlsxArrayBuffer);
          break;

        case 'unsupported':
          // Просто сохраняем blob для скачивания
          break;

        default:
          throw new Error(`Неподдерживаемый тип файла: ${renderType}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      const errorMessage = extractErrMessage(error);
      console.error('Error loading file:', error);
      
      if (isMounted) {
        setLoadError(errorMessage);
        message.error(`Ошибка загрузки документа: ${errorMessage}`);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }

  return undefined;
  }, [accessToken, renderType, fileId]);

  // Event handlers
  const handleDownload = async () => {
    if (!documentBlob) {
      message.error('Файл не загружен');
      return;
    }

    setIsDownloading(true);
    try {
      await downloadFile(documentBlob, fileName);
      message.success('Файл скачан');
    } catch (error) {
      const errorMessage = extractErrMessage(error);
      message.error(`Ошибка скачивания: ${errorMessage}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Render functions
  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Загрузка документа...</Text>
          </div>
        </div>
      );
    }

    if (loadError) {
      return (
        <Alert
          type="error"
          showIcon
          message="Ошибка загрузки документа"
          description={loadError}
          action={
            <Button size="small" onClick={loadFileForViewing}>
              Повторить
            </Button>
          }
        />
      );
    }

    switch (renderType) {
      case 'pdf':
        return objectUrl ? (
          <iframe
            src={objectUrl}
            style={{ width: '100%', height: '70vh', border: 'none' }}
            title={fileName}
          />
        ) : (
          <Alert type="warning" message="PDF не загружен" />
        );

      case 'image':
        return objectUrl ? (
          <div style={{ textAlign: 'center', maxHeight: '70vh', overflow: 'auto' }}>
            <img
              src={objectUrl}
              alt={fileName}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        ) : (
          <Alert type="warning" message="Изображение не загружено" />
        );

      case 'text':
        return textContent ? (
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            maxHeight: '70vh', 
            overflow: 'auto',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            {textContent}
          </pre>
        ) : (
          <Alert type="warning" message="Текст не загружен" />
        );

      case 'docx':
        return docxHtml ? (
          <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <div 
              className="docx-content"
              dangerouslySetInnerHTML={{ __html: docxHtml }} 
            />
          </div>
        ) : (
          <Alert 
            type="warning" 
            showIcon 
            message="Не удалось отобразить DOCX" 
            description="Скачайте файл для просмотра в Word." 
          />
        );

      case 'xlsx':
        return xlsxSheets.length > 0 ? (
          <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <Tabs
              items={xlsxSheets.map((sheet, index) => ({
                key: index.toString(),
                label: sheet.name,
                children: (
                  <div 
                    dangerouslySetInnerHTML={{ __html: sheet.html }}
                    style={{ overflow: 'auto' }}
                  />
                )
              }))}
            />
          </div>
        ) : (
          <Alert type="warning" message="Не удалось обработать XLSX файл" />
        );

      case 'unsupported':
        return (
          <Alert
            type="info"
            showIcon
            message="Предварительный просмотр недоступен"
            description={`Файл типа ${documentType} не поддерживается для просмотра. Скачайте файл для открытия в соответствующем приложении.`}
            action={
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                loading={isDownloading}
              >
                Скачать
              </Button>
            }
          />
        );

      default:
        return <Alert type="error" message="Неизвестный тип документа" />;
    }
  };

  const getFileIcon = () => {
    switch (renderType) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'image':
        return <FileImageOutlined style={{ color: '#52c41a' }} />;
      case 'text':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'docx':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'xlsx':
        return <FileTextOutlined style={{ color: '#52c41a' }} />;
      default:
        return <FileUnknownOutlined style={{ color: '#999' }} />;
    }
  };

  // Effects
  useEffect(() => {
    loadFileForViewing();

    return () => {
      setIsMounted(false);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId, accessToken, renderType]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  // Render
  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {getFileIcon()}
            <div>
              <Text strong>{fileName}</Text>
              <div>
                <Text type="secondary">{documentType} • {formattedFileSize}</Text>
              </div>
            </div>
          </Space>
          
          <Button 
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={isDownloading}
            disabled={!documentBlob}
          >
            Скачать
          </Button>
        </div>

        {renderContent()}
      </Space>
    </Card>
  );
};

export default DocumentViewer;
