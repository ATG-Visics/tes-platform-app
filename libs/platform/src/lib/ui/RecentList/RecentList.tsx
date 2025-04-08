import {
  Avatar,
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Button } from '@tes/ui/core';

interface IProps {
  type: string;
  recentList: Array<{
    id: string;
    title: string;
    subtitle: string;
    logoUrl: string;
  }>;
}

export type RecentListProps = IProps;

export function RecentList(props: IProps) {
  const { type, recentList } = props;

  return (
    <Card sx={{ p: 2 }}>
      <Box
        component={'div'}
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h6'} sx={{ flexGrow: 1 }}>
          Recent {type}
        </Typography>
        {recentList.length > 0 && <Button>Show all {type}</Button>}
      </Box>
      <Box component={'div'}>
        <List>
          {recentList.length > 0 ? (
            recentList.map((recentItem) => (
              <ListItem
                key={recentItem.id}
                secondaryAction={
                  <IconButton aria-label="comment">
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar sx={{ width: 60, height: 40 }}>
                  <Avatar
                    alt="logo"
                    src={recentItem.logoUrl}
                    variant="square"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={recentItem.title}
                  secondary={recentItem.subtitle}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No items to show" />
            </ListItem>
          )}
        </List>
      </Box>
    </Card>
  );
}
