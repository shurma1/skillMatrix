import React from 'react';
import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import { useAppSelector } from '@/hooks/storeHooks';
import { Permissions } from '@/constants/permissions';

interface PermissionButtonProps extends ButtonProps {
  requiredPermission?: Permissions | string;
  noTooltip?: boolean;
  tooltipText?: string;
}

// Permission-aware Button: disables and shows tooltip if user lacks permission (default EDIT_ALL)
const PermissionButton: React.FC<PermissionButtonProps> = ({
  requiredPermission = Permissions.EDIT_ALL,
  noTooltip,
  tooltipText = 'Недостаточно прав',
  disabled: disabledProp,
  children,
  ...rest
}) => {
  const permissions = useAppSelector(s => s.auth.permissions);
  const names = React.useMemo(() => new Set(permissions.map(p => p.name)), [permissions]);
  const hasPerm = names.has(String(requiredPermission));

  const disabled = Boolean(disabledProp) || !hasPerm;

  const button = (
    <Button disabled={disabled} {...rest}>
      {children}
    </Button>
  );

  if (noTooltip || hasPerm) return button;

  // Tooltip doesn't work directly on disabled button; wrap in span
  return (
    <Tooltip title={tooltipText}>
      <span style={{ display: 'inline-flex' }}>{button}</span>
    </Tooltip>
  );
};

export default PermissionButton;
