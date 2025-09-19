import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetTestResultQuery, useGetCanDeleteTestQuery, useDeleteUserTestResultMutation, useGetUserTestResultByUserQuery } from '@/store/endpoints';
import { message } from 'antd';
import TestResultViewUI from './TestResultViewUI';

const TestResultViewContainer: React.FC = () => {
  const { testId = '' } = useParams<{ testId: string }>();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get('userId') || undefined;
  const navigate = useNavigate();
  
  // If userId is provided, fetch that user's result; otherwise fetch current user's result
  const { data: ownResult, isLoading: isLoadingOwn, error: errorOwn } = useGetTestResultQuery(testId, { skip: !testId || !!userIdParam });
  const { data: userResult, isLoading: isLoadingUser, error: errorUser } = useGetUserTestResultByUserQuery(
    { testId, userId: userIdParam as string },
    { skip: !testId || !userIdParam }
  );
  const testResult = userResult || ownResult;
  const isLoading = Boolean(isLoadingOwn || isLoadingUser);
  const error = errorUser || errorOwn;

  const { data: canDeleteResp } = useGetCanDeleteTestQuery(testId, { skip: !testId });
  const [deleteUserTestResult, { isLoading: isDeleting }] = useDeleteUserTestResultMutation();
  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleDelete = async () => {
    if (!testId) return;
    const uid = testResult?.userId ? String(testResult.userId) : userIdParam;
    if (!uid) return;
    try {
      await deleteUserTestResult({ testId, userId: uid }).unwrap();
      message.success('Результат удалён');
      navigate('/');
    } catch {
      message.error('Не удалось удалить результат');
    }
  };

  return (
    <TestResultViewUI
      testResult={testResult}
      isLoading={isLoading}
      error={error}
      onNavigateHome={handleNavigateHome}
  	  canDelete={Boolean(canDeleteResp?.can)}
      onDelete={handleDelete}
      deleting={isDeleting}
    />
  );
};

export default TestResultViewContainer;
