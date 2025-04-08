import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  ICaptureTime,
  IChemicalResult,
  INoiseResult,
  useStartSampleMutation,
  useStopSampleMutation,
} from '../../api';
import * as colors from '@tes/ui/colors';
import { mapListResult } from '@tes/utils-hooks';
import { SampleChemResultDetail } from '../SampleChemResultDetail';
import { SampleNoiseResultDetail } from '../SampleNoiseResultDetail';
import { useGetAllChemicalUnitsQuery } from '@tes/units-api';
import dayjs from 'dayjs';
import { PlayArrow, Stop } from '@mui/icons-material';

interface IProps {
  title: string;
  subtitle: string;
  instrument: string;
  instrumentSerial: string;
  calibrator: string;
  captureTimes: ICaptureTime[];
  sampleId: string;
  hazards: Array<string>;
  status: string;
  lastCheck: string;
  initialFlowRate: string;
  finalFlowRate: string;
  twa: string;
  onClickEdit: () => void;
  onClickRegister: () => void;
  onClickFinish: () => void;
  onClickMoveSample: () => void;
  chemResultList?: Array<IChemicalResult>;
  noiseResult?: INoiseResult;
  sampleType?: string;
  hazardsList: Array<{
    id: string;
    title: string;
    casNumber: string;
    isOverloaded: boolean;
  }>;
  averageFlowRate: string;
  type: string;
  sampleMedia?: string;
  sampleMediaSerial?: string;
  isClient: boolean;
  sampleVolume?: string;
}

export type SampleDetailProps = IProps;

export function SampleDetail(props: IProps) {
  const {
    isClient,
    title,
    subtitle,
    instrument,
    instrumentSerial,
    calibrator,
    captureTimes,
    sampleId,
    hazards,
    status,
    lastCheck,
    initialFlowRate,
    finalFlowRate,
    onClickEdit,
    onClickFinish,
    onClickMoveSample,
    twa,
    sampleType,
    hazardsList,
    averageFlowRate,
    type,
    sampleMedia,
    sampleMediaSerial,
    chemResultList,
    noiseResult,
    sampleVolume,
  } = props;

  const response = useGetAllChemicalUnitsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );
  const { data } = response;
  const { itemList } = mapListResult(data);

  const [stopSample] = useStopSampleMutation();
  const [startSample] = useStartSampleMutation();

  const onClickStop = () => {
    const formattedTime = dayjs().utc().format('HH:mm:ss');

    stopSample({
      uuid: sampleId,
      body: { endTime: formattedTime },
    });
  };

  const onClickStart = () => {
    const formattedTime = dayjs().utc().format('HH:mm:ss');

    startSample({
      uuid: sampleId,
      body: { startTime: formattedTime },
    });
  };

  const formatToLocalTime = (utcTime: string) => {
    if (!utcTime) return '';
    return dayjs.utc(utcTime, 'HH:mm:ss').local().format('HH:mm');
  };

  const isFinished = status === 'Finished';

  const formatDuration = (duration: string) => {
    if (!duration) return '';

    const parsedTime = dayjs(duration, 'HH:mm:ss');
    const roundedTime = parsedTime.add(
      parsedTime.second() >= 30 ? 1 : 0,
      'minute',
    );

    return roundedTime.format('HH:mm');
  };

  return (
    <Box>
      <Box>
        <Typography
          variant="h4"
          sx={{
            lineHeight: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            color: colors.accent1['700'],
          }}
        >
          {title}
          <Box>
            {!isClient && (
              <Button variant="contained" onClick={onClickMoveSample}>
                Move Sample
              </Button>
            )}
          </Box>
        </Typography>
        <Typography variant="subtitle1">Sample type: {type}</Typography>
        <Typography variant="subtitle1">Sampler: {subtitle}</Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h6" sx={{ color: colors.accent1['700'] }}>
          {instrument}
        </Typography>
        <Typography variant="body1">Serial: {instrumentSerial}</Typography>
        <Typography variant="body1">Calibrated using: {calibrator}</Typography>
        <Typography variant="body1">Sample media: {sampleMedia}</Typography>
        <Typography variant="body1">
          Sample media serial number: {sampleMediaSerial}
        </Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography variant="h6" sx={{ color: colors.accent1['700'] }}>
          Hazards
        </Typography>
        <Typography variant="body1">
          {hazards.map((hazard, i) => (
            <span key={`${hazard}_${i}`}>
              {i > 0 && ', '}
              {hazard}
            </span>
          ))}
        </Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: colors.accent1['700'] }}>
            Current status: {status}
          </Typography>
          {!isFinished && (
            <Box>
              {status === 'Running' && (
                <Button
                  onClick={onClickStop}
                  variant="contained"
                  color="secondary"
                  startIcon={<Stop />}
                >
                  Stop
                </Button>
              )}
              {status === 'Stopped' && (
                <Button
                  onClick={onClickStart}
                  variant="contained"
                  color="secondary"
                  startIcon={<PlayArrow />}
                >
                  Start
                </Button>
              )}
            </Box>
          )}
          {!isClient && (
            <Button
              variant="contained"
              onClick={onClickFinish}
              sx={{
                maxWidth: 400,
                backgroundColor: '#FCE7E7',
                color: '#FF6651',

                '&:hover, &:focus': {
                  backgroundColor: '#FF6651',
                  color: '#FCE7E7',
                },
              }}
            >
              {isFinished ? `Edit finished sample` : `Finish sample`}
            </Button>
          )}
        </Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ color: colors.accent1['700'], mb: 1 }}
        >
          Sample times
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align={'center'}>Start</TableCell>
                <TableCell align={'center'}>End</TableCell>
                <TableCell align={'center'}>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {captureTimes.map((captureTime, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align={'center'} component="th" scope="row">
                    {formatToLocalTime(captureTime.startTime)}
                  </TableCell>
                  <TableCell align={'center'}>
                    {formatToLocalTime(captureTime.endTime)}
                  </TableCell>
                  <TableCell align={'center'}>
                    {formatDuration(captureTime.duration)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body1" sx={{ mt: 3 }}>
          <Typography variant="body1" component="span" fontWeight="bold" mr={1}>
            Last check:
          </Typography>
          {lastCheck}
        </Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', color: colors.accent1['700'] }}
        >
          TWA method
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          TWA: {twa}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: 'bold', color: colors.accent1['700'] }}
        >
          Flow rate
        </Typography>
        <Typography variant="body1">
          {sampleType === 'noise' &&
            `Initial calibration" (dBA): ${initialFlowRate}`}
          {sampleType === 'chemical' &&
            `Initial flowrate: ${initialFlowRate} L/min`}
        </Typography>
        <Typography variant="body1">
          {sampleType === 'noise' &&
            `Final calibration" (dBA): ${finalFlowRate}`}
          {sampleType === 'chemical' &&
            `Final flowrate: ${finalFlowRate} L/min`}
        </Typography>
        <Typography variant="body1">
          {sampleType === 'noise' &&
            `Average calibration" (dBA): ${averageFlowRate}`}
          {sampleType === 'chemical' &&
            `Average flowrate: ${averageFlowRate} L/min`}
        </Typography>
        <Typography variant="body1">Volume (Liters): {sampleVolume}</Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <Typography variant="h6" sx={{ color: colors.accent1['700'] }}>
            Sample results
          </Typography>
          {sampleType !== 'chemical' && noiseResult?.isOverloaded && (
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
        {sampleType === 'chemical' ? (
          <SampleChemResultDetail
            disable={!isFinished}
            itemList={chemResultList}
            hazardsList={hazardsList}
            unitList={itemList}
            isClient={isClient}
          />
        ) : (
          <SampleNoiseResultDetail
            item={noiseResult}
            isClient={isClient}
            disable={!isFinished}
          />
        )}
      </Box>
      {!isClient && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button color="secondary" variant="contained" onClick={onClickEdit}>
            Edit Sample
          </Button>
        </Box>
      )}
    </Box>
  );
}
