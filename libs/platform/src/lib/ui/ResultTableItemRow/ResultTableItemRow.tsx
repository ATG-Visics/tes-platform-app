import { TableCell } from '@mui/material';
import { IResultByCategory } from '../../api';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { MuiRouterLink } from '@tes/router';

interface IProps {
  item: IResultByCategory;
}

export type ResultTableItemRowProps = IProps;

export function ResultTableItemRow(props: IProps) {
  const { item } = props;

  const route = {
    name: 'sampleDetail',
    params: {
      id: item.projectId,
      sampleId: item.sampleId,
    },
    query: {
      selectedDate: item.surveyMoment.startDate,
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
          {item.sampleTitle}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          {item.hazard}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          {item.project}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink
          name={route.name}
          params={route.params}
          query={route.query}
        >
          <ArrowForwardIcon />
        </MuiRouterLink>
      </TableCell>
    </>
  );
}

export function DummyRowItem({
  item,
}: {
  item: { title: string; id: string; count: number };
}) {
  const link = `projectOverview`;

  return (
    <>
      <TableCell>
        <MuiRouterLink name={link} params={{ id: item.id }}>
          {item.count}
        </MuiRouterLink>
      </TableCell>
      <TableCell>
        <MuiRouterLink name={link} params={{ id: item.id }}>
          {item.title}
        </MuiRouterLink>
      </TableCell>
    </>
  );
}
