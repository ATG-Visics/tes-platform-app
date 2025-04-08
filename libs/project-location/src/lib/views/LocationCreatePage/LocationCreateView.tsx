import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Toolbar,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  IProjectLocation,
  IProjectLocationCreatePayload,
  useCreateProjectLocationMutation,
} from '../../api';
import { schema, uiSchema } from './Schemas';
import { useCallback, useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { TransitionsModal } from '@tes/ui/core';
import { FormTheme } from '@tes/ui/form';
import { IClient } from '@tes/client';
import { extraRenderers } from '@tes/jsonforms-extensions';

interface IProps {
  handleClose: () => void;
  open: boolean;
  projectRecord: {
    id: string;
    client: IClient;
  };
  refetch: () => void;
}

export function ProjectLocationCreatePage(props: IProps) {
  const { open: modalOpen, handleClose, projectRecord, refetch } = props;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [data, setData] = useState<Partial<IProjectLocationCreatePayload>>({
    project: projectRecord.id,
  });

  const handleErrorClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const {
    jsonformProps: baseJsonformProps,
    formStatus,
    hasFormErrors,
  } = useForm<IProjectLocationCreatePayload, IProjectLocation>({
    schema,
    uischema: uiSchema,
    recordStatus: RECORD_STATUS.SUCCEEDED,
    isNewRecord: true,
    data,
    setData,
    extraRenderers,
  });

  const submitSuccessHandler = useCallback(
    (successData) => {
      if (!successData) {
        return;
      }
      handleClose();
      refetch();
    },
    [handleClose, refetch],
  );

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord: true,
    data,
    recordId: '',
    submitSuccessHandler,
    useCreateMutation: useCreateProjectLocationMutation,
  });

  useEffect(() => {
    if (!projectRecord) {
      return;
    }

    if (!projectRecord.client) {
      return;
    }

    if (!data.addressSameAs) {
      setData((prevState) => ({
        ...prevState,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      }));
      return;
    }

    setData((prevState) => ({
      ...prevState,
      addressLine1: projectRecord.client.addressLine1,
      addressLine2: projectRecord.client.addressLine2,
      city: projectRecord.client.city,
      state: projectRecord.client.state,
      postalCode: projectRecord.client.postalCode,
      country: projectRecord.client.country,
    }));
  }, [data.addressSameAs, projectRecord]);

  useEffect(() => {
    if (!projectRecord) {
      return;
    }

    if (!projectRecord.client) {
      return;
    }

    if (!data.contactSameAs) {
      setData((prevState) => ({
        ...prevState,
        contactPerson: '',
        email: '',
        phone: '',
      }));
      return;
    }

    setData((prevState) => ({
      ...prevState,
      contactPerson: projectRecord.client.contactPerson,
      email: projectRecord.client.email,
      phone: projectRecord.client.phone,
    }));
  }, [data.contactSameAs, projectRecord]);

  return (
    <>
      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={isOpen}
          handleClose={handleErrorClose}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={<CircularProgress />}
          open={isOpen}
          handleClose={handleErrorClose}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={(_event, reason) => {
          if (reason === 'escapeKeyDown') {
            handleClose();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ px: { xs: 2, md: 0 } }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '720px',
            height: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
          }}
        >
          <AppBar color="secondary">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="#fff">
                Add Project Location
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon sx={{ fill: '#fff' }} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box mb={6} />
          <form onSubmit={onFormSubmit}>
            {formStatus === FORM_STATUS.SUCCEEDED && (
              <FormTheme>
                <JsonForms {...baseJsonformProps} />
              </FormTheme>
            )}
            <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={hasFormErrors}
              >
                Create new Location
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
