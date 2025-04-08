import {
  Box,
  Card,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { ComponentType } from 'react';

interface IProps<T> {
  title: string;
  emptyMessage: string;
  buttonText: string;
  isClient?: boolean;
  itemList: Array<T>;
  onNewItemClick: () => void;
  onItemClick: (id: string | number) => void;
  itemCount: number;
  ListItemComponent: ComponentType<{
    item: T;
    onItemClick: (id: string | number) => void;
  }>;
}

export type FullWidthListCardProps<T> = IProps<T>;

export function FullWidthListCard<T extends { id: string | number }>(
  props: IProps<T>,
) {
  const {
    title,
    isClient,
    emptyMessage,
    buttonText,
    itemList,
    onNewItemClick,
    itemCount,
    ListItemComponent,
    onItemClick,
  } = props;

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h6'} sx={{ flexGrow: 1, fontWeight: 700 }}>
          {title}
        </Typography>
        {!isClient && itemCount >= 0 && (
          <Button variant="contained" onClick={onNewItemClick}>
            {buttonText}
          </Button>
        )}
      </Box>
      <Divider />
      <Box>
        <List>
          {itemCount > 0 ? (
            itemList.map((item) => (
              <ListItemComponent
                key={item.id}
                item={item}
                onItemClick={onItemClick}
              />
            ))
          ) : (
            <ListItem sx={{ paddingLeft: 0 }}>
              <ListItemText
                sx={{
                  color: 'rgb(0, 0, 0, 50%)',
                }}
                primary={emptyMessage}
              />
            </ListItem>
          )}
        </List>

        {!isClient && itemCount >= 10 && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onNewItemClick}>{buttonText}</Button>
          </Box>
        )}
      </Box>
    </Card>
  );
}
