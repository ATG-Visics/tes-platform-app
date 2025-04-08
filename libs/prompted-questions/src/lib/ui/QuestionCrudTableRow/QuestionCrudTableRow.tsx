import { Box, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IQuestionListItem } from '../../api';
import { QuestionGroupTypeChip } from '../QuestionGroupTypeChip';
import * as colors from '@tes/ui/colors';
import { RouterLink } from '@tes/router';

interface IProps {
  item: IQuestionListItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function QuestionCrudTableRow(props: IProps) {
  const classes = useStyles();
  const { item } = props;
  const route = {
    name: 'promptedQuestionsDetail',
    params: {
      id: item.id,
    },
  };
  return (
    <>
      <TableCell>
        <RouterLink
          name={route.name}
          params={route.params}
          className={classes.link}
        >
          {item.title}
        </RouterLink>
      </TableCell>
      <TableCell>
        <RouterLink
          name={route.name}
          params={route.params}
          className={classes.link}
        >
          {item.questions.length}
        </RouterLink>
      </TableCell>
      <TableCell sx={{ width: 300 }}>
        <RouterLink
          name={route.name}
          params={route.params}
          className={classes.link}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            {item.isRequiredForNewProjects && (
              <QuestionGroupTypeChip
                label="Persistent"
                backgroundColor={colors.accent1['300']}
                color={colors.accent1['900']}
              />
            )}
            {item.repeatEverySurveyMoment && (
              <QuestionGroupTypeChip
                label="Daily"
                backgroundColor={colors.accent2['100']}
                color={colors.accent2['900']}
              />
            )}
          </Box>
        </RouterLink>
      </TableCell>
    </>
  );
}
