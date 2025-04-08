import { WeatherCard } from '@tes/platform';
import { mapListResult } from '@tes/utils-hooks';

import { useGetAllWeatherConditionsQuery } from '../../api';
import { useParams } from 'react-router-dom';
import { useCustomNavigate } from '@tes/router';

interface IProps {
  surveyMoment: {
    project: string;
    startDate: string;
  };
}

export function WeatherConditionsListPage(props: IProps) {
  const { surveyMoment } = props;
  const { navigateToRoute } = useCustomNavigate();
  const { id = '' } = useParams();

  const { data } = useGetAllWeatherConditionsQuery({ surveyMoment });
  const { itemList } = mapListResult(data);

  return (
    <WeatherCard
      title="Weather conditions"
      emptyMessage="No weather conditions added"
      weatherConditions={itemList}
      onClickModal={(weatherId: string | null) =>
        navigateToRoute('weatherUpdate', {
          params: {
            id,
            weatherId: weatherId || '',
          },
        })
      }
    />
  );
}
