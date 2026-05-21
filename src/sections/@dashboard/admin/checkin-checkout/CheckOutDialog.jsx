import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  Alert
} from '@mui/material';
import Iconify from '../../../../components/iconify';

// 

CheckOutDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCheckOut: PropTypes.func,
  checkInData: PropTypes.object,
};

export default function CheckOutDialog({ open, onClose, onCheckOut, checkInData }) {
  const handleCheckOut = () => {
    onCheckOut();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:logout" width={24} />
          <Typography variant="h6">Check Out Student</Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Alert severity="info" icon={<Iconify icon="mdi:information" />}>
            Confirm check-out for this student
          </Alert>

          {checkInData && (
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Student Name:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {checkInData.student?.name || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Scholar Number:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {checkInData.student?.scholarNumber || 'N/A'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Check-In Time:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {checkInData.checkInTime
                    ? new Date(checkInData.checkInTime).toLocaleString()
                    : 'N/A'}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Time Spent:
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary.main">
                  {(() => {
                    if (!checkInData.checkInTime) return 'N/A';
                    const now = new Date();
                    const checkIn = new Date(checkInData.checkInTime);
                    const diffMs = now - checkIn;
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                    return `${hours}h ${minutes}m`;
                  })()}
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCheckOut} variant="contained" color="primary">
          Confirm Check Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}
