import PropTypes from 'prop-types';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Iconify from '../iconify';

// 

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 320,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 360,
    boxShadow: theme.customShadows?.z8 || `0 8px 16px 0 ${alpha(theme.palette.grey[500], 0.16)}`,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// 

TableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterValue: PropTypes.string,
  onFilterChange: PropTypes.func,
  onFilterOpen: PropTypes.func,
  onExport: PropTypes.func,
  onBulkDelete: PropTypes.func,
  placeholder: PropTypes.string,
  showFilter: PropTypes.bool,
  showExport: PropTypes.bool,
};

export default function TableToolbar({
  numSelected = 0,
  filterValue = '',
  onFilterChange,
  onFilterOpen,
  onExport,
  onBulkDelete,
  placeholder = 'Search...',
  showFilter = true,
  showExport = true,
}) {
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterValue}
          onChange={onFilterChange}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      <Stack direction="row" spacing={1}>
        {numSelected > 0 ? (
          <>
            {onBulkDelete && (
              <Tooltip title="Delete selected">
                <IconButton onClick={onBulkDelete}>
                  <Iconify icon="eva:trash-2-outline" />
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          <>
            {showExport && onExport && (
              <Tooltip title="Export to CSV">
                <IconButton onClick={onExport}>
                  <Iconify icon="eva:download-outline" />
                </IconButton>
              </Tooltip>
            )}
            {showFilter && onFilterOpen && (
              <Tooltip title="Filter list">
                <IconButton onClick={onFilterOpen}>
                  <Iconify icon="ic:round-filter-list" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Stack>
    </StyledRoot>
  );
}
