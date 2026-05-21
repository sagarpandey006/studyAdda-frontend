import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Drawer,
  Stack,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import Iconify from '../iconify';

// 

FilterDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onApply: PropTypes.func,
  onReset: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default function FilterDrawer({
  open = false,
  onClose,
  onApply,
  onReset,
  children,
  title = 'Filters',
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 320, border: 'none', overflow: 'hidden' },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 2 }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>

      <Divider />

      <Box sx={{ p: 3, overflow: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
        {children}
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            color="inherit"
            startIcon={<Iconify icon="eva:refresh-outline" />}
            onClick={onReset}
          >
            Reset
          </Button>
          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<Iconify icon="eva:checkmark-fill" />}
            onClick={onApply}
          >
            Apply
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
