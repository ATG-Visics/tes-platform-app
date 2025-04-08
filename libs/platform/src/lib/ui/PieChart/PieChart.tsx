import { Skeleton, styled, Typography } from '@mui/material';
import {
  BarSeriesType,
  ChartsTooltip,
  LineSeriesType,
  PieArcLabelPlot,
  PiePlot,
  PieSeriesType,
  PieValueType,
  ResponsiveChartContainer,
  ScatterSeriesType,
  useDrawingArea,
} from '@mui/x-charts';
import { useCallback, useMemo } from 'react';
import { MakeOptional } from '@mui/x-charts/internals';

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 18,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

interface IProps {
  response: {
    isSuccess: boolean;
    isLoading: boolean;
    isError: boolean;
    data?: Array<{ id: string; label: string; value: number; color: string }>;
  };
  handleOpenModal: (
    dataIndex: string,
    category: string,
    hazard: string,
  ) => void;
  hazardId: string;
}

export function PieChart(props: IProps) {
  const { response, handleOpenModal, hazardId } = props;

  const pieChartSeries = useMemo(
    () => [
      {
        type: 'pie',
        data: response.data,
        paddingAngle: 2,
        innerRadius: 110,
        id: 'pie-chart-series',
        cornerRadius: 5,
        highlightScope: {
          highlight: 'item',
          fade: 'series',
        },
      },
    ],
    [response.data],
  );

  const handleItemClick = useCallback(
    (_event, barItemIdentifier) => {
      handleOpenModal(
        '',
        ['under_1', '1_10', '10_50', '50_100', 'above_100'][
          barItemIdentifier.dataIndex
        ],
        hazardId,
      );
    },
    [handleOpenModal, hazardId],
  );

  if (response.isLoading) {
    return <Skeleton variant="circular" />;
  }

  if (response.isError) {
    return <Typography>There is a error on the server</Typography>;
  }

  if (!response.data) {
    return <Typography my={4}>Select a Hazard to see the results</Typography>;
  }

  const sum = response.data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.value,
    0,
  );

  return (
    <ResponsiveChartContainer
      series={
        pieChartSeries as (
          | LineSeriesType
          | PieSeriesType<MakeOptional<PieValueType, 'id'>>
          | BarSeriesType
          | ScatterSeriesType
        )[]
      }
    >
      <ChartsTooltip trigger="item" />
      <PieCenterLabel>
        {sum ? `Total results: ${sum}` : 'No data found'}
      </PieCenterLabel>
      <PieArcLabelPlot arcLabel="value" outerRadius={20} data={[]} id={''} />
      <PiePlot onItemClick={handleItemClick} />
    </ResponsiveChartContainer>
  );
}
