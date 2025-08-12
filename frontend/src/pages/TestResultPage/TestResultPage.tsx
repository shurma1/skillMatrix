import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Result, Button, Card, Statistic, Row, Col, Typography, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useGetUserTestResultQuery, useGetFullTestQuery } from '@/store/endpoints';
import type { RootState } from '@/store/store';

const { Title, Text } = Typography;

const TestResultPage: React.FC = () => {
  const { testId = '' } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  // Получаем пользователя из Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // Сначала получаем информацию о тесте для получения skillId
  const { 
    data: testInfo, 
    isLoading: isTestLoading 
  } = useGetFullTestQuery(testId);

  const { 
    data: testResult, 
    isLoading: isResultLoading, 
    error 
  } = useGetUserTestResultQuery(
    { skillId: testInfo?.skillId || '', userId: user?.id || '' },
    { skip: !user?.id || !testInfo?.skillId }
  );

  const isLoading = isTestLoading || isResultLoading;

  if (!user) {
    return (
      <Result
        status="warning"
        title="Необходима авторизация"
        subTitle="Для просмотра результатов необходимо войти в систему"
        extra={[
          <Button type="primary" key="login" onClick={() => navigate('/login')}>
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
        title="Ошибка загрузки результатов"
        subTitle="Не удалось загрузить результаты тестирования"
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            На главную
          </Button>
        ]}
      />
    );
  }

  const isPassed = testResult.score >= testResult.needScore;
  const successRate = Math.round((testResult.score / testResult.questions.length) * 100);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Result
        status={isPassed ? 'success' : 'error'}
        icon={isPassed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        title={isPassed ? 'Тест пройден успешно!' : 'Тест не пройден'}
        subTitle={`Вы набрали ${testResult.score} из ${testResult.needScore} необходимых баллов`}
      />

      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Правильных ответов"
              value={testResult.score}
              suffix={`/ ${testResult.questions.length}`}
              valueStyle={{ color: isPassed ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Процент успеха"
              value={successRate}
              suffix="%"
              valueStyle={{ color: isPassed ? '#3f8600' : '#cf1322' }}
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
          const isQuestionCorrect = userAnswers.length === correctAnswers.length && 
                                  userAnswers.every(ua => ua.isTrue);

          return (
            <div key={question.questionId} style={{ marginBottom: 24, padding: 16, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0, marginRight: 8 }}>
                  Вопрос {index + 1}
                </Title>
                {isQuestionCorrect ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                )}
              </div>
              
              <Text style={{ marginBottom: 12, display: 'block' }}>
                {question.questionText}
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
                        ? '#f6ffed' 
                        : answer.isPicked 
                          ? '#fff2e8' 
                          : '#fafafa',
                      border: answer.isTrue 
                        ? '1px solid #b7eb8f' 
                        : answer.isPicked 
                          ? '1px solid #ffbb96' 
                          : '1px solid #d9d9d9'
                    }}
                  >
                    <Text
                      style={{
                        color: answer.isTrue 
                          ? '#52c41a' 
                          : answer.isPicked 
                            ? '#fa8c16' 
                            : undefined
                      }}
                    >
                      {answer.answerText}
                      {answer.isTrue && ' ✓ (правильный ответ)'}
                      {answer.isPicked && !answer.isTrue && ' ✗ (ваш ответ)'}
                      {answer.isPicked && answer.isTrue && ' ✓ (ваш правильный ответ)'}
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
        <Button type="primary" size="large" onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    </div>
  );
};

export default TestResultPage;
