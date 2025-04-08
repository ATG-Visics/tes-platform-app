import {
  ControlProps,
  RankedTester,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import * as colors from '@tes/ui/colors';
import { Box } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { mapListResult } from '@tes/utils-hooks';
import { BaseInputControl } from '@tes/jsonforms-extensions';
import { useGetAllPersonSampleSubjectQuery } from '@tes/person-subject-api';
import { useGetAllAreaSampleSubjectQuery } from '@tes/area-subject-api';
import { useGetAllSamplesBySurveyMomentQuery } from '../../api/staticSampleData.api';
import { useParams, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { MentionInput } from '../../ui';
import { useDebouncedChange } from '@jsonforms/material-renderers';

const eventToValue = (ev: { target: { value: string } }) => ev.target.value;

export const TextControlWithMention = (props: ControlProps) => {
  const [inputValue, onChange] = useDebouncedChange(
    props.handleChange,
    '',
    props.data,
    props.path,
    eventToValue,
  );

  const { id: projectId = '' } = useParams();
  const [searchParams, _setSearchParams] = useSearchParams();

  const selectedDate = searchParams.get('selectedDate') || new Date();
  const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  const surveyMomentId = useMemo(() => {
    return {
      project: projectId || '',
      startDate: formattedSelectedDate,
    };
  }, [formattedSelectedDate, projectId]);

  const { data: personSubjectData } = useGetAllPersonSampleSubjectQuery({
    surveyMomentId: surveyMomentId,
  });

  const { itemList: personSubjectList } = mapListResult(personSubjectData);

  const { data: areaSubjectData } = useGetAllAreaSampleSubjectQuery({
    surveyMomentId: surveyMomentId,
  });

  const { itemList: areaSubjectList } = mapListResult(areaSubjectData);

  const { data: sampleData } = useGetAllSamplesBySurveyMomentQuery({
    surveyMomentId: surveyMomentId,
  });

  const { itemList: sampleList } = mapListResult(sampleData);

  const atMentionData = useMemo(() => {
    if (!personSubjectList) {
      return [];
    }

    if (!areaSubjectList) {
      return [];
    }

    const formattedPersons = personSubjectList.map((personSubject) => ({
      id: personSubject.id,
      display: personSubject.title,
    }));

    const formattedAreas = areaSubjectList.map((areaSubject) => ({
      id: areaSubject.id,
      display: areaSubject.title,
    }));

    return [
      { id: 'all', display: 'All' },
      ...formattedPersons,
      ...formattedAreas,
    ];
  }, [personSubjectList, areaSubjectList]);

  const hashtagMentionData = useMemo(() => {
    if (!sampleList) {
      return [];
    }

    const allSamples = sampleList.map((sample) => ({
      id: sample.id,
      display: sample.sampleId,
    }));

    return [{ id: 'all', display: 'All' }, ...allSamples];
  }, [sampleList]);

  const atMentionDisplayTransformHandler = useCallback(
    (id: string, display: string) => {
      const atMention = atMentionData.find((item) => item.id === id);
      return `@${atMention?.display || display}`;
    },
    [atMentionData],
  );

  const hashtagMentionDisplayTransformHandler = useCallback(
    (id: string, display: string) => {
      const hashtagMention = hashtagMentionData.find((item) => item.id === id);
      return `#${hashtagMention?.display || display}`;
    },
    [hashtagMentionData],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',

        '& label': {
          top: '-6px',
          display: 'none',
        },

        '& .mentionInput': {
          width: '100%',
          backgroundColor: 'rgb(0 0 0 / 4%)',
          borderTopRightRadius: '5px',
          borderTopLeftRadius: '5px',
          maxHeight: 56,
          outline: 'transparent',

          '.mentionInput__input': {
            padding: 2,
            border: 'none',
            height: 52,
            outline: 'none',
            lineHeight: 2.4,
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
            transition:
              'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

            '&:hover, &:focus': {
              borderBottom: '2px solid #535063',
            },
          },

          '.mentionInput__suggestions': {
            '.mentionInput__suggestions__list': {
              backgroundColor: '#fff',
              color: colors.accent1['700'],
              border: '1px solid rgba(0,0,0,0.15)',
              borderRadius: '4px',
              fontSize: 14,
              display: 'block',
            },
            '.mentionInput__suggestions__item': {
              padding: '5px 15px',
              borderBottom: '1px solid rgba(0,0,0,0.15)',
              '&:hover, &:focus': {
                backgroundColor: colors.accent2['400'],
                color: '#fff',
                fontWeight: 700,
              },
            },
            '.mentionInput__suggestions__item--focused': {
              backgroundColor: colors.accent2['400'],
              color: '#fff',
              fontWeight: 700,
            },
          },

          '.mentionInput__highlighter': {
            boxSizing: 'border-box',
            padding: 2,
          },
        },
      }}
    >
      <BaseInputControl
        inputValue={inputValue}
        setInputValue={onChange}
        atMentionData={atMentionData}
        atMentionDisplayTransformHandler={atMentionDisplayTransformHandler}
        hashtagMentionData={hashtagMentionData}
        hashtagMentionDisplayTransformHandler={
          hashtagMentionDisplayTransformHandler
        }
        {...props}
        input={MentionInput}
      />
    </Box>
  );
};

export const TextControlWithMentionTester: RankedTester = rankWith(
  10,
  uiTypeIs('TextControlWithMention'),
);
export const TextControlWithMentionRenderer = withJsonFormsControlProps(
  TextControlWithMention,
);
