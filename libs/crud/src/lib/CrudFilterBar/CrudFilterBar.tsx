import { ReactChild } from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

interface IProps {
  title: string;
  children: ReactChild | ReactChild[];
}

export function CrudFilterBar(props: IProps) {
  const { title, children } = props;

  return (
    <Paper sx={{ width: '100%', minHeight: '100%' }}>
      <List disablePadding>
        <ListItem>
          <ListItemText
            primary={
              <Typography fontWeight="bold" variant="subtitle1">
                {title}
              </Typography>
            }
          />
        </ListItem>
      </List>
      {children}
    </Paper>
  );
}
