import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { FormTheme } from '@tes/ui/form';
import { JsonForms } from '@jsonforms/react';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonFormsRendererRegistryEntry, JsonSchema } from '@jsonforms/core';
import { GroupItem } from '../../hooks';
import { Dispatch, FormEvent, SetStateAction } from 'react';
import { IAnswerBulkPayload } from '../../api';

interface IProps {
  item: GroupItem;
  onFormSubmit: (e: FormEvent) => void;
  renderers: JsonFormsRendererRegistryEntry[];
  data: Partial<IAnswerBulkPayload>;
  setData: Dispatch<SetStateAction<Partial<IAnswerBulkPayload>>>;
}

export function GroupAccordion(props: IProps) {
  const { item, onFormSubmit, renderers, data, setData } = props;
  return (
    <Box mt={3} key={item.title}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
          sx={{
            backgroundColor: '#535063',
            color: '#fff',
            height: '60px',
            fontSize: '20px',
          }}
        >
          {item.title}
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 2 }}>
          <Box component="form" onSubmit={onFormSubmit}>
            <FormTheme>
              <JsonForms
                renderers={renderers}
                cells={materialCells}
                data={data}
                validationMode={'ValidateAndShow'}
                onChange={({ data: updatedData }) => {
                  setData(updatedData);
                }}
                schema={item.questionSchema as JsonSchema}
                uischema={item.questionUISchema}
              />
            </FormTheme>

            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ mt: 1, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
