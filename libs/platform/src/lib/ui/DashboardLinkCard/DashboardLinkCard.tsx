import { ReactNode } from 'react';
import { Box, Card, CardActionArea, Typography } from '@mui/material';

interface IProps {
  icon: ReactNode;
  counter: number;
  title: string;
  url: string;
}

export type DashboardLinkCardProps = IProps;

export function DashboardLinkCard(props: IProps) {
  const { icon, counter, title, url } = props;
  return (
    <Card
      sx={{
        width: 'calc(50% - 8px)',
      }}
    >
      <CardActionArea
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          aspectRatio: '1/1',
          textDecoration: 'none',
        }}
        href={url}
      >
        <Box component={'div'} sx={{ marginBottom: 2 }}>
          {icon}
        </Box>
        <Box component={'div'}>
          <Typography variant="h5" color={'primary'}>
            {counter}
          </Typography>
        </Box>
        <Box component={'div'}>
          <Typography variant="caption" color={'primary'}>
            {title}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}
