import { Box, TableCell } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from '@mui/styles';
import { IProjectListItem } from '../../api';
import { format } from 'date-fns';
import { RouterLink } from '@tes/router';

interface IProps {
  item: IProjectListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function ProjectCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  return (
    <>
      <TableCell>
        <RouterLink
          name={'projectOverview'}
          params={{ id: item.id }}
          className={classes.link}
        >
          {item.title}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'projectOverview'}
          params={{ id: item.id }}
          className={classes.link}
        >
          <Box
            component="span"
            sx={{
              '&::before': {
                content: '"#"',
                mr: 0.5,
                userSelect: 'none',
              },
            }}
          >
            {item.jobNumber}
          </Box>
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'projectOverview'}
          params={{ id: item.id }}
          className={classes.link}
        >
          {item.client.title}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'projectOverview'}
          params={{ id: item.id }}
          className={classes.link}
        >
          {format(new Date(item.updatedAt), 'MMM dd, y')}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'projectUpdate'}
          params={{ id: item.id }}
          className={classes.link}
        >
          <EditIcon />
        </RouterLink>
      </TableCell>
    </>
  );
}
