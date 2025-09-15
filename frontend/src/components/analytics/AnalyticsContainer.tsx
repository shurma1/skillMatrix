import React, { useCallback, useState, Suspense } from 'react';
import { Tabs, Spin } from 'antd';
import { useGetAnalyticsKPIQuery, useGetAnalyticsJobRolesToSkillsQuery, useGetAnalyticsJobRoleToSkillsQuery } from '@/store/endpoints';
import AnalyticsCard from './AnalyticsCard';
import JobRolesToSkillsCard from './JobRolesToSkillsCard';
import { JobRoleToSkillsDetailsCardAsync } from './JobRoleToSkillsDetailsCard.async';

const AnalyticsContainer: React.FC = () => {
	// Active tab state
	const [activeKey, setActiveKey] = useState('kpi');
	// Whether the second tab was ever opened (to trigger first fetch lazily, but keep data afterwards)
	const [jobRolesRequested, setJobRolesRequested] = useState(false);
	// Whether the third tab was ever opened
	const [jobRoleDetailsRequested, setJobRoleDetailsRequested] = useState(false);
	// Selected job role for details tab
	const [selectedJobRoleId, setSelectedJobRoleId] = useState<string>();

	const handleChange = useCallback((key: string) => {
		setActiveKey(key);
		if (key === 'jobroles-skills' && !jobRolesRequested) {
			setJobRolesRequested(true);
		}
		if (key === 'jobrole-details' && !jobRoleDetailsRequested) {
			setJobRoleDetailsRequested(true);
		}
	}, [jobRolesRequested, jobRoleDetailsRequested]);

	const handleJobRoleChange = useCallback((jobRoleId: string) => {
		setSelectedJobRoleId(jobRoleId);
	}, []);

	// KPI is default, load immediately. (If you also want to lazy load KPI, add similar flag logic.)
	const kpiQuery = useGetAnalyticsKPIQuery(undefined, { skip: activeKey !== 'kpi' });

	// JobRolesToSkills loads only after user opens the tab first time. After that, stays subscribed.
	const jobRolesToSkills = useGetAnalyticsJobRolesToSkillsQuery(undefined, { skip: !jobRolesRequested });

	// JobRoleToSkills details loads only when both tab is opened and job role is selected
	const jobRoleToSkillsDetails = useGetAnalyticsJobRoleToSkillsQuery(
		{ jobRoleId: selectedJobRoleId! },
		{ skip: !jobRoleDetailsRequested || !selectedJobRoleId }
	);

	return (
		<Tabs
			activeKey={activeKey}
			onChange={handleChange}
			destroyInactiveTabPane={false}
			items={[
				{
					key: 'kpi',
					label: 'KPI',
					children: (
						<AnalyticsCard
							data={kpiQuery.data}
							isFetching={kpiQuery.isFetching || kpiQuery.isLoading}
							error={kpiQuery.error}
						/>
					),
				},
				{
					key: 'jobroles-skills',
					label: 'Роли ↔ Навыки',
					children: (
						<JobRolesToSkillsCard
							data={jobRolesToSkills.data}
							isFetching={jobRolesToSkills.isFetching || jobRolesToSkills.isLoading}
							error={jobRolesToSkills.error}
						/>
					),
				},
				{
					key: 'jobrole-details',
					label: 'Детализация по должности',
					children: (
						<Suspense fallback={<div style={{ textAlign: 'center', padding: '50px 0' }}><Spin size="large" /></div>}>
							<JobRoleToSkillsDetailsCardAsync
								data={jobRoleToSkillsDetails.data}
								isFetching={jobRoleToSkillsDetails.isFetching || jobRoleToSkillsDetails.isLoading}
								error={jobRoleToSkillsDetails.error as any}
								selectedJobRoleId={selectedJobRoleId}
								onJobRoleChange={handleJobRoleChange}
							/>
						</Suspense>
					),
				},
			]}
		/>
	);
};

export default AnalyticsContainer;
