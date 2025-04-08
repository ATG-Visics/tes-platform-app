import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Hidden,
  TableCell,
  Typography,
} from '@mui/material';
import { CrudListPageToolbar, CrudTable } from '@tes/crud';
import { useFetchAllJobTitles } from '../hooks';
import { useCallback } from 'react';

export function SelectJobTitleControl(props: ControlProps) {
  const { data, handleChange, visible } = props;

  const selectedItem = {
    jobTitle: data.jobTitle,
    shiftLength: data.shiftLength,
  };

  const { id = '' } = useParams();

  const headCells = [
    {
      id: 'job_title',
      label: 'Job title',
    },
    {
      id: 'shiftlength',
      label: 'Shift length',
    },
  ];

  const {
    isLoading,
    isFetching,
    isSuccess,
    itemCount,
    itemList,

    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    onUpdateOrdering,
  } = useFetchAllJobTitles(id);

  const onSelectItem = useCallback(
    (item) => {
      handleChange(`jobTitle`, item.jobTitle);
      handleChange(`shiftLength`, item.shiftLength);
      handleChange(`samplingPlan`, item.id);
    },
    [handleChange],
  );

  return (
    <Hidden xsUp={!visible}>
      {selectedItem?.jobTitle ? (
        <Card sx={{ maxWidth: '500px' }}>
          <CardContent>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              <Typography fontWeight="bold" component="span">
                Job title:
              </Typography>{' '}
              {selectedItem.jobTitle}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              <Typography fontWeight="bold" component="span">
                Shift length:
              </Typography>{' '}
              {selectedItem.shiftLength}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              disabled={data.hasSamples}
              variant="contained"
              onClick={() =>
                onSelectItem({ jobTitle: undefined, shiftLength: undefined })
              }
            >
              Switch Job title
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CrudListPageToolbar
              title="Job title selection"
              addLabel=""
              searchFieldPlaceholder="Search on job titles"
              searchValue={search}
              onSearchChange={onSearchChange}
              onAddClick={() => void [0]}
              showAddButton={false}
            />
          </Grid>

          <Grid item xs={12}>
            {isSuccess && !isLoading && (
              <CrudTable
                title="Job titles"
                headCells={headCells}
                itemsPerPage={itemsPerPage}
                page={page}
                onRowsPerPageChange={onRowPerPageChange}
                onPageChange={onPageChange}
                orderBy={orderBy}
                onUpdateOrdering={onUpdateOrdering}
                isLoading={isLoading}
                isFetching={isFetching || search !== debouncedSearch}
                itemCount={itemCount}
                itemList={itemList}
                extraSx={{ minHeight: 'auto' }}
                ItemRowComponent={({ item }) => (
                  <>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onSelectItem(item)}
                    >
                      {item.jobTitle}
                    </TableCell>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onSelectItem(item)}
                    >
                      {item.shiftLength}
                    </TableCell>
                  </>
                )}
              />
            )}
          </Grid>
        </Grid>
      )}
    </Hidden>
  );
}

export const SelectJobTitleControlTester: RankedTester = rankWith(
  5,
  uiTypeIs('SelectJobTitleControl'),
);

export const SelectJobTitleControlRenderer = withJsonFormsControlProps(
  SelectJobTitleControl,
);
