import React from 'react';
import { Card, Button, Space, Tooltip, Statistic, Row, Col, Tag, theme } from 'antd';
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { PreviewTestDto, CreateTestDTO, UserTestResultDTO } from '@/types/api/test';

interface SkillTestCardProps {
  test?: PreviewTestDto;
  hasTest: boolean;
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  userTestResult?: UserTestResultDTO;
  isUserTestResultLoading: boolean;
  onCreateTest: (data: CreateTestDTO) => void;
  onDeleteTest: () => void;
  onEditTest: () => void;
  onTakeTest: () => void;
  onGoToCreateTest: () => void;
  onViewTestResults: () => void;
}

const SkillTestCard: React.FC<SkillTestCardProps> = ({ 
  test, 
  hasTest,
  loading,
  userTestResult,
  isUserTestResultLoading,
  onEditTest,
  onTakeTest,
  onGoToCreateTest,
  onViewTestResults,
 
}) => {
  const { token } = theme.useToken();
  const isTestPassed = Boolean(userTestResult && userTestResult.score >= userTestResult.needScore);
  const hasTestResult = Boolean(userTestResult);
  const renderTestActions = () => {
    if (!hasTest) {
      return (
        <Button 
          type="primary" 
          onClick={onGoToCreateTest}
        >
          Создать тест
        </Button>
      );
    }

    return (
      <Space>
        {hasTestResult ? (
          <Tooltip title={`Тест уже пройден (${userTestResult?.score}/${userTestResult?.needScore} баллов). ${isTestPassed ? 'Результат засчитан.' : 'Для повторного прохождения обратитесь к администратору.'}`}>
            <Button 
              type="primary" 
              disabled
              onClick={onTakeTest}
            >
              Пройти тест
            </Button>
          </Tooltip>
        ) : (
          <Button type="primary" onClick={onTakeTest}>
            Пройти тест
          </Button>
        )}
        
        {hasTestResult && (
          <Button 
            icon={<EyeOutlined />}
            onClick={onViewTestResults}
          >
            Посмотреть все результаты
          </Button>
        )}
        <Button 
          icon={<EditOutlined />}
          onClick={onEditTest}
        >
          Редактировать
        </Button>
      </Space>
    );
  };

  const renderTestContent = () => {
    if (loading) {
      return <div>Загрузка...</div>;
    }

    if (!hasTest) {
      return <div>Тест не создан</div>;
    }

    if (test) {
      return (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {/* Информация о тесте */}
          <div>
            <p><strong>Название:</strong> {test.title}</p>
            <p><strong>Вопросов:</strong> {test.questionsCount}</p>
            <p><strong>Порог:</strong> {test.needScore}</p>
            <p><strong>Лимит времени:</strong> {test.timeLimit} сек.</p>
          </div>

          {/* Результаты пользователя */}
          {hasTestResult && userTestResult && (
            <div
              style={{
                background: isTestPassed ? token.colorSuccessBg : token.colorWarningBg,
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${isTestPassed ? token.colorSuccess : token.colorWarning}`,
              }}
            >
              <h4 style={{ 
                margin: '0 0 12px 0', 
                color: isTestPassed ? token.colorSuccess : token.colorWarning,
              }}>
                Ваши результаты
              </h4>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Статус"
                    value={isTestPassed ? 'Пройден' : 'Не пройден'}
                    valueStyle={{ color: isTestPassed ? token.colorSuccess : token.colorError }}
                    prefix={isTestPassed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Набрано баллов"
                    value={userTestResult.score}
                    suffix={`из ${userTestResult.needScore}`}
                    valueStyle={{ color: isTestPassed ? token.colorSuccess : token.colorError }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Процент правильных"
                    value={Math.round((userTestResult.score / userTestResult.questions.length) * 100)}
                    suffix="%"
                    valueStyle={{ color: isTestPassed ? token.colorSuccess : token.colorError }}
                  />
                </Col>
              </Row>
              
              {!isTestPassed && (
                <div style={{ marginTop: 12 }}>
                  <Tag color={'warning'} style={{ fontSize: '13px' }}>
                    {'⚠ Требуется повторное прохождение'}
                  </Tag>
                </div>
              )}
            </div>
          )}

          {/* Состояние загрузки результатов */}
          {isUserTestResultLoading && (
            <div>Загрузка результатов...</div>
          )}
        </Space>
      );
    }

    return <div>Информация о тесте недоступна</div>;
  };

  return (
    <Card
      title="Тест"
      extra={renderTestActions()}
    >
      {renderTestContent()}
    </Card>
  );
};

export default SkillTestCard;
