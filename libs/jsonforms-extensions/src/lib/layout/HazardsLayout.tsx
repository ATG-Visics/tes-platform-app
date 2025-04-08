import { useJsonForms } from '@jsonforms/react';
import { useCallback } from 'react';
import {
  Button,
  Hidden,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  ArrayLayoutProps,
  ControlElement,
  createDefaultValue,
  Dispatch,
  mapDispatchToCellProps,
  Paths,
  Resolve,
} from '@jsonforms/core';
import range from 'lodash/range';
import { HazardSelectControlWidget } from '../widgets/HazardSelectControlWidget';

interface EmptyTableProps {
  numColumns: number;
}

const EmptyTableRow = ({ numColumns }: EmptyTableProps) => (
  <TableRow>
    <TableCell sx={{ border: 'none' }} colSpan={numColumns}>
      <Typography align="center">No hazards added yet.</Typography>
    </TableCell>
  </TableRow>
);

const TABLE_ACTIONS_COLUMN = 2;

const controlWithoutLabel = (scope: string): ControlElement => ({
  type: 'Control',
  scope: scope,
  label: false,
});

export function HazardsLayout(props: ArrayLayoutProps) {
  const {
    path,
    schema,
    visible,
    enabled,
    cells,
    addItem,
    data,
    renderers,
    rootSchema,
    removeItems,
    label,
  } = props;

  const ctx = useJsonForms();

  const deleteConfirm = useCallback(
    (path: string, index: number) => {
      if (!removeItems) {
        return;
      }

      const p = path.substring(0, path.lastIndexOf('.'));
      removeItems(p, [index])();
    },
    [removeItems],
  );

  return (
    <Hidden xsUp={!visible}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{label}</TableCell>
            <TableCell sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                sx={{ visibility: enabled ? 'initial' : 'hidden' }}
                onClick={addItem(path, createDefaultValue(schema))}
                size="large"
              >
                <AddIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data < 1 && (
            <EmptyTableRow numColumns={data + TABLE_ACTIONS_COLUMN} />
          )}

          {range(data).map((index: number) => {
            const childPath = Paths.compose(path, `${index}`);
            const childData = Resolve.data(ctx?.core?.data, childPath);
            const dispatch = ctx.dispatch as Dispatch;
            const { handleChange } = mapDispatchToCellProps(dispatch);

            return (
              <TableRow key={childPath}>
                <TableCell size="medium" sx={{ width: '80%' }}>
                  <HazardSelectControlWidget
                    schema={Resolve.schema(
                      schema,
                      `#/properties/title`,
                      rootSchema,
                    )}
                    uischema={controlWithoutLabel('#/properties/title')}
                    path={childPath}
                    enabled={enabled}
                    renderers={renderers}
                    cells={cells}
                    data={childData}
                    errors={''}
                    handleChange={handleChange}
                    id={childPath}
                    isValid={true}
                    rootSchema={rootSchema}
                    visible={true}
                    label={''}
                  />
                </TableCell>
                <TableCell size="small" align="center" sx={{ width: '20%' }}>
                  <IconButton
                    aria-label={`Delete`}
                    onClick={() => {
                      deleteConfirm(childPath, index);
                    }}
                    size="large"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell sx={{ border: 'none', textAlign: 'center' }} colSpan={2}>
              <Button
                variant="contained"
                sx={{ visibility: enabled ? 'initial' : 'hidden' }}
                onClick={addItem(path, createDefaultValue(schema))}
              >
                Add hazards
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Hidden>
  );
}
