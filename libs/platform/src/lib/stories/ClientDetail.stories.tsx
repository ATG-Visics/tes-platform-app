import { defaultDecorators } from '@tes/storybook';
import { Meta } from '@storybook/react';
import { ClientHeaderFilledIn as ClientHeaderStory } from './ClientHeader.stories';
import { Box, Container, Typography } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { ListWithItems as ListWithItemsStory } from './FullWidthListCard.stories';
import { Button } from '@tes/ui/core';

export default {
  title: 'TES / Client ',
  decorators: defaultDecorators,
  parameters: {},
} as Meta;

export function ClientDetail() {
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
            Access Technology Group
          </Typography>

          <Button variant="contained" startIcon={<EditIcon />}>
            Edit client
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

      <Box sx={{ mb: 3 }}>
        <ClientHeaderStory {...ClientHeaderStory.args} />
      </Box>

      <Box>
        <ListWithItemsStory {...ListWithItemsStory.args} />
      </Box>
    </Container>
  );
}
