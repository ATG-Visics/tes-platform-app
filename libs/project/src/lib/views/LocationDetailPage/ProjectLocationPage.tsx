import { PageNotFound, TransitionsModal } from '@tes/ui/core';
import {
  FORM_STATUS,
  RECORD_STATUS,
  SUBMISSION_STATUS,
  useForm,
  useRecord,
  useSubmitHandler,
} from '@tes/utils-hooks';
import {
  IProject,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from '../../api';
import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { schema, uiSchema } from './Schemas';
import { JsonForms } from '@jsonforms/react';
import { extraRenderers } from '@tes/jsonforms-extensions';
import { useSelector } from 'react-redux';
import { selectIsClient } from '@tes/accounts';

export function ProjectLocationPage() {
  const isClient = useSelector(selectIsClient);
  const [data, setData] = useState<Partial<IProject>>({});
  const [open, setOpen] = useState<boolean>(true);
  const [canEdit, setCanEdit] = useState<boolean>(false);

  const {
    record: item,
    recordStatus,
    isNewRecord,
    recordId,
    refetch,
  } = useRecord({
    useRecordQuery: useGetProjectByIdQuery,
  });

  const { jsonformProps, formStatus } = useForm({
    schema,
    uischema: uiSchema,
    recordStatus,
    isNewRecord,
    record: item,
    data,
    setData,
    extraRenderers,
  });

  const submitSuccessHandler = useCallback(() => {
    setCanEdit(false);
    refetch();
  }, [refetch]);

  const { submissionStatus, onFormSubmit, submissionError } = useSubmitHandler({
    isNewRecord,
    data: { ...data, client: data?.client?.id },
    recordId,
    submitSuccessHandler,
    useUpdateMutation: useUpdateProjectMutation,
  });

  if (!item) {
    return <PageNotFound />;
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      {recordStatus === RECORD_STATUS.FAILED && <PageNotFound />}

      {submissionStatus === SUBMISSION_STATUS.FAILED && (
        <TransitionsModal
          title="An error occurred on the server"
          description="Please try to submit the form again"
          errorList={submissionError?.data as { [key: string]: [string] }}
          showButton
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {submissionStatus === SUBMISSION_STATUS.SAVING && (
        <TransitionsModal
          description={
            <Box
              sx={{
                display: 'flex',
                flexFlow: 'column nowrap',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography mb={3} variant="h5">
                Is loading
              </Typography>
              <CircularProgress />
            </Box>
          }
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}

      {recordStatus === RECORD_STATUS.SUCCEEDED &&
        formStatus === FORM_STATUS.SUCCEEDED && (
          <Box mt={4}>
            <Grid container spacing={{ xs: 2, md: 3 }} mb={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" mb={2}>
                  Drawing of the work area
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: 'inline-flex', justifyContent: 'flex-end' }}
              >
                {!isClient && (
                  <Button
                    sx={{ height: 'fit-content' }}
                    variant="contained"
                    onClick={() => setCanEdit(true)}
                  >
                    <EditIcon sx={{ mr: 1 }} />
                    Edit Drawing
                  </Button>
                )}
              </Grid>
            </Grid>

            <form onSubmit={onFormSubmit}>
              <JsonForms
                {...jsonformProps}
                readonly={!canEdit}
                validationMode="NoValidation"
              />

              {canEdit && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button color="primary" variant="contained" type="submit">
                    save drawing
                  </Button>
                </Box>
              )}
            </form>
          </Box>
        )}
    </Container>
  );
}
