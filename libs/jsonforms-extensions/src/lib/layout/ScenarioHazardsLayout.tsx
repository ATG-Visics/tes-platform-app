import { JsonFormsDispatch } from '@jsonforms/react';
import { useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Hidden,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  ArrayLayoutProps,
  createDefaultValue,
  JsonSchema,
  Paths,
} from '@jsonforms/core';
import range from 'lodash/range';

export function ScenarioHazardsLayout(props: ArrayLayoutProps) {
  const {
    path,
    schema,
    visible,
    enabled,
    addItem,
    uischema,
    data,
    removeItems,
    label,
  } = props;

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

  const uiSchema = uischema?.options && uischema?.options['detail'];

  return (
    <Hidden xsUp={!visible}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography gutterBottom variant="h6">
            {label}
          </Typography>
          <IconButton
            sx={{ visibility: enabled ? 'initial' : 'hidden' }}
            disabled={!enabled}
            onClick={addItem(path, createDefaultValue(schema))}
            size="large"
          >
            <AddIcon />
          </IconButton>
        </Box>
        {range(data).map((index: number) => {
          const childPath = Paths.compose(path, `${index}`);
          return (
            <Card sx={{ px: 2, my: 3 }} key={childPath}>
              <CardHeader
                action={
                  <IconButton
                    aria-label="delete hazard scenario"
                    onClick={() => {
                      deleteConfirm(childPath, index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                title={`Hazard scenario ${index + 1}`}
              />
              <CardContent>
                <JsonFormsDispatch
                  key={childPath}
                  schema={schema as JsonSchema}
                  path={childPath}
                  uischema={uiSchema}
                />
              </CardContent>
            </Card>
          );
        })}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ visibility: enabled ? 'initial' : 'hidden', mb: 1 }}
            disabled={!enabled}
            onClick={addItem(path, createDefaultValue(schema))}
          >
            Add another
          </Button>
        </Box>
      </Box>
    </Hidden>
  );
}
