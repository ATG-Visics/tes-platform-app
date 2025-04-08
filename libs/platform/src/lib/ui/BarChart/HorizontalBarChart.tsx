import { memo, useCallback, useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';

interface IProps {
  chartData: {
    clientList: Map<string, string>;
    clientResults: Map<string, Array<number>>;
    clientResultsColors: Map<string, string>;
  };
  handleOpenModal: (
    dataIndex: string,
    category: string,
    hazard: string,
  ) => void;
  maxItems?: number;
  selectedClients?: string[];
}

const categoryOrder = ['above_100', '50_100', '10_50', '1_10', 'under_1'];

type CategoryKey = typeof categoryOrder[number];

interface ClientData {
  client: string;
  truncatedClientName: string;
  clientId: string;

  [key: string]: string | number;
}

export const HorizontalBarChart = memo(function HorizontalBarChart(
  props: IProps,
) {
  const { chartData, maxItems, selectedClients, handleOpenModal } = props;

  const dataset = useMemo(() => {
    const clients = Array.from(chartData.clientList.entries());

    const filteredClients =
      selectedClients && selectedClients.length > 0
        ? clients.filter((client) => selectedClients.includes(client[0]))
        : clients.slice(0, maxItems);

    return filteredClients.map(([id, name]): ClientData => {
      const clientData: ClientData = {
        client: name,
        truncatedClientName:
          name.length > 25 ? `${name.slice(0, 25)}...` : name,
        clientId: id,
      };

      categoryOrder.forEach((key) => {
        const values = chartData.clientResults.get(key);
        clientData[key] = values
          ? values[clients.findIndex((c) => c[0] === id)] || 0
          : 0;
      });

      return clientData;
    });
  }, [chartData, maxItems, selectedClients]);

  const handleItemClick = useCallback(
    (_event, barItemIdentifier) => {
      const clientId = dataset[barItemIdentifier.dataIndex];
      handleOpenModal(clientId.clientId, barItemIdentifier.seriesId, '');
    },
    [dataset, handleOpenModal],
  );

  const valueFormatter = (value: number | null) => {
    return value !== null ? `${value} Results` : 'N/A';
  };

  interface IDotElementProps {
    color?: string;
  }

  function OelListItem(props: {
    identifier: CategoryKey;
    amount: number;
    label?: string;
  }) {
    return (
      <ListItem sx={{ flexDirection: 'row', py: 0 }}>
        <DotElement
          color={chartData.clientResultsColors.get(props.identifier)}
        />
        {props.label}
        <ListItemText sx={{ textAlign: 'end' }}>{props.amount}</ListItemText>
      </ListItem>
    );
  }

  function DotElement(props: IDotElementProps) {
    return (
      <Paper
        sx={{
          mr: 1,
          borderRadius: '50%',
          width: 14,
          height: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            borderRadius: '50%',
            width: 10,
            height: 10,
            backgroundColor: props.color,
          }}
        ></Box>
      </Paper>
    );
  }

  const CustomItemTooltipContent = (props: {
    itemData: { dataIndex: number };
  }) => {
    const index = props.itemData.dataIndex;
    const clientData = dataset[index];

    return (
      <Paper sx={{ minWidth: 300 }}>
        <Typography sx={{ px: 2, py: 1 }}>{clientData.client}</Typography>
        <Divider />
        <List>
          {categoryOrder.map((key) => (
            <OelListItem
              key={key}
              identifier={key}
              amount={clientData[key] as number}
              label={getLabelForKey(key)}
            />
          ))}
        </List>
      </Paper>
    );
  };

  return (
    <BarChart
      skipAnimation
      dataset={dataset}
      barLabel="value"
      tooltip={{ trigger: 'item', itemContent: CustomItemTooltipContent }}
      margin={{ left: 200 }}
      yAxis={[
        {
          scaleType: 'band',
          dataKey: 'truncatedClientName',
        },
      ]}
      onItemClick={handleItemClick}
      series={categoryOrder.map((key) => ({
        id: key,
        dataKey: key,
        stack: 'A',
        label: getLabelForKey(key),
        valueFormatter,
        color: chartData.clientResultsColors.get(key),
      }))}
      layout="horizontal"
    />
  );
});

function getLabelForKey(key: CategoryKey) {
  switch (key) {
    case 'above_100':
      return '> 100% of OEL';
    case '50_100':
      return '50% - 100% of OEL';
    case '10_50':
      return '10% - 50% of OEL';
    case '1_10':
      return '1% - 10% of OEL';
    case 'under_1':
    default:
      return '< 1% of OEL';
  }
}
