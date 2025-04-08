import { Box, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format, parse } from 'date-fns';
import { ISampleListItem } from '../../api';

import { RouterLink } from '@tes/router';

interface IProps {
  item: ISampleListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

export type SampleCrudTableRowProps = IProps;

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function SampleCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  const subjectType = item.personSampleSubject ? 'person' : 'area';
  const subjectId = item.personSampleSubject || item.areaSampleSubject;
  const linkParams = {
    id: item.surveyMoment.project,
    subjectType: subjectType,
    subjectId: subjectId,
    sampleId: item.id,
  };
  const queryParams = {
    selectedDate: item.surveyMoment.startDate,
  };
  return (
    <>
      <TableCell>
        <RouterLink
          name={'sampleDetail'}
          className={classes.link}
          params={linkParams}
          query={queryParams}
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
            {item.sampleId}
          </Box>
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'sampleDetail'}
          className={classes.link}
          params={linkParams}
          query={queryParams}
        >
          {item.sampler}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={'sampleDetail'}
          className={classes.link}
          params={linkParams}
          query={queryParams}
        >
          {format(
            parse(item.surveyMoment.startDate, 'yyyy-MM-dd', new Date()),
            'MMM dd, y',
          )}
        </RouterLink>
      </TableCell>
    </>
  );
}
