import { defaultDecorators } from '@tes/storybook';
import { Meta } from '@storybook/react';
import { Box, Container, Typography } from '@mui/material';
import {
  ProjectInfo as ProjectInfoStory,
  ContactInfo as ContactInfoStory,
} from '../stories/ProjectInfoList.stories';
import { Button } from '@tes/ui/core';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { ProjectLocationCard } from '../ui';

export default {
  title: 'TES / Project / Project detail',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

export function ProjectDetail() {
  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5" sx={{}}>
            2021 Industrial Hygiene Monitoring for Access Technology Group
          </Typography>

          <Button variant="contained" startIcon={<EditIcon />}>
            Edit Project
          </Button>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ maxWidth: 720 }}>
            Distinctively target long-term high-impact manufactured products
            whereas resource sucking strategic theme areas. Proactively evolve
            emerging meta-services with high standards in deliverables.
            Objectively visualize open-source interfaces vis-a-vis dynamic human
            capital. Seamlessly develop wireless functionalities for
            client-focused alignments. Efficiently simplify leading-edge
            architectures for accurate models.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        <ProjectInfoStory {...ProjectInfoStory.args} />

        <ContactInfoStory {...ContactInfoStory.args} />
      </Box>

      <Box sx={{ minHeight: 300 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Typography variant="h5" sx={{}}>
            Project Locations
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />}>
            Add Project location
          </Button>
        </Box>

        <ProjectLocationCard
          title="Project location 'Zaltbommel Lab'"
          surveyList={[]}
          emptySurveyText="No surveys have been taken."
        />
      </Box>
    </Container>
  );
}
