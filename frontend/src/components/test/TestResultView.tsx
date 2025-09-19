import React from 'react';
import {
  Result,
  Button,
  Card,
  Statistic,
  Row,
  Col,
  Typography,
  Spin,
  theme,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { UserDTO } from '@/types/api/auth';
import type { UserTestResultDTO } from '@/types/api/test';

const { Title, Text } = Typography;

interface TestResultViewProps {
  user: UserDTO | null;
  testResult: UserTestResultDTO | undefined;
  isLoading: boolean;
  error: unknown;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

const TestResultView: React.FC<TestResultViewProps> = ({
  user,
  testResult,
  isLoading,
  error,
  onNavigateHome,
  onNavigateLogin
}) => {
  const { token } = theme.useToken();

  if (!user) {
    return (
      <Result
        status="warning"
        title="Необходима авторизация"
        subTitle="Для просмотра результатов необходимо войти в систему"
        extra={[
          <Button type="primary" key="login" onClick={onNavigateLogin}>
            Войти
          </Button>
        ]}
      />
    );
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !testResult) {
    return (
      <Result
        status="error"
        title="Данные результатов отсутствуют"
        subTitle="Не удалось загрузить результаты тестирования"
        extra={[
          <Button type="primary" key="home" onClick={onNavigateHome}>
            На главную
          </Button>
        ]}
      />
    );
  }

  const isPassed = testResult.score >= testResult.needScore;
  const successRate = Math.round((testResult.score / testResult.questions.length) * 100);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '24px',
      }}
    >
      <Result
        status={isPassed ? 'success' : 'error'}
        icon={
          isPassed
            ? <CheckCircleOutlined style={{ color: token.colorSuccess }} />
            : <CloseCircleOutlined style={{ color: token.colorError }} />
        }
        title={isPassed ? 'Тест пройден успешно!' : 'Тест не пройден'}
        subTitle={
          `Вы набрали ${testResult.score} из ${testResult.needScore} необходимых баллов`
        }
      />

      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Правильных ответов"
              value={testResult.score}
              suffix={`/ ${testResult.questions.length}`}
              valueStyle={{ color: isPassed ? token.colorSuccess : token.colorError }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Процент успеха"
              value={successRate}
              suffix="%"
              valueStyle={{ color: isPassed ? token.colorSuccess : token.colorError }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Нужно для прохождения"
              value={testResult.needScore}
              suffix={`/ ${testResult.questions.length}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Детальные результаты */}
      <Card title="Детальные результаты" style={{ marginBottom: 24 }}>
        {testResult.questions.map((question, index) => {
          const correctAnswers = question.answers.filter(a => a.isTrue);
          const userAnswers = question.answers.filter(a => a.isPicked);
          const isQuestionCorrect =
            userAnswers.length === correctAnswers.length &&
            userAnswers.every(ua => ua.isTrue);

          return (
              <div
                key={question.QuestionID}
                style={{
                  marginBottom: 24,
                  padding: 16,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 4,
                  background: token.colorBgContainer,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <Title level={5} style={{ margin: 0, marginRight: 8 }}>
                    Вопрос {index + 1}
                  </Title>
                  {isQuestionCorrect ? (
                    <CheckCircleOutlined style={{ color: token.colorSuccess }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: token.colorError }} />
                  )}
                </div>
                
                <Text style={{ marginBottom: 12, display: 'block' }}>
                  {question.QuestionText}
                </Text>
              <div>
                {question.answers.map((answer) => (
                  <div
                    key={answer.answerId}
                    style={{
                      padding: '8px 12px',
                      margin: '4px 0',
                      borderRadius: 4,
                      backgroundColor: answer.isTrue
                        ? token.colorSuccessBg
                        : answer.isPicked
                          ? token.colorWarningBg
                          : token.colorFillTertiary,
                      border: `1px solid ${answer.isTrue
                        ? token.colorSuccess
                        : answer.isPicked
                          ? token.colorWarning
                          : token.colorBorder}`,
                    }}
                  >
                    <Text
                      style={{
                        color: answer.isTrue
                          ? token.colorSuccess
                          : answer.isPicked
                            ? token.colorWarning
                            : token.colorText,
                      }}
                    >
                      {answer.answerText}
                      {answer.isPicked && !answer.isTrue && ' ✗ (ваш ответ)'}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Card>

      {/* Действия */}
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" size="large" onClick={onNavigateHome}>
          На главную
        </Button>
      </div>
    </div>
  );
};

export default TestResultView;
