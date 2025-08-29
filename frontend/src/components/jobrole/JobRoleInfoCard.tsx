import React from 'react';
import {Card, Skeleton, Typography, Flex} from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { EditOutlined } from '@ant-design/icons';
import type { JobRoleDTO } from '@/types/api/jobrole';

const { Title } = Typography;

interface JobRoleInfoCardProps {
  jobRole?: JobRoleDTO;
  loading: boolean;
  onEdit: () => void;
}

const JobRoleInfoCard: React.FC<JobRoleInfoCardProps> = ({
  jobRole,
  loading,
  onEdit
}) => (
	<div>
		<Title level={3} style={{ marginTop: 0 }}>
			Должность
		</Title>
		{loading || !jobRole ? (
			<Skeleton active />
		) : (
			<Card>
				<Flex
					justify="space-between"
					align="start"
					gap={16}
					style={{ width: '100%' }}
				>
					<Title
						level={3}
						style={{ margin: 0 }}
					>
						{jobRole.title}
					</Title>
					<PermissionButton
						type="primary"
						icon={<EditOutlined />}
						onClick={onEdit}
						disabled={loading || !jobRole}
					>
						Редактировать
					</PermissionButton>
				</Flex>
			</Card>
		)}
	</div>
);

export default JobRoleInfoCard;
