import { Box, Card, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface IProps {
  title: string;
  surveyList: Array<unknown>;
  emptySurveyText?: string;
  hasDetailButton?: boolean;
  hasItemList?: boolean;
  onItemClick?: () => void;
  handelDownload?: () => void;
  itemId?: string;
}

export type ProjectLocationCardProps = IProps;

export function ProjectLocationCard(props: IProps) {
  const { title, itemId, handelDownload, hasDetailButton, onItemClick } = props;

  return (
    <Card sx={{ p: 2, mt: 3, height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          height: '100%',
        }}
      >
        <Typography variant={'h6'} sx={{ textAlign: 'center' }}>
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          {handelDownload && itemId && (
            <Button variant="text" onClick={handelDownload}>
              Download Excel
            </Button>
          )}

          {hasDetailButton && (
            <Button variant="contained" onClick={onItemClick}>
              Open location <ArrowForwardIcon />
            </Button>
          )}
        </Box>
      </Box>

      {/* TODO Fix so that the most recent sample are displayed */}
      {/*{hasItemList && (*/}
      {/*  <Box>*/}
      {/*    <List>*/}
      {/*      {surveyList.length > 0 ? (*/}
      {/*        surveyList.map((_, index) => (*/}
      {/*          // TODO Set here the survey info right*/}
      {/*          <ListItem*/}
      {/*            key={index}*/}
      {/*            secondaryAction={*/}
      {/*              <IconButton aria-label="comment">*/}
      {/*                <MoreVertIcon />*/}
      {/*              </IconButton>*/}
      {/*            }*/}
      {/*          >*/}
      {/*            <ListItemText primary="Survey" secondary="Survey subtitle" />*/}
      {/*          </ListItem>*/}
      {/*        ))*/}
      {/*      ) : (*/}
      {/*        <ListItem sx={{ paddingLeft: 0 }}>*/}
      {/*          <ListItemText*/}
      {/*            sx={{*/}
      {/*              fontSize: '14px',*/}
      {/*              color: 'rgb(0 0 0 / 60%)',*/}
      {/*              lineHeight: 1.5,*/}
      {/*            }}*/}
      {/*            primary={emptySurveyText || ''}*/}
      {/*          />*/}
      {/*        </ListItem>*/}
      {/*      )}*/}
      {/*    </List>*/}
      {/*  </Box>*/}
      {/*)}*/}
    </Card>
  );
}
