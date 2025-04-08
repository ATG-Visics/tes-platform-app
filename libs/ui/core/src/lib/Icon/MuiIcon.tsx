import React from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';

import {
  Construction as ConstructionIcon,
  Dashboard as DashboardIcon,
  DynamicForm as DynamicFormIcon,
  Mediation as MediationIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
  SpeakerGroup as SpeakerGroupIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

const iconMapping: Record<string, React.ComponentType<SvgIconProps>> = {
  dashboard: DashboardIcon,
  person: PersonIcon,
  work: WorkIcon,
  science: ScienceIcon,
  dynamicForm: DynamicFormIcon,
  construction: ConstructionIcon,
  speakerGroup: SpeakerGroupIcon,
  mediation: MediationIcon,
};

interface IProps {
  icon: string;
  size?: number;
  color?: string;
}

export function MuiIcon({ icon, size = 24, color = 'inherit' }: IProps) {
  const IconComponent = iconMapping[icon];

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in icon mapping.`);
    return null;
  }

  return <IconComponent style={{ fontSize: size, color }} />;
}
