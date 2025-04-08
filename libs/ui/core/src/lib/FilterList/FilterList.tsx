import { Box, Button, FormControl, FormGroup, FormLabel } from '@mui/material';
import React, { useMemo, useState } from 'react';
import {
  KeyboardArrowDown as DownIcon,
  KeyboardArrowUp as UpIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

import { FilterItem } from '../FilterItem';
import { Text } from '../Typography';

interface IProps {
  title: React.ReactNode;
  itemList: Array<{ id: number | string; title: string }>;
  itemsSelected: Record<string | number, boolean>;
  onToggleSelect: (id: string | number) => void;
  truncated?: boolean;
}

export type FilterListProps = IProps;

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  fieldset: {
    padding: spacing(0, 2),

    [breakpoints.up('lg')]: {
      padding: spacing(0, 2),
    },
  },
  legend: {
    marginBottom: spacing(2),
  },
  truncateButton: {
    width: 'fit-content',
  },
}));

export function FilterList(props: IProps) {
  const {
    title,
    itemList,
    itemsSelected,
    truncated = true,
    onToggleSelect,
  } = props;
  const [isTruncated, setTruncated] = useState(truncated);
  const classes = useStyles();

  const canTrucate = useMemo(() => {
    return itemList.length > 13;
  }, [itemList]);

  const maybeTruncatedList = useMemo(() => {
    if (canTrucate && isTruncated) {
      return itemList.slice(0, 12);
    }

    return itemList;
  }, [itemList, canTrucate, isTruncated]);

  const children = (
    <FormGroup>
      {maybeTruncatedList.map(({ id, title: itemTitle }) => (
        <FilterItem
          key={id}
          filterId={id}
          filterTitle={itemTitle}
          isSelected={itemsSelected[id] === true}
          onToggleSelect={onToggleSelect}
        />
      ))}

      {canTrucate && (
        <>
          <Box aria-hidden="true" mt={1} />
          <Button
            className={classes.truncateButton}
            startIcon={isTruncated ? <DownIcon /> : <UpIcon />}
            color="primary"
            onClick={() => setTruncated((current) => !current)}
          >
            {isTruncated ? 'Toon meer' : 'Toon minder'}
          </Button>
        </>
      )}
    </FormGroup>
  );

  return (
    <FormControl component="fieldset" className={classes.fieldset}>
      {title ? (
        typeof title === 'string' ? (
          <FormLabel component="legend" className={classes.legend}>
            <Text
              textTransform="uppercase"
              color="text.secondary"
              variant="subtitle1"
              component="div"
            >
              {title}
            </Text>
          </FormLabel>
        ) : (
          title
        )
      ) : null}
      {children}
    </FormControl>
  );
}
