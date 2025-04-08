import { useCallback, useMemo } from 'react';
import {
  BarPlot,
  BarSeriesType,
  ChartsLegend,
  ChartsTooltip,
  ChartsYAxis,
  LineSeriesType,
  PieSeriesType,
  PieValueType,
  ResponsiveChartContainer,
  ScatterSeriesType,
} from '@mui/x-charts';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { MakeOptional } from '@mui/x-charts/internals';

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
}

export type BarChartProps = IProps;

export function BarChart(props: IProps) {
  const { chartData, handleOpenModal, maxItems } = props;

  const chartSeries = useMemo(
    () => [
      {
        type: 'bar',
        stack: '',
        id: 'above_100',
        data: maxItems
          ? chartData.clientResults.get('above_100')?.slice(0, maxItems)
          : chartData.clientResults.get('above_100'),
        color: chartData.clientResultsColors.get('above_100'),
        label: '> 100% of OEL',
        highlightScope: {
          highlight: 'item',
          fade: 'none',
        },
        valueFormatter: (v: string) => {
          return `${v} Results`;
        },
      },
      {
        type: 'bar',
        stack: '',
        label: '50% - 100% of OEL',
        id: '50_100',
        data: maxItems
          ? chartData.clientResults.get('50_100')?.slice(0, maxItems)
          : chartData.clientResults.get('50_100'),
        color: chartData.clientResultsColors.get('50_100'),
        highlightScope: {
          highlight: 'item',
          fade: 'none',
        },
        valueFormatter: (v: string) => {
          return `${v} Results`;
        },
      },
      {
        type: 'bar',
        stack: '',
        label: '10% - 50% of OEL',
        id: '10_50',
        data: maxItems
          ? chartData.clientResults.get('10_50')?.slice(0, maxItems)
          : chartData.clientResults.get('10_50'),
        color: chartData.clientResultsColors.get('10_50'),
        highlightScope: {
          highlight: 'item',
          fade: 'none',
        },
        valueFormatter: (v: string) => {
          return `${v} Results`;
        },
      },
      {
        type: 'bar',
        stack: '',
        label: '<10% of OEL',
        id: '1_10',
        data: maxItems
          ? chartData.clientResults.get('1_10')?.slice(0, maxItems)
          : chartData.clientResults.get('1_10'),
        color: chartData.clientResultsColors.get('1_10'),
        highlightScope: {
          highlight: 'item',
          fade: 'none',
        },
        valueFormatter: (v: string) => {
          return `${v} Results`;
        },
      },
      {
        type: 'bar',
        stack: '',
        label: '<1% of OEL',
        id: 'under_1',
        data: maxItems
          ? chartData.clientResults.get('under_1')?.slice(0, maxItems)
          : chartData.clientResults.get('under_1'),
        color: chartData.clientResultsColors.get('under_1'),
        highlightScope: {
          highlight: 'item',
          fade: 'none',
        },
        valueFormatter: (v: string) => {
          return `${v} Results`;
        },
      },
    ],
    [chartData.clientResults, chartData.clientResultsColors, maxItems],
  );

  const handleItemClick = useCallback(
    (_event, barItemIdentifier) => {
      const clientId = [...chartData.clientList.keys()][
        barItemIdentifier.dataIndex
      ];
      handleOpenModal(clientId, `${barItemIdentifier.seriesId}`, '');
    },
    [chartData.clientList, handleOpenModal],
  );

  return (
    <ResponsiveChartContainer
      series={
        chartSeries as unknown as (
          | BarSeriesType
          | LineSeriesType
          | ScatterSeriesType
          | PieSeriesType<MakeOptional<PieValueType, 'id'>>
        )[]
      }
      xAxis={[
        {
          data: maxItems
            ? [...chartData.clientList.values()]?.slice(0, maxItems)
            : [...chartData.clientList.values()],
          scaleType: 'band',
          id: 'x-axis-id',
        },
      ]}
      yAxis={[
        {
          id: 'y-axis-id',
        },
      ]}
    >
      <ChartsTooltip trigger="axis" />
      <ChartsLegend
        direction="row"
        position={{ horizontal: 'middle', vertical: 'top' }}
      />
      <BarPlot onItemClick={handleItemClick} barLabel="value" />
      <ChartsXAxis
        label="Clients"
        position="bottom"
        axisId="x-axis-id"
        tickLabelStyle={{ display: 'none' }}
      />
      <ChartsYAxis
        label="Number of results"
        position="left"
        axisId="y-axis-id"
      />
    </ResponsiveChartContainer>
  );
}
