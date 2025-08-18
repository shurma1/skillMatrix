import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetTestResultQuery } from '@/store/endpoints';
import type { RootState } from '@/store/store';
import TestResultView from '../test/TestResultView';

const TestResultContainer: React.FC = () => {
  const { testId = '' } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  // Получаем пользователя из Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // Получаем результат теста по testId (новый эндпоинт /api/test/:testId/result)
  const {
    data: testResult,
    isLoading,
    error,
  } = useGetTestResultQuery(
    testId,
    { skip: !testId }
  );

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateLogin = () => {
    navigate('/login');
  };

  return (
    <TestResultView
      user={user}
      testResult={testResult}
      isLoading={isLoading}
      error={error}
      onNavigateHome={handleNavigateHome}
      onNavigateLogin={handleNavigateLogin}
    />
  );
};

export default TestResultContainer;
