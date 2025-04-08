import { makeStyles } from '@mui/styles';
import MuiPagination, {
  PaginationRenderItemParams,
  PaginationProps as MuiPaginationProps,
} from '@mui/lab/Pagination';
import PaginationItem from '@mui/lab/PaginationItem';
import { useCallback } from 'react';
import clsx from 'clsx';

import { IconButton } from '../IconButton';
import { Icon } from '../Icon';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends MuiPaginationProps {}

export type PaginationProps = IProps;

const useStyles = makeStyles(({ spacing }) => ({
  root: {},
  previous: {
    marginRight: spacing(1),
  },
  next: {
    marginLeft: spacing(1),
  },
}));

const iconMap: { previous: string; next: string } = {
  previous: 'arrow-left',
  next: 'arrow-right',
};

export function Pagination(props: PaginationProps) {
  const classes = useStyles();

  const renderItem = useCallback(
    (item: PaginationRenderItemParams) => {
      if (item.type === 'previous' || item.type === 'next') {
        const { color, variant, type, ...rest } = item;
        const icon = iconMap[type];

        return (
          <IconButton
            color="primary"
            variant="contained"
            {...rest}
            className={clsx(classes.root, classes[type])}
            icon={<Icon icon={icon} />}
          />
        );
      }

      return <PaginationItem {...item} />;
    },
    [classes],
  );

  return <MuiPagination {...props} renderItem={renderItem} />;
}
