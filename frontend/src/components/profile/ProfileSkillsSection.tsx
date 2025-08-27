import React from 'react';
import { Typography, Card, Skeleton, List, Tag, Flex, Popconfirm } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import type { UserSkillSearchDto } from '@/types/api/user';
import SkillProgressBar from '../shared/SkillProgressBar';

const { Title } = Typography;

interface ProfileSkillsSectionProps {
  skills: UserSkillSearchDto[];
  loading: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEditTarget: (skill: { skillId: string; targetLevel: number }) => void;
}

const ProfileSkillsSection: React.FC<ProfileSkillsSectionProps> = ({
  skills,
  loading,
  onAdd,
  onDelete,
  onEditTarget
}) => (
  <div>
    <Title level={3}>Мои навыки</Title>
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
          renderItem={skill => (
            <List.Item style={{ display: 'block', paddingBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'flex-start',
                  gap: 16
                }}
              >
                <Flex vertical style={{ flex: 1 }} gap={4}>
                  <strong
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {skill.title}
                    <Link
                      to={`/skills/${skill.skillId}`}
                      title="Перейти к навыку"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <LinkOutlined style={{ color: '#1677ff' }} />
                    </Link>
                  </strong>
                  <div>
                    {skill.tags.map((tag) => (
                      <Tag key={tag.id}>{tag.name}</Tag>
                    ))}
                  </div>
                </Flex>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 4
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {skill.level}/{skill.targetLevel}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <PermissionButton
                      size="small"
                      type="link"
                      onClick={() => onEditTarget({
                        skillId: skill.skillId,
                        targetLevel: skill.targetLevel
                      })}
                    >
                      Изменить
                    </PermissionButton>
                    <Popconfirm
                      title="Удалить навык?"
                      okText="Да"
                      cancelText="Нет"
                      onConfirm={() => onDelete(skill.skillId)}
                    >
                      <PermissionButton size="small" type="link" danger>
                        Удалить
                      </PermissionButton>
                    </Popconfirm>
                  </div>
                </div>
              </div>
              <SkillProgressBar
                level={skill.level}
                target={skill.targetLevel}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  </div>
);

export default ProfileSkillsSection;
