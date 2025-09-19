import React from 'react';
import { Typography, Card, Skeleton, List } from 'antd';
import type { UserSkillSearchDto } from '@/types/api/user';
import PermissionButton from "@/components/shared/PermissionButton.tsx";
import AdditionalSkillListItem from './AdditionalSkillListItem';

const { Title } = Typography;

interface UserSkillsSectionProps {
  skills: UserSkillSearchDto[];
  loading: boolean;
  userId: string;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEditTarget: (skill: { skillId: string; targetLevel: number }) => void;
}

// Убран тестовый inline-блок: дополнительные навыки отображают confirmations и прогресс через отдельный мемо-компонент

const UserSkillsSection: React.FC<UserSkillsSectionProps> = ({
  skills,
  loading,
  userId,
  onAdd,
  onDelete,
  onEditTarget
}) => (
  <div>
    <Title level={3}>Дополнительные навыки</Title>
    <Card
      title={<span>Навыки ({skills.length})</span>}
      extra={
        <PermissionButton size="small" onClick={onAdd}>
          Добавить
        </PermissionButton>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <List
          dataSource={skills}
          renderItem={(skill: UserSkillSearchDto) => (
            <AdditionalSkillListItem
              key={skill.skillId}
              skill={skill}
              userId={userId}
              onDelete={onDelete}
              onEditTarget={onEditTarget}
            />
          )}
        />
      )}
    </Card>
  </div>
);

export default UserSkillsSection;
