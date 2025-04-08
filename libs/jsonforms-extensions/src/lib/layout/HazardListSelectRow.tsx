import { useContext } from 'react';
import { HazardsContext, mapListResult } from '@tes/utils-hooks';
import { Checkbox, TableCell, TableRow, Typography } from '@mui/material';
import {
  useGetAllActionLevelsQuery,
  useGetAllOelSourcesQuery,
} from '@tes/action-level-api';

interface IProps {
  path: string;
  item: {
    selected: boolean;
    hazard: string;
    oel: number;
    oelSource: string;
    actionLevelSource: string;
    actionLevel: number;
    remainingSampleCount: number;
    targetSampleCount: number;
  };
  enabled: boolean;
  handleChange: (path: string, value: string | boolean | number) => void;
}

export type HazardListSelectRowProps = IProps;

export function HazardListSelectRow(props: IProps) {
  const { path, item, enabled, handleChange } = props;
  const context = useContext(HazardsContext);

  const queryResult =
    context && context.useGetAllQuery
      ? context.useGetAllQuery({
          searchTitle: item.hazard,
        })
      : { data: undefined };

  const { itemList } = mapListResult(queryResult.data);

  const hazard = itemList[0];

  const { data } = useGetAllOelSourcesQuery({
    page: 0,
    limit: 100,
    search: '',
  });

  const { itemList: oelList } = mapListResult(data);

  const oelSource = oelList.find(
    (oelSource) => oelSource.id === item.oelSource,
  );

  const { data: actionLevelData } = useGetAllActionLevelsQuery({
    page: 0,
    limit: 100,
    search: '',
  });

  const { itemList: alList } = mapListResult(actionLevelData);

  const actionLevel = alList.find(
    (oelSource) => oelSource.id === item.oelSource,
  );

  return (
    <TableRow key={path}>
      <TableCell>
        <Checkbox
          checked={item.selected || false}
          onChange={() => handleChange(`${item}.selected`, !item.selected)}
          disabled={!enabled}
        />
      </TableCell>
      <TableCell>
        <Typography>{hazard?.title || ''}</Typography>
        <Typography variant="body2" color="textSecondary">
          {hazard?.casNumber || ''}
        </Typography>
      </TableCell>
      <TableCell>
        {item.oel} {' | '}
        {oelSource?.title || ''}
      </TableCell>
      <TableCell>
        {item.actionLevel}
        {' | '}
        {actionLevel?.title || ''}
      </TableCell>
      <TableCell>
        {item.remainingSampleCount} / {item.targetSampleCount}
      </TableCell>
    </TableRow>
  );
}
