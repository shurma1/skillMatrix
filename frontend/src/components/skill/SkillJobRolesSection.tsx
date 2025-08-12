import React from 'react';
import { Typography, Card, List, Skeleton, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Временный интерфейс, пока нет API для получения должностей по навыку
interface SkillJobRole {
  id: string;
  title: string;
  requiredLevel: number;
}

interface SkillJobRolesSectionProps {
  jobRoles: SkillJobRole[];
  loading: boolean;
}

const SkillJobRolesSection: React.FC<SkillJobRolesSectionProps> = ({
  jobRoles,
  loading
}) => (
  <div>
    <Title level={3}>Должности с данным навыком</Title>
    <Card
      title={<span>Должности ({jobRoles.length})</span>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : jobRoles.length === 0 ? (
        <Alert
          message="API для получения должностей по навыку не реализован"
          description="Этот блок будет работать после добавления соответствующего эндпоинта в бэкенд"
          type="info"
          showIcon
        />
      ) : (
        <List
          dataSource={jobRoles}
          renderItem={jobRole => (
            <List.Item>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <strong
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {jobRole.title}
                  <Link
                    to={`/jobroles/${jobRole.id}`}
                    title="Перейти к должности"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <LinkOutlined style={{ color: '#1677ff' }} />
                  </Link>
                </strong>
                <div>
                  Требуемый уровень: <strong>{jobRole.requiredLevel}</strong>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  </div>
);

export default SkillJobRolesSection;
