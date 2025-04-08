import {
  Avatar,
  Box,
  Card,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { Button } from '@tes/ui/core';
import {
  MoreVert as MoreVertIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

interface IProps {
  title: string;
  buttonText: string;
  onClickCreate: () => void;
  emptyMessage: string;
  itemList: Array<{
    id: string;
    avatarUrl?: string;
    titlePrimary: string;
    titleSecondary: string;
    subtitlePrimary?: string;
    subtitleSecondary?: string;
  }>;
}

export type SurveyDashboardListCardProps = IProps;

export function SurveyDashboardListCard(props: IProps) {
  const { title, buttonText, emptyMessage, itemList, onClickCreate } = props;

  return (
    <Card sx={{ p: 2, height: 'auto', width: '100%' }}>
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
        <Button>
          <FullscreenIcon />
        </Button>
      </Box>
      <Box component={'div'}>
        <List>
          {itemList.length > 0 ? (
            itemList.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton aria-label="comment">
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                {item.avatarUrl && (
                  <ListItemAvatar sx={{ width: 40, height: 40 }}>
                    <Avatar alt="logo" src={item.avatarUrl} />
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="subtitle2"
                      >
                        {item.titlePrimary}
                      </Typography>
                      <Typography
                        sx={{ display: 'inline', color: 'rgb(0 0 0 / 60%)' }}
                        component="span"
                        variant="caption"
                      >
                        {item.titleSecondary}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline', mr: '0.2rem' }}
                        component="span"
                        variant="caption"
                      >
                        {item.subtitlePrimary || ''}
                      </Typography>
                      <Link sx={{ display: 'inline' }}>
                        {item.subtitleSecondary || ''}
                      </Link>
                    </>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary={emptyMessage} />
            </ListItem>
          )}
        </List>
        <Box
          component={'div'}
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button onClick={onClickCreate}>{buttonText}</Button>
        </Box>
      </Box>
    </Card>
  );
}
