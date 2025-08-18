import React from 'react';
import { Tag, Tooltip } from 'antd';
import { CrownOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { ConfirmationDTO } from '@/types/api/user';
import { getPreviousLevel, getConfirmationTypeText, getConfirmationTypeColor } from '@/utils/confirmationHelpers';

interface SkillConfirmationStatusProps {
  confirmations: ConfirmationDTO[];
  compact?: boolean;
}

/**
 * Компонент для отображения статуса подтверждения навыка
 * Показывает специальные индикаторы для администраторских установок
 */
const SkillConfirmationStatus: React.FC<SkillConfirmationStatusProps> = ({
  confirmations,
  compact = false
}) => {
  if (!confirmations || confirmations.length === 0) {
    return null;
  }

  // Найти последнее подтверждение
  const lastConfirmation = confirmations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!lastConfirmation) {
    return null;
  }

  // Проверить, есть ли администраторские установки
  const hasAdminSet = confirmations.some(conf => conf.type === 'admin_set');
  const isLastAdminSet = lastConfirmation.type === 'admin_set';

  if (compact) {
    // Компактный режим - только иконки
    if (hasAdminSet) {
      return (
        <Tooltip title="Уровень установлен администратором">
          <CrownOutlined style={{ color: '#faad14' }} />
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Навык повышен">
        <CheckCircleOutlined style={{ color: '#52c41a' }} />
      </Tooltip>
    );
  }

  // Полный режим с тегами
  if (isLastAdminSet) {
    const previousLevel = getPreviousLevel(confirmations, lastConfirmation);
    const actionText = getConfirmationTypeText('admin_set', previousLevel, lastConfirmation.level);
    const actionColor = getConfirmationTypeColor('admin_set', previousLevel, lastConfirmation.level);
    
    return (
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Tag 
          icon={<CheckCircleOutlined />} 
          color={actionColor}
          style={{ borderRadius: '16px' }}
        >
          {actionText}
        </Tag>
        <Tag 
          icon={<CrownOutlined />} 
          color="orange"
          style={{ borderRadius: '16px' }}
        >
          Установлен администратором
        </Tag>
      </div>
    );
  }

  if (hasAdminSet) {
    return (
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Tag 
          icon={<CheckCircleOutlined />} 
          color="green"
          style={{ borderRadius: '16px' }}
        >
          Повышен
        </Tag>
        <Tag 
          icon={<WarningOutlined />} 
          color="orange"
          style={{ borderRadius: '16px' }}
        >
          Ранее установлен администратором
        </Tag>
      </div>
    );
  }

  return (
    <Tag 
      icon={<CheckCircleOutlined />} 
      color="green"
      style={{ borderRadius: '16px' }}
    >
      Повышен
    </Tag>
  );
};

export default SkillConfirmationStatus;
