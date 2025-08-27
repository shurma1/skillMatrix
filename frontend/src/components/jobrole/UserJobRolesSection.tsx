import React from 'react';
import { Typography, Card, Skeleton, Flex, Collapse, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import PermissionButton from "@/components/shared/PermissionButton.tsx";

const { Title } = Typography;

type AnyJobrole = { id?: string; jobRoleId?: string; title: string };

const normalizeJobroleId = (jr: AnyJobrole): string => jr.id || jr.jobRoleId || '';

interface UserJobRolesSectionProps {
  jobroles: AnyJobrole[];
  loading: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  userId: string;
  jobRoleSkillsComponent: (userId: string, jobroleId: string) => React.ReactNode;
}

const UserJobRolesSection: React.FC<UserJobRolesSectionProps> = ({
  jobroles,
  loading,
  onAdd,
  onDelete,
  userId,
  jobRoleSkillsComponent
}) => (
  <div>
    <Title level={3}>Должности и навыки</Title>
    <Card
      title={
        <Flex justify="space-between" align="center">
          <span>Должности ({jobroles.length})</span>
          <PermissionButton size="small" onClick={onAdd}>
            Добавить
          </PermissionButton>
        </Flex>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <Collapse accordion>
          {jobroles.map(jr => {
            const jrId = normalizeJobroleId(jr);
            return (
              <Collapse.Panel
                key={jrId || jr.title}
                header={
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {jr.title}
                    <Link
                      to={`/jobroles/${jrId}`}
                      onClick={e => e.stopPropagation()}
                      title="Перейти к должности"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <LinkOutlined style={{ color: '#1677ff' }} />
                    </Link>
                  </span>
                }
                extra={
                  <Popconfirm
                    title="Удалить должность?"
                    okText="Да"
                    cancelText="Нет"
                    onConfirm={() => onDelete(jrId)}
                  >
                    <PermissionButton
                      size="small"
                      danger
                      type="text"
                      onClick={e => e.stopPropagation()}
                    >
                      Удалить
                    </PermissionButton>
                  </Popconfirm>
                }
              >
                {jobRoleSkillsComponent(userId, jrId)}
              </Collapse.Panel>
            );
          })}
        </Collapse>
      )}
    </Card>
  </div>
);

export default UserJobRolesSection;
