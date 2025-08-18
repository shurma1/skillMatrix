import React from 'react';
import { Typography, Card, Skeleton, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';

const { Title } = Typography;

type AnyJobrole = { id?: string; jobRoleId?: string; title: string };

const normalizeJobroleId = (jr: AnyJobrole): string => jr.id || jr.jobRoleId || '';

interface MyJobRolesSectionProps {
  jobroles: AnyJobrole[];
  loading: boolean;
  jobRoleSkillsComponent: (jobroleId: string) => React.ReactNode;
}

const MyJobRolesSection: React.FC<MyJobRolesSectionProps> = ({
  jobroles,
  loading,
  jobRoleSkillsComponent
}) => (
  <div>
    <Title level={3}>Мои должности</Title>
    <Card
      title={`Должности (${jobroles.length})`}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : jobroles.length === 0 ? (
        <p>Должности не назначены</p>
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

export default MyJobRolesSection;
