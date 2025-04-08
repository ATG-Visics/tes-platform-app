import React, { useMemo } from 'react';
import { Box, Button, Card, CardHeader, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as colors from '@tes/ui/colors';
import { Add as AddIcon } from '@mui/icons-material';
import { H1, SearchField } from '@tes/ui/core';

interface IProps<T> {
  title: string;
  labelForAddNewButton: string;
  items: T[];
  itemProps: {
    onItemClick: (item: T) => void;
  };
  renderListItem?: (item: T, props: IProps<T>['itemProps']) => React.ReactNode;
}

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    gap: spacing(2),
  },
  title: {
    marginTop: spacing(2),
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap',
    border: 'none',
  },
  cardActionArea: {
    '&:hover, &:focus': {
      backgroundColor: colors.accent1['50'],
    },
  },
  cardTitle: {
    fontWeight: 700,
    color: colors.accent1['500'],
  },
}));

function handleEvents() {
  // eslint-disable-next-line no-console
  console.log('event handled');
}

function defaultListItemRenderer<T extends { id: string }>(
  item: T,
  props: IProps<T>['itemProps'],
) {
  return (
    <Card onClick={() => props?.onItemClick(item)}>
      <CardHeader title={item.id} />
    </Card>
  );
}

// @FIXME add separate handlers for onSearchChange and onClick for the search button
export function ResponsiveCrudList<T extends { id: string }>(props: IProps<T>) {
  const classes = useStyles();
  const {
    title,
    items,
    itemProps,
    labelForAddNewButton,
    renderListItem = defaultListItemRenderer,
  } = props;

  const renderedItems = useMemo(
    () => items.map((item) => renderListItem(item, itemProps)),
    [items, renderListItem, itemProps],
  );

  return (
    <>
      <Container className={classes.root}>
        <H1 variant="h5" strong className={classes.title}>
          {title}
        </H1>
        <SearchField
          placeholder="Zoek"
          searchValue=""
          onSearchChange={handleEvents}
        />

        <Button
          color="primary"
          variant="contained"
          onClick={handleEvents}
          startIcon={<AddIcon />}
        >
          {labelForAddNewButton}
        </Button>
      </Container>

      <Box mt={3} />

      <Container className={classes.root}>{renderedItems}</Container>
    </>
  );
}
