import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Button,
  Radio,
  Typography,
  Progress,
  Modal,
  Space,
  message,
  Spin
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type { TestDTO } from '@/types/api/test';

const { Title, Text } = Typography;

interface TestTakeProps {
  test: TestDTO;
  sessionId: string;
  onSubmitAnswer: (questionId: string, answerId: string) => void;
  onEndTest: () => void;
  loading?: boolean;
}

// Hook для предотвращения копирования и переключения вкладок
const useTestSecurityHooks = (onViolation: () => void) => {
  const [violations, setViolations] = useState(0);
  const maxViolations = 3;

  // Предотвращение копирования
  const preventCopy = useCallback((e: Event) => {
    e.preventDefault();
    setViolations(prev => prev + 1);
    message.warning('Копирование запрещено во время тестирования');
  }, []);

  const preventContextMenu = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  const preventKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    // Запрещаем Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+S, F12, Ctrl+Shift+I
    if (
      (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 's')) ||
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I')
    ) {
      e.preventDefault();
      setViolations(prev => prev + 1);
      message.warning('Данное действие запрещено во время тестирования');
    }
  }, []);

  // Обнаружение потери фокуса (переключение вкладок)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setViolations(prev => prev + 1);
      message.error('Обнаружена смена вкладки. Тест завершен.');
      // Завершаем тест при смене вкладки
      setTimeout(() => onViolation(), 100);
    }
  }, [onViolation]);

  useEffect(() => {
    // Добавляем обработчики событий
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyboardShortcuts);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Отключаем выделение текста через CSS
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Возвращаем возможность выделения текста
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [preventCopy, preventContextMenu, preventKeyboardShortcuts, handleVisibilityChange]);

  return { violations, maxViolations };
};

// Hook для таймера
const useTestTimer = (initialTime: number, onTimeUp: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((initialTime - timeLeft) / initialTime) * 100;

  return { timeLeft, formatTime: formatTime(timeLeft), progressPercent };
};

const TestTakeUI: React.FC<TestTakeProps> = ({
  test,
  onSubmitAnswer,
  onEndTest,
  loading = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  // Используем хук для модального окна
  const [modal, contextHolder] = Modal.useModal();

  const handleEndTest = () => {
    if (submitted) {
      return;
    }
	
    setSubmitted(true);
    onEndTest();
  };

  const { violations, maxViolations } = useTestSecurityHooks(handleEndTest);
  
  const { timeLeft, formatTime, progressPercent } = useTestTimer(
    test.timeLimit,
    () => {
      message.error('Время истекло! Тест завершен.');
      handleEndTest();
    }
  );

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  // Исправляем прогресс бар: показываем прогресс только после ответа на вопрос
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const progress = (answeredQuestions / test.questions.length) * 100;

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    onSubmitAnswer(questionId, answerId);
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const showEndTestConfirmation = () => {
    modal.confirm({
      title: 'Завершить тест?',
      icon: <ExclamationCircleOutlined />,
      content: 'Вы уверены, что хотите завершить тест? Это действие нельзя отменить.',
      okText: 'Да, завершить',
      cancelText: 'Отмена',
      onOk: () => {
        handleEndTest();
      },
    });
  };

  // Предупреждение о нарушениях
  useEffect(() => {
    if (violations >= maxViolations) {
      modal.error({
        title: 'Тест завершен',
        content: 'Превышено количество нарушений правил тестирования. Тест автоматически завершен.',
        onOk: handleEndTest,
      });
    }
  }, [violations, maxViolations, modal]);

  if (loading) {
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

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      {contextHolder}
      {/* Заголовок и таймер */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Тест
            </Title>
            <Text type="secondary">
              Вопрос {currentQuestionIndex + 1} из {test.questions.length}
            </Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {formatTime}
            </div>
            <Progress
              percent={progressPercent}
              size="small"
              status={timeLeft < 300 ? 'exception' : 'normal'}
              showInfo={false}
            />
          </div>
        </div>
        
        {violations > 0 && (
          <div style={{
            marginTop: 16,
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid var(--ant-color-warning-border)',
            backgroundColor: 'var(--ant-color-warning-bg)'
          }}>
            <Text type="warning">
              Предупреждений: {violations}/{maxViolations}
            </Text>
          </div>
        )}
      </Card>

      {/* Прогресс теста */}
      <Progress
        percent={progress}
        style={{ marginBottom: 24 }}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />

      {/* Текущий вопрос */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 24 }}>
          {currentQuestion.text}
        </Title>

        <Radio.Group
          value={selectedAnswers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswerSelect(
            currentQuestion.id,
            e.target.value
          )}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {currentQuestion.answerVariants.map((answer) => (
              <Radio
                key={answer.id}
                value={answer.id}
                style={{
                  padding: '12px',
                  border: '1px solid var(--ant-color-border)',
                  borderRadius: 4,
                  marginBottom: 8,
                  width: '100%'
                }}
              >
                {answer.text}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>

      {/* Навигация */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Предыдущий вопрос
        </Button>

        <Space>
          <Button danger onClick={showEndTestConfirmation}>
            Завершить тест
          </Button>
          
          {isLastQuestion ? (
            <Button
              type="primary"
              onClick={showEndTestConfirmation}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              Завершить тест
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[currentQuestion.id]}
            >
              Следующий вопрос
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};

export default TestTakeUI;
