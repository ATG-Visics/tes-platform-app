import { Box, Card, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

interface IProps {
  title: string;
  emptyMessage: string;
  showEditButton: boolean;
  editButtonText?: string;
  onClickEdit?: () => void;
  item: { [index: string]: string | ReactNode } | undefined;
}

export function ProjectInfoList(props: IProps) {
  const {
    title,
    emptyMessage,
    editButtonText,
    item,
    showEditButton,
    onClickEdit,
  } = props;
  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <Box
        component={'div'}
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h6'} sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {showEditButton && (
          <Button onClick={onClickEdit}>{editButtonText}</Button>
        )}
      </Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {item ? (
            <>
              <Typography variant={'subtitle2'} sx={{ fontWeight: 700, mb: 1 }}>
                {item['title']}
              </Typography>
              <Typography
                variant={'body2'}
                sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
              >
                {item['secondaryInfo1']}
              </Typography>
              <Typography
                variant={'body2'}
                sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
              >
                {item['secondaryInfo2']}
              </Typography>
              <Typography
                variant={'body2'}
                sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
              >
                {item['secondaryInfo3']}
              </Typography>
              <Typography
                variant={'body2'}
                sx={{ color: 'rgb(0 0 0 / 60%)', lineHeight: 1.5 }}
              >
                {item['secondaryInfo4']}
              </Typography>
            </>
          ) : (
            <Typography variant={'subtitle2'} sx={{ fontWeight: 700, mb: 1 }}>
              {emptyMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );
}
