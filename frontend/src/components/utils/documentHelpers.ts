/**
 * Утилиты для работы с документами
 */

/**
 * Определяет, является ли файл PDF документом
 */
export const isPdfDocument = (mimeType: string, fileName: string): boolean => {
  return mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
};

/**
 * Определяет, является ли файл Word документом (DOCX)
 */
export const isDocxDocument = (mimeType: string, fileName: string): boolean => {
  return mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
         fileName.toLowerCase().endsWith('.docx');
};

/**
 * Определяет, является ли файл старым Word документом (DOC)
 */
export const isDocDocument = (mimeType: string, fileName: string): boolean => {
  return mimeType === 'application/msword' || fileName.toLowerCase().endsWith('.doc');
};

/**
 * Определяет, является ли файл PowerPoint документом
 */
export const isPowerpointDocument = (mimeType: string, fileName: string): boolean => {
  return mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
         mimeType === 'application/vnd.ms-powerpoint' ||
         fileName.toLowerCase().endsWith('.pptx') ||
         fileName.toLowerCase().endsWith('.ppt');
};

/**
 * Определяет, является ли файл Excel документом
 */
export const isExcelDocument = (mimeType: string, fileName: string): boolean => {
  return mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
         mimeType === 'application/vnd.ms-excel' ||
         mimeType === 'application/vnd.oasis.opendocument.spreadsheet' ||
         /\.(xlsx|xls|xlsm|xlsb|ods)$/i.test(fileName);
};

/**
 * Определяет, является ли файл текстовым документом
 */
export const isTextDocument = (mimeType: string, fileName: string): boolean => {
  return mimeType === 'text/plain' || fileName.toLowerCase().endsWith('.txt');
};

/**
 * Определяет, является ли файл изображением
 */
export const isImageDocument = (mimeType: string, fileName: string): boolean => {
  return mimeType.startsWith('image/') || 
         /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);
};

/**
 * Определяет, является ли файл Word документом (любой версии)
 */
export const isWordDocument = (mimeType: string, fileName: string): boolean => {
  return isDocxDocument(mimeType, fileName) || isDocDocument(mimeType, fileName);
};

/**
 * Определяет, можно ли предварительно просмотреть документ с помощью react-doc-viewer
 */
export const canPreviewDocument = (mimeType: string, fileName: string): boolean => {
  return isPdfDocument(mimeType, fileName) ||
         isWordDocument(mimeType, fileName) ||
         isPowerpointDocument(mimeType, fileName) ||
         isExcelDocument(mimeType, fileName) ||
         isTextDocument(mimeType, fileName) ||
         isImageDocument(mimeType, fileName);
};

/**
 * Получает человекочитаемое название типа документа
 */
export const getDocumentTypeName = (mimeType: string, fileName: string): string => {
  if (isPdfDocument(mimeType, fileName)) return 'PDF документ';
  if (isDocxDocument(mimeType, fileName)) return 'Word документ (DOCX)';
  if (isDocDocument(mimeType, fileName)) return 'Word документ (DOC)';
  if (isPowerpointDocument(mimeType, fileName)) return 'PowerPoint презентация';
  if (isExcelDocument(mimeType, fileName)) {
    if (/\.xlsx$/i.test(fileName)) return 'Excel таблица (XLSX)';
    if (/\.xls$/i.test(fileName)) return 'Excel таблица (XLS)';
    if (/\.xlsm$/i.test(fileName)) return 'Excel таблица с макросами (XLSM)';
    if (/\.xlsb$/i.test(fileName)) return 'Excel двоичная книга (XLSB)';
    if (/\.ods$/i.test(fileName)) return 'OpenDocument таблица (ODS)';
    return 'Excel таблица';
  }
  if (isTextDocument(mimeType, fileName)) return 'Текстовый документ';
  if (isImageDocument(mimeType, fileName)) return 'Изображение';
  return 'Документ';
};

/**
 * Получает тип документа для react-doc-viewer
 */
export const getDocViewerType = (mimeType: string, fileName: string): string => {
  if (isPdfDocument(mimeType, fileName)) return 'application/pdf';
  if (isDocxDocument(mimeType, fileName)) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (isDocDocument(mimeType, fileName)) return 'application/msword';
  if (isPowerpointDocument(mimeType, fileName)) {
    if (fileName.toLowerCase().endsWith('.pptx')) {
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    }
    return 'application/vnd.ms-powerpoint';
  }
  if (isExcelDocument(mimeType, fileName)) {
    if (fileName.toLowerCase().endsWith('.xlsx')) {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    return 'application/vnd.ms-excel';
  }
  if (isTextDocument(mimeType, fileName)) return 'text/plain';
  if (isImageDocument(mimeType, fileName)) return mimeType;
  return mimeType;
};

/**
 * Форматирует размер файла в человекочитаемом виде
 */
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  if (bytes === 0) return '0 Б';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Создает URL для скачивания файла
 */
export const createDownloadUrl = (blob: Blob): string => {
  return window.URL.createObjectURL(blob);
};

/**
 * Скачивает файл через браузер
 */
export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = createDownloadUrl(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Очищает URL объекта
 */
export const revokeObjectUrl = (url: string): void => {
  window.URL.revokeObjectURL(url);
};
