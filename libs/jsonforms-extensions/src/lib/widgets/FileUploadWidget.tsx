import { CellProps, WithClassname } from '@jsonforms/core';
import { UploadFile } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

interface IProps extends CellProps, WithClassname {}

export type FileUploadWidgetProps = IProps;

export function FileUploadWidget(props: IProps) {
  const { data, className, id, enabled, handleChange, path } = props;
  const intl = useIntl();

  const label = useMemo(
    () =>
      intl.formatMessage(
        {
          id: 'ppsUpload.button.label',
          defaultMessage:
            '{uploaded, select, yes {Verander bestand} no {Upload PPS bestand} other {}}',
        },
        {
          uploaded: data ? 'yes' : 'no',
        },
      ),
    [data, intl],
  );

  return (
    <Button
      component="label"
      variant="outlined"
      startIcon={<UploadFile />}
      className={className}
      disabled={!enabled}
      fullWidth={false}
      sx={{ width: 'fit-content' }}
      size="large"
      id={id}
    >
      {label}

      <input
        type="file"
        accept=".xlsx, .xlsm"
        hidden
        onChange={({ target: { files } }) => handleChange(path, files?.[0])}
      />
    </Button>
  );
}
