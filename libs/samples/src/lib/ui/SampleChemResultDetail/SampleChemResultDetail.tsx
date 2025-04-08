import { IChemicalResult } from '../../api';
import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import * as colors from '@tes/ui/colors';
import { Edit as EditIcon } from '@mui/icons-material';
import { useCustomNavigate } from '@tes/router';
import { useParams } from 'react-router-dom';
import { IUnits } from '@tes/units-api';

interface IProps {
  disable: boolean;
  itemList?: Array<IChemicalResult>;
  hazardsList: Array<{
    id: string;
    title: string;
    casNumber: string;
    isOverloaded: boolean;
  }>;
  unitList: Array<IUnits>;
  isClient: boolean;
}

export function SampleChemResultDetail(props: IProps) {
  const { itemList, hazardsList, unitList, disable, isClient } = props;
  const { navigateToRoute } = useCustomNavigate();
  const {
    id = '',
    subjectType = '',
    subjectId = '',
    sampleId = '',
  } = useParams();

  return (
    <>
      {hazardsList.map((item, index) => {
        const hazardResult = itemList?.find(
          (hazardItem) => hazardItem.hazard === item.id,
        );

        if (!hazardResult) {
          return (
            <Box
              mb={2}
              sx={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              key={`${item.id}`}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: colors.accent1['700'],
                }}
                variant={'subtitle1'}
              >
                {item.title} - #{item.casNumber}
              </Typography>

              {!isClient && (
                <Box>
                  <Button
                    disabled={disable}
                    onClick={() =>
                      navigateToRoute('chemSampleResultCreate', {
                        params: { hazardId: item.id },
                      })
                    }
                    sx={{ mt: 2 }}
                    variant="contained"
                  >
                    Add result
                  </Button>
                  {disable && (
                    <Typography
                      sx={{
                        fontStyle: 'italic',
                        fontSize: '12px',
                      }}
                      variant="body2"
                    >
                      Finish the sample first
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          );
        }

        const unit =
          hazardResult && unitList.find((u) => u.id === hazardResult.unit);

        const totalMassUnit =
          hazardResult &&
          unitList.find((u) => u.id === hazardResult.totalMassUnit);

        return (
          <Box mb={2} key={`${item.id}`}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    color: colors.accent1['700'],
                    alignSelf: 'center',
                  }}
                  variant={'subtitle1'}
                >
                  {item.title}
                </Typography>
                {item.isOverloaded && (
                  <Box sx={{ ml: 2, alignSelf: 'center' }}>
                    <Chip
                      variant="outlined"
                      color="warning"
                      label={'Overloaded'}
                      size="small"
                    />
                  </Box>
                )}
              </Box>
              {!isClient && (
                <Button
                  onClick={() => {
                    navigateToRoute('chemSampleResultCreate', {
                      params: {
                        id,
                        subjectType,
                        subjectId,
                        sampleId,
                        hazardId: item.id,
                      },
                    });
                  }}
                >
                  <EditIcon sx={{ mr: 1 }} />
                  Edit
                </Button>
              )}
            </Box>
            <Typography variant={'body1'}>
              {`Sample result: ${
                hazardResult.isLessThan === null ? '' : hazardResult.isLessThan
              } ${
                hazardResult.sampleResult === null
                  ? '--'
                  : hazardResult.sampleResult
              } ${unit && unit.title}`}
            </Typography>
            <Typography variant={'body1'}>
              {`TWA result: ${
                hazardResult.isLessThanTwa === null
                  ? ''
                  : hazardResult.isLessThanTwa
              } ${hazardResult.twaResult} ${unit && unit.title}`}
            </Typography>
            <Typography variant={'body1'}>
              {`Method: ${hazardResult.method}`}
            </Typography>
            <Typography variant={'body1'}>
              {`Volume: ${hazardResult.volume} L`}
            </Typography>
            <Typography variant={'body1'}>
              {`Total time: ${hazardResult.total} (minutes)`}
            </Typography>
            <Typography variant={'body1'}>
              {`Occupational Exposure Limits: ${hazardResult.oel}`}
            </Typography>
            <Typography variant={'body1'}>
              {`Action level: ${hazardResult.al || '--'}`}
            </Typography>
            <Typography variant={'body1'}>
              {`Total mass: ${
                hazardResult.isLessThan === null ? '' : hazardResult.isLessThan
              } ${hazardResult.totalMass} ${totalMassUnit?.title || ''}`}
            </Typography>
            {index <= 1 ? <Divider sx={{ my: 3 }} /> : null}
          </Box>
        );
      })}
    </>
  );
}
