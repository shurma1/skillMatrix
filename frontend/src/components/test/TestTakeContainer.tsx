import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message, Typography, Button, Result } from 'antd';
import { 
  useStartTestMutation,
  useEndTestMutation,
  useSendAnswerMutation 
} from '@/store/endpoints';
import type { RootState } from '@/store/store';
import type { StartTestResponseDTO } from '@/types/api/test';
import TestTakeUI from './TestTakeUI';

const { Title } = Typography;

const TestTakeContainer: React.FC = () => {
  const { testId = '' } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  // Получаем пользователя из Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [testSession, setTestSession] = useState<StartTestResponseDTO | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const [startTest, { isLoading: isStartingTest }] = useStartTestMutation();
  const [endTest] = useEndTestMutation();
  const [sendAnswer] = useSendAnswerMutation();

  // Проверяем, что пользователь авторизован
  if (!user) {
    return (
      <Result
        status="warning"
        title="Необходима авторизация"
        subTitle="Для прохождения теста необходимо войти в систему"
        extra={[
          <Button type="primary" key="login" onClick={() => navigate('/login')}>
            Войти
          </Button>
        ]}
      />
    );
  }

  const handleStartTest = async () => {
    try {
      const response = await startTest({ userId: user.id, testId }).unwrap();
      setTestSession(response);
      setTestStarted(true);
      message.success('Тест начат');
    } catch (error) {
      console.error('Error starting test:', error);
      message.error('Ошибка при запуске теста');
    }
  };

  const handleSubmitAnswer = async (questionId: string, answerId: string) => {
    if (!testSession) return;
    
    try {
      await sendAnswer({
        sessionId: testSession.sessionId,
        questionId,
        answerId
      }).unwrap();
    } catch (error) {
      console.error('Error sending answer:', error);
      message.error('Ошибка при отправке ответа');
    }
  };

  const handleEndTest = async () => {
    console.log('handleEndTest called', { testSession, testCompleted, user });
    
    if (!testSession || testCompleted) {
      console.log('Early return from handleEndTest', { testSession, testCompleted });
      return;
    }

    if (!user?.id) {
      console.error('User ID is missing');
      message.error('Ошибка: не найден ID пользователя');
      return;
    }

    try {
      console.log('Calling endTest API with:', {
        userId: user.id,
        sessionId: testSession.sessionId
      });
      
      const response = await endTest({
        userId: user.id,
        sessionId: testSession.sessionId
      }).unwrap();
      
      console.log('endTest API response:', response);
      
      setTestCompleted(true);
      message.success('Тест завершен');
      
      // Перенаправляем на страницу результатов через некоторое время
      setTimeout(() => {
        navigate(`/test/${testId}/result/view`);
      }, 2000);
    } catch (error) {
      console.error('Error ending test:', error);
      message.error('Ошибка при завершении теста');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Предупреждение при попытке покинуть страницу
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testStarted && !testCompleted) {
        e.preventDefault();
        e.returnValue = 'Вы уверены, что хотите покинуть страницу? Тест будет завершен.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [testStarted, testCompleted]);

  // Завершение теста при размонтировании компонента
  useEffect(() => {
    return () => {
      if (testSession && testStarted && !testCompleted && user) {
        // Async cleanup
        endTest({
          userId: user.id,
          sessionId: testSession.sessionId
        });
      }
    };
  }, [testSession, testStarted, testCompleted, user, endTest]);

  // Показываем результат после завершения теста
  if (testCompleted) {
    return (
      <Result
        status="success"
        title="Тест завершен!"
        subTitle="Ваши ответы отправлены на проверку. Результаты будут доступны после обработки."
        extra={[
          <Button type="primary" key="home" onClick={handleGoHome}>
            На главную
          </Button>
        ]}
      />
    );
  }

  // Показываем начальный экран теста
  if (!testStarted || !testSession) {
    return (
      <div style={{ 
        maxWidth: 600, 
        margin: '0 auto', 
        padding: '48px 24px',
        textAlign: 'center' 
      }}>
        <Title level={2}>Готовы начать тест?</Title>
        
        <div style={{ 
          padding: '24px', 
          borderRadius: '8px', 
          marginBottom: '32px',
          textAlign: 'left',
          border: '1px solid',
          borderColor: 'var(--ant-color-border)'
        }}>
          <Title level={4}>Правила прохождения теста:</Title>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Не покидайте страницу во время тестирования</li>
            <li>Запрещено копирование и использование внешних материалов</li>
            <li>Время ограничено - следите за таймером</li>
            <li>Каждое нарушение фиксируется системой</li>
            <li>При превышении лимита нарушений тест будет автоматически завершен</li>
          </ul>
        </div>

        <Button 
          type="primary" 
          size="large"
          loading={isStartingTest}
          onClick={handleStartTest}
        >
          Начать тест
        </Button>
      </div>
    );
  }

  // Показываем интерфейс прохождения теста
  return (
    <TestTakeUI
      test={testSession.test}
      sessionId={testSession.sessionId}
      onSubmitAnswer={handleSubmitAnswer}
      onEndTest={handleEndTest}
    />
  );
};

export default TestTakeContainer;
