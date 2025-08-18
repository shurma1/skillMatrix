import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTestResultQuery } from '@/store/endpoints';
import TestResultViewUI from './TestResultViewUI';

const TestResultViewContainer: React.FC = () => {
  const { testId = '' } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  const { 
    data: testResult, 
    isLoading, 
    error 
  } = useGetTestResultQuery(testId, { skip: !testId });

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    <TestResultViewUI
      testResult={testResult}
      isLoading={isLoading}
      error={error}
      onNavigateHome={handleNavigateHome}
    />
  );
};

export default TestResultViewContainer;
