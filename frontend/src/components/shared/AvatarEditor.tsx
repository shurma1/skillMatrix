import { Upload, Avatar, Tooltip, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import type { FC, ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { useUploadImageMutation, useGetImageQuery } from '@/store/endpoints';
import { API_BASE_URL } from '@/config/api.ts';

export interface AvatarEditorProps {
  avatarId?: string | null;
  initials: string;
  onChange: (imageId: string) => void;
  size?: number;
  tooltip?: string;
  crop?: boolean;
  aspect?: number;
  quality?: number;
  childrenOverlay?: ReactNode;
}

const AvatarEditor: FC<AvatarEditorProps> = ({
  avatarId,
  initials,
  onChange,
  size = 96,
  tooltip = 'Изменить аватарку',
  crop = true,
  aspect = 1,
  quality = 0.9,
  childrenOverlay
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const { data: imageBlob } = useGetImageQuery(
    { id: avatarId as string, thumb: true },
    { skip: !avatarId }
  );
  const objectUrl = useMemo(
    () => (imageBlob ? URL.createObjectURL(imageBlob) : undefined),
    [imageBlob]
  );

  const beforeCrop = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) {
      // eslint-disable-next-line no-alert
      alert('Можно загружать только изображения');
      return false;
    }
    if (!isLt5M) {
      // eslint-disable-next-line no-alert
      alert('Изображение должно быть меньше 5MB');
      return false;
    }
    return true;
  };

  const uploadNode = (
    <Upload
      accept="image/*"
      showUploadList={false}
      customRequest={async ({ file, onSuccess, onError }) => {
        try {
          const img = await uploadImage({ image: file as File }).unwrap();
            onChange(img.id);
          onSuccess && onSuccess({}, new XMLHttpRequest());
        } catch (error) {
          onError && onError(error as Error);
        }
      }}
    >
      <Tooltip title={tooltip}>
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Avatar
            size={size}
            src={objectUrl || (avatarId ? `${API_BASE_URL}/api/image/${avatarId}?thumb=true` : undefined)}
            style={{
              transition: 'all 0.3s ease',
              filter: isHovered || isLoading ? 'brightness(0.6)' : 'none'
            }}
          >
            {initials}
          </Avatar>
          {(isHovered || isLoading || childrenOverlay) && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: size / 4
              }}
            >
              {isLoading ? (
                <Spin style={{ color: 'white' }} />
              ) : (
                childrenOverlay || <EditOutlined />
              )}
            </div>
          )}
        </div>
      </Tooltip>
    </Upload>
  );

  if (!crop) return uploadNode;

  return (
    <ImgCrop
      showGrid
      aspect={aspect}
      quality={quality}
      modalTitle="Обрезать изображение"
      beforeCrop={beforeCrop}
      modalOk="Применить"
      modalCancel="Отмена"
    >
      {uploadNode}
    </ImgCrop>
  );
};

export default AvatarEditor;
