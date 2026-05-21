import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
import toast from 'react-hot-toast';
import { fDateTime } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';

CancelReservationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reservation: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function CancelReservationDialog({ open, onClose, reservation, onCancel }) {
  const [processing, setProcessing] = useState(false);

  if (!reservation) return null;

  const {
    seatNumber,
    startTime,
    endTime,
    location,
  } = reservation;

  const canCancel = new Date(startTime) > new Date(); // Can only cancel future reservations

  const handleCancel = async () => {
    setProcessing(true);
    try {
      if (onCancel) {
        await onCancel(reservation._id);
      }
      toast.success('Reservation cancelled successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to cancel reservation');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:close-circle-outline" width={24} height={24} color="error.main" />
          <Typography variant="h6">Cancel Reservation</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Reservation Details */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Seat {seatNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Box>

          <Divider />

          {/* Booking Details */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Booking Details
            </Typography>
            <Stack spacing={1}>
              <DetailRow label="Start Time" value={startTime ? fDateTime(startTime) : '—'} />
              <DetailRow label="End Time" value={endTime ? fDateTime(endTime) : '—'} />
            </Stack>
          </Box>

          {/* Warning/Info */}
          {!canCancel ? (
            <Alert severity="error">
              This reservation has already started or passed. You cannot cancel it anymore.
            </Alert>
          ) : (
            <Alert severity="warning">
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {canCancel ? 'Go Back' : 'Close'}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCancel}
          disabled={!canCancel || processing}
          startIcon={<Iconify icon="eva:close-outline" />}
        >
          {processing ? 'Cancelling...' : 'Cancel Reservation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Stack>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};
