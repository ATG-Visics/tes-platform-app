import { defaultDecorators } from '@tes/storybook';
import { Meta, Story } from '@storybook/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import samplesFixtures from './fixtures/samples.fixtures';
import { FallbackListItem, FallbackListItemProps } from '../ui';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps extends FallbackListItemProps {
  // insert addition story prop types here
}

export default {
  title: 'TES / Survey Dashboard / Area sample subject list',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

const AreaSampleSubjectsTemplate: Story<IProps> = (args) => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Typography variant="h6">Samples & Subjects</Typography>
        <Button variant="contained" onClick={() => void 0}>
          <AddIcon sx={{ marginRight: '8px' }} />
          Add Subject
        </Button>
      </Box>

      <List sx={{ width: '100%' }}>
        {args.itemList.map((item) => (
          <Card
            key={item.id}
            sx={{ mb: 4, width: '100%', backgroundColor: '#EBEBEB' }}
          >
            <CardHeader
              sx={{ backgroundColor: '#fff' }}
              action={<Button>Add sample</Button>}
              title={item.title}
            />
            <CardContent sx={{ py: 0 }}>
              {item.samples ? (
                item.samples.map((subItem) => (
                  <FallbackListItem key={subItem.id} item={subItem} />
                ))
              ) : (
                <Typography sx={{ mt: 2 }} variant="body1">
                  No samples found
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </List>
    </>
  );
};

export const AreaSampleSubjects = AreaSampleSubjectsTemplate.bind({});

AreaSampleSubjects.args = {
  emptyMessage: 'No area samples found',
  surveyId: '1',
  itemList: samplesFixtures,
};

export const EmptyAreaSampleSubjects = AreaSampleSubjectsTemplate.bind({});

EmptyAreaSampleSubjects.args = {
  emptyMessage: 'No area samples found',
  surveyId: '1',
  itemList: [
    {
      id: '1',
      title: 'Wouter de Lange',
      samples: undefined,
    },
  ],
};
