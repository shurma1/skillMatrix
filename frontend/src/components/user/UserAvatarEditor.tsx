import { Upload, Avatar, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import { useUploadImageMutation, useGetImageQuery } from '@/store/endpoints';
import { API_BASE_URL } from '@/config/api.ts';

interface UserAvatarEditorProps {
  avatarId?: string | null;
  initials: string;
  onChange: (imageId: string) => void;
}

const UserAvatarEditor: FC<UserAvatarEditorProps> = ({
  avatarId,
  initials,
  onChange
}) => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const { data: imageBlob } = useGetImageQuery(
    { id: avatarId as string, thumb: true },
    { skip: !avatarId }
  );
  const objectUrl = imageBlob ? URL.createObjectURL(imageBlob) : undefined;

  return (
    <Space direction="vertical" align="center">
      <Avatar
        size={96}
        src={objectUrl || (avatarId ? `${API_BASE_URL}/api/image/${avatarId}?thumb=true` : undefined)}
      >
        {initials}
      </Avatar>
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
        <Button
          size="small"
          icon={<UploadOutlined />}
          loading={isLoading}
        >
          Загрузить
        </Button>
      </Upload>
    </Space>
  );
};

export default UserAvatarEditor;
