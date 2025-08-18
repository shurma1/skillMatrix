import React from 'react';
import { List, Tag, Typography, Empty } from 'antd';
import type { ConfirmationDTO } from '@/types/api/user';
import SkillLevelDisplay from '../shared/SkillLevelDisplay';
import { 
  getConfirmationTypeText, 
  getConfirmationTypeColor, 
  formatConfirmationDate,
  getPreviousLevel
} from '@/utils/confirmationHelpers';

const { Text } = Typography;

interface SkillConfirmationsListProps {
  confirmations: ConfirmationDTO[];
  loading?: boolean;
}

const SkillConfirmationsList: React.FC<SkillConfirmationsListProps> = ({
  confirmations,
  loading = false
}) => {
  if (!confirmations.length && !loading) {
    return <Empty description="Нет подтверждений навыка" />;
  }

  return (
    <List
      loading={loading}
      size="small"
      dataSource={confirmations}
      renderItem={(confirmation) => {
        // Получаем предыдущий уровень для admin_set подтверждений
        const previousLevel = confirmation.type === 'admin_set' 
          ? getPreviousLevel(confirmations, confirmation)
          : undefined;
        
        return (
          <List.Item>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Tag color={getConfirmationTypeColor(confirmation.type, previousLevel, confirmation.level)}>
                    {getConfirmationTypeText(confirmation.type, previousLevel, confirmation.level)}
                  </Tag>
                  {confirmation.type === 'admin_set' && (
                    <Tag color="orange" style={{ fontSize: '11px' }}>
                      Установлен администратором
                    </Tag>
                  )}
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {formatConfirmationDate(confirmation.date)}
                </Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Text strong>
                  Уровень: <SkillLevelDisplay level={confirmation.level} />
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  v{confirmation.version}
                </Text>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};

export default SkillConfirmationsList;
