import { Badge, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAnswerCountQuery } from '@tes/prompted-questions';
import { memo, useMemo } from 'react';
import { RouterNavLink } from '@tes/router';
import { Dayjs } from 'dayjs';

interface IProps {
  selectedDate: Dayjs;
}

export function ProjectDashboardTabsBase({ selectedDate }: IProps) {
  const { id: projectId } = useParams();

  const { data } = useGetAnswerCountQuery(
    { project: projectId || '', startDate: selectedDate.format('YYYY-MM-DD') },
    {
      skip: !projectId,
    },
  );

  // TODO: get from router
  const dashboardLinks = useMemo(
    () => [
      { name: 'projectOverview', title: 'Project Dashboard' },
      { name: 'surveyDashboard', title: 'Survey Dashboard' },
      { name: 'locationInfo', title: 'Location Info' },
      { name: 'projectInfo', title: 'Project Info' },
      {
        name: 'questions',
        title: 'Questions',
        badgeCount: data ? data.count : 0,
      },
    ],
    [data],
  );

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        overflowX: 'auto',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      {dashboardLinks.map((link) => (
        <RouterNavLink
          key={`navlink-${link.name}`}
          name={link.name}
          params={{ id: projectId || '' }}
          style={({ isActive }) => ({
            padding: '24px 12px',
            textDecoration: 'none',
            color: isActive ? '#fff' : 'rgb(255 255 255 / 54%)',
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '500',
            borderBottom: isActive ? '2px solid #fff' : '3px solid transparent',
            transition: 'color 0.3s ease, border-bottom 0.3s ease',
            textTransform: 'uppercase',
          })}
          end
        >
          {link.title}

          <Badge
            sx={{ position: 'absolute', right: 18, top: 16 }}
            badgeContent={link.badgeCount}
            color="error"
          />
        </RouterNavLink>
      ))}
    </Box>
  );
}

export const ProjectDashboardTabs = memo(ProjectDashboardTabsBase);
