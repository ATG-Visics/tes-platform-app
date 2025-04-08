import { Box, Card, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';
import * as colors from '@tes/ui/colors';

interface IProps {
  title: string;
  emptyMessage: string;
  showEditButton: boolean;
  editButtonText?: string;
  onClickEdit?: () => void;
  item: { [index: string]: string | ReactNode } | undefined;
}

export type ProjectInfoListProps = IProps;

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
    <Card sx={{ p: 2, width: '100%', height: '100%' }}>
      <Box
        sx={{
          mb: 1,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          minHeight: '36.5px',
        }}
      >
        <Typography
          variant={'h6'}
          sx={{ flexGrow: 1, color: colors.accent1['700'] }}
        >
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
