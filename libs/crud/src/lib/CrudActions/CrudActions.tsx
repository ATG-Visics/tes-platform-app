import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SearchField } from '@tes/ui/core';

interface IProps {
  addLabel: string;
  searchFieldPlaceholder?: string;
  searchValue?: string;
  onSearchChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onAddClick: () => void;
  showAddButton?: boolean;
}

export type CrudActionsProps = IProps;

export function CrudActions(props: IProps) {
  const {
    addLabel,
    searchFieldPlaceholder,
    searchValue,
    onSearchChange,
    onAddClick,
    showAddButton = true,
  } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        justifyItems: 'space-between',
        minWidth: 0,
        flexShrink: 0,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <SearchField
        placeholder={searchFieldPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      />

      {showAddButton && (
        <Button
          color="primary"
          variant="contained"
          disableElevation
          onClick={() => onAddClick()}
          startIcon={<AddIcon />}
        >
          {addLabel}
        </Button>
      )}
    </Box>
  );
}

CrudActions.defaultProps = {
  searchFieldPlaceholder: '',
  searchValue: '',
};
