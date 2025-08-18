import React from 'react';
import { Typography, Card, Button, Skeleton, Flex, Collapse, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';

const { Title } = Typography;

type AnyJobrole = { id?: string; jobRoleId?: string; title: string };

const normalizeJobroleId = (jr: AnyJobrole): string => jr.id || jr.jobRoleId || '';

interface ProfileJobRolesSectionProps {
  jobroles: AnyJobrole[];
  loading: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  jobRoleSkillsComponent: (jobroleId: string) => React.ReactNode;
}

const ProfileJobRolesSection: React.FC<ProfileJobRolesSectionProps> = ({
  jobroles,
  loading,
  onAdd,
  onDelete,
  jobRoleSkillsComponent
}) => (
  <div>
    <Title level={3}>Мои должности</Title>
    <Card
      title={
        <Flex justify="space-between" align="center">
          <span>Должности ({jobroles.length})</span>
          <Button size="small" onClick={onAdd}>
            Добавить
          </Button>
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
                    <Button
                      size="small"
                      danger
                      type="text"
                      onClick={e => e.stopPropagation()}
                    >
                      Удалить
                    </Button>
                  </Popconfirm>
                }
              >
                {jobRoleSkillsComponent(jrId)}
              </Collapse.Panel>
            );
          })}
        </Collapse>
      )}
    </Card>
  </div>
);

export default ProfileJobRolesSection;
