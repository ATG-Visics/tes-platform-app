import { Box, Modal } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModalTitleBar } from '@tes/ui/core';
import { SamplingPlanCreateForm } from '../../ui';
import { useCustomNavigate } from '@tes/router';

export function SamplingPlanCreatePage() {
  const [open] = useState<boolean>(true);
  const { navigateToRoute } = useCustomNavigate();

  const { id = '', samplingPlanId = '' } = useParams();

  const onClose = () => {
    navigateToRoute('samplingPlanList', {
      params: {
        id,
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="sampling-plan-scenario-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '1000px',
          height: 'calc(100% - 24px)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
        }}
      >
        <ModalTitleBar
          title={`${samplingPlanId ? 'Update' : 'Create'} scenario`}
          onClose={onClose}
        />
        <Box sx={{ mx: 4, mb: 2, py: 4 }}>
          <SamplingPlanCreateForm />
        </Box>
      </Box>
    </Modal>
  );
}
