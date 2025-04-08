import {
  ControlProps,
  EnumOption,
  OwnPropsOfEnum,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { useJsonForms, withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import { BaseInputControl } from './BaseInputControl';
import { MuiInputText, MuiSelect } from '@jsonforms/material-renderers';
import { Box, FormControl, InputLabel, Typography } from '@mui/material';
import { Fragment, useContext } from 'react';
import { WeldingContext } from '@tes/utils-hooks';

export const WeldingControl = (props: ControlProps & OwnPropsOfEnum) => {
  const oneOfList = props.schema.oneOf as Array<{
    title: string;
    const: string;
  }>;
  const ctx = useJsonForms();
  const otherList = oneOfList.filter(
    (item: { const: string; title: string }) => {
      return item.title.toLowerCase().includes('n/a');
    },
  );

  const foundAOtherItem = otherList.find((item) => item.const === props.data);

  const extraFieldList =
    props &&
    props.uischema &&
    props.uischema.options &&
    props?.uischema?.options['extraFields'].map(
      (item: { path: string; label: string; type: string }) => ({
        label: item.label,
        path: item.path,
        type: item.type,
      }),
    );

  const context = useContext(WeldingContext);

  if (!context) {
    return <Typography variant="body1">No welding results found.</Typography>;
  }

  const { data, isError, isSuccess } = context.useGetAllQuery({});

  const itemList =
    data && data.results.map((item) => ({ value: item.id, label: item.title }));

  return (
    <Box>
      {isError && (
        <Typography variant="body1">
          An error occurred while fetching welding results.
        </Typography>
      )}
      {isSuccess && (
        <>
          <BaseInputControl {...props} errors={''} input={MuiSelect} />
          <Box
            sx={{ display: props.data && !foundAOtherItem ? 'block' : 'none' }}
          >
            {extraFieldList.map(
              ({
                label,
                path,
                type,
              }: {
                label: string;
                path: string;
                type: string;
              }) => {
                const [subject, widget] = path.split('.');
                const dataPath =
                  ctx?.core?.data[`${subject}`] && widget
                    ? ctx?.core?.data[`${subject}`][`${widget}`]
                    : ctx?.core?.data[`${subject}`];

                switch (type) {
                  case 'string':
                    return (
                      <BaseInputControl
                        {...props}
                        key={`${props.id}.${path}`}
                        id={`${props.id}.${path}`}
                        label={`${label}`}
                        data={dataPath || ''}
                        path={path}
                        input={MuiInputText}
                      />
                    );
                  case 'select':
                    return (
                      <Fragment key={`${props.id}.${path}`}>
                        <FormControl sx={{ width: '100%' }}>
                          <InputLabel
                            sx={{
                              top: 16,
                              '&.MuiInputLabel-shrink': {
                                top: 28,
                              },
                            }}
                          >
                            {label}
                          </InputLabel>
                          <MuiSelect
                            isValid={true}
                            {...props}
                            options={itemList as unknown as EnumOption[]}
                            id={`${props.id}.${path}`}
                            data={dataPath || ''}
                            path={path}
                          />
                        </FormControl>
                      </Fragment>
                    );
                  default:
                    return (
                      <BaseInputControl
                        key={`${props.id}.${path}`}
                        {...props}
                        id={`${props.id}.${path}`}
                        label={`${label}`}
                        data={dataPath || ''}
                        path={path}
                        input={MuiInputText}
                      />
                    );
                }
              },
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export const WeldingControlTester: RankedTester = rankWith(
  2,
  uiTypeIs('WeldingControl'),
);
export const WeldingControlRenderer =
  withJsonFormsOneOfEnumProps(WeldingControl);
