import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '../Typography';

interface IProps {
  label: ReactNode;
  value: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export type SummaryItemProps = IProps;
export const SummaryItemComponentName = 'IuiSummaryItem';

const useStyles = makeStyles(
  ({ spacing, breakpoints }) => ({
    root: {
      padding: `${spacing(1)}px 0`,
      flex: '1 1 25%',
      maxWidth: `calc(25% - ${spacing(2)}px)`,

      '& > * ': {
        margin: 0,
      },

      [breakpoints.up('sm')]: {
        paddingTop: 0,
        paddingBottom: 0,
      },

      [breakpoints.up('md')]: {
        flex: '0 0 auto',
        maxWidth: 'none',
        padding: 0,
      },
    },
    // shared class between label and value elements
    text: {
      marginLeft: 0,
    },
    prefix: {},
    suffix: {},
    value: {
      display: 'block',
      marginLeft: 0,
    },
    valueText: {},
    label: {
      display: 'block',
      // display: 'inline-block',
      marginRight: spacing(1),
    },
    valueTextWrap: {},
    labelText: {
      display: 'inline',
      '&::after': {
        content: '":"',
      },
    },
  }),
  { name: SummaryItemComponentName },
);

export type SummaryItemClassNames = keyof ReturnType<typeof useStyles>;

export function SummaryItem(props: IProps) {
  const { label, value, prefix, suffix } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <dt className={classes.label}>
        <Text strong className={clsx(classes.labelText, classes.text)}>
          {label}
        </Text>
      </dt>
      <dd className={classes.value}>
        {prefix && (
          <>
            <Text className={clsx(classes.prefix, classes.text)}>{prefix}</Text>
            &nbsp;
          </>
        )}
        <Text className={clsx(classes.valueText, classes.text)}>{value}</Text>
        {suffix && (
          <>
            &nbsp;
            <Text className={clsx(classes.suffix, classes.text)}>{suffix}</Text>
          </>
        )}
      </dd>
    </div>
  );
}

SummaryItem.defaultProps = {
  prefix: null,
  suffix: null,
} as IProps;
