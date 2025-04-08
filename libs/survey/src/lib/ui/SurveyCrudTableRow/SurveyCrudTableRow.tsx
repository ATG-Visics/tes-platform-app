import { TableCell } from '@mui/material';
import { ISurveyListItem } from '../../api';
import { format } from 'date-fns';
import { MuiRouterLink } from '@tes/router';

interface IProps {
  item: ISurveyListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

export type SurveyCrudTableRowProps = IProps;

export function SurveyCrudTableRow(props: IProps) {
  const { item } = props;

  const samplerName =
    item.samplers.length > 0
      ? Array.from(item.samplers.values()).join(', ')
      : 'No samples taken yet';

  const route = {
    name: 'surveyDashboard',
    params: {
      id: item.project,
    },
    query: {
      selectedDate: item.startDate,
    },
  };
  return (
    <>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          {format(new Date(item.startDate), 'yyyy-MM-dd')}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          {samplerName}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          {item.sampleCount}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          {item.resultCount}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          {format(new Date(item.startDate), 'MMM dd, yyy hh:mm a')}
        </MuiRouterLink>
      </TableCell>
    </>
  );
}
