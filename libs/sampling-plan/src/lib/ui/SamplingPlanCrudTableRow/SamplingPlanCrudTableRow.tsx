import { Badge, Box, Chip, TableCell } from '@mui/material';
import { ISamplingPlanListResponse } from '../../api';
import { makeStyles } from '@mui/styles';

interface IProps {
  item: ISamplingPlanListResponse;
  isSelected?: boolean;
  onToggleSelect?: (id: string | number) => void;
}

const useStyles = makeStyles(({ palette }) => ({
  link: {
    textDecoration: 'none',
    color: palette.text.secondary,
  },
}));

export function SamplingPlanCrudTableRow({ item }: IProps) {
  const classes = useStyles();

  return (
    <>
      <TableCell className={classes.link} sx={{ py: 1 }}>
        <Box sx={{ fontWeight: 500 }}>{item.title}</Box>
        <Box>{item.taskDescription}</Box>
      </TableCell>
      <TableCell className={classes.link}>{item.sampleType}</TableCell>
      <TableCell sx={{ py: 0.5 }}>
        {item.hazardScenarios.map((hazardScenario) => (
          <Badge
            key={hazardScenario.hazard.id}
            badgeContent={`${hazardScenario.sampleCount} / ${hazardScenario.targetSampleCount}`}
            color="secondary"
            max={9999}
            sx={{ mb: '2px', mt: '10px', mr: '16px' }}
          >
            <Chip
              label={`${hazardScenario.hazard?.title}`}
              size="small"
              sx={{ my: '2px', mr: '4px' }}
            />
          </Badge>
        ))}
      </TableCell>
    </>
  );
}
