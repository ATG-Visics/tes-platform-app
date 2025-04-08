import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import { ProjectInfoList, ProjectInfoListProps } from '../ui';
import { ReactNode } from 'react';
import { format } from 'date-fns';
import { Link, Box } from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends ProjectInfoListProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Project / Project header',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const projectItem: { [index: string]: string | ReactNode } = {
  id: '1',
  title: 'Project information',
  secondaryInfo1: `IH 1603-21413`,
  secondaryInfo2: `Start: ${format(new Date('01-21-2023'), 'MMMM d, y')}`,
  secondaryInfo3: `End: ${format(new Date('03-26-23'), 'MMMM d, y')}`,
};

const clientInfo: { [index: string]: string | ReactNode } = {
  id: 1,
  title: 'Contact information',
  secondaryInfo1: 'Remco Coenen',
  secondaryInfo2: (
    <Link
      href={'mailto:info@accesstechnology.nl'}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        mt: 1,
        '&:hover, &:focus': {
          textDecoration: 'underline',
        },
      }}
    >
      <EmailIcon sx={{ fontSize: '1rem' }} />
      <Box
        component={'span'}
        sx={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          lineHeight: 1.5,
        }}
      >
        info@accesstechnology.nl
      </Box>
    </Link>
  ),
  secondaryInfo3: (
    <Link
      href={'tel:+31 56 12345678'}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        mt: 1,
        '&:hover, &:focus': {
          textDecoration: 'underline',
        },
      }}
    >
      <PhoneIcon sx={{ fontSize: '1rem' }} />
      <Box
        component={'span'}
        sx={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          lineHeight: 1.5,
        }}
      >
        +31 56 12345678
      </Box>
    </Link>
  ),
};

const ProjectInfoListTemplate: Story<IProps> = (args) => {
  return <ProjectInfoList {...args} />;
};

export const ProjectInfo = ProjectInfoListTemplate.bind({});

ProjectInfo.args = {
  title: 'Project 2021 Industrial Hygiene Monitoring',
  emptyMessage: 'No project information found',
  showEditButton: true,
  editButtonText: 'Edit',
  item: projectItem,
};

export const ContactInfo = ProjectInfoListTemplate.bind({});

ContactInfo.args = {
  title: 'Client Access Technology Group',
  emptyMessage: 'No project information found',
  showEditButton: true,
  editButtonText: 'Edit',
  item: clientInfo,
};
