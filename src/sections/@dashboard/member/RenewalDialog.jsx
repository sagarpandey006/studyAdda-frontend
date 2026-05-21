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
  Chip,
  Divider,
} from '@mui/material';
import toast from 'react-hot-toast';
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import { memberApi } from '../../../services/api';

RenewalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  borrowal: PropTypes.object,
  onRenewal: PropTypes.func,
};

export default function RenewalDialog({ open, onClose, borrowal, onRenewal }) {
  const [processing, setProcessing] = useState(false);

  if (!borrowal) return null;

  const {
    book,
    issueDate,
    dueDate,
    renewalCount = 0,
    maxRenewals = 3,
    fineAmount = 0,
  } = borrowal;

  const canRenew = renewalCount < maxRenewals && fineAmount === 0;
  const newDueDate = new Date(dueDate);
  newDueDate.setDate(newDueDate.getDate() + 15); // Add 15 days

  const handleRenewal = async () => {
    setProcessing(true);
    try {
      await memberApi.renewBook(borrowal._id);
      if (onRenewal) {
        await onRenewal(borrowal._id);
      }
      toast.success('Book renewed successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to renew book');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:refresh-outline" width={24} height={24} />
          <Typography variant="h6">Renew Book</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Book Details */}
          <Box>
            <Typography variant="h6" gutterBottom>
              {book?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {book?.author?.name}
            </Typography>
          </Box>

          <Divider />

          {/* Current Details */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Current Details
            </Typography>
            <Stack spacing={1}>
              <DetailRow label="Issue Date" value={fDate(issueDate)} />
              <DetailRow label="Current Due Date" value={fDate(dueDate)} />
              <DetailRow 
                label="Renewals Used" 
                value={
                  <Chip 
                    label={`${renewalCount}/${maxRenewals}`} 
                    size="small" 
                    color={renewalCount >= maxRenewals ? 'error' : 'primary'}
                  />
                } 
              />
              {fineAmount > 0 && (
                <DetailRow 
                  label="Pending Fine" 
                  value={
                    <Chip 
                      label={`₹${fineAmount}`} 
                      size="small" 
                      color="error"
                    />
                  } 
                />
              )}
            </Stack>
          </Box>

          {/* New Due Date */}
          {canRenew && (
            <Box sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" color="primary.dark">
                  New Due Date
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {fDate(newDueDate)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Book will be extended for 15 more days
              </Typography>
            </Box>
          )}

          {/* Warnings/Info */}
          {!canRenew && (
            <Alert severity="error">
              {fineAmount > 0 
                ? 'Please clear your pending fine before renewing this book.'
                : 'You have reached the maximum number of renewals for this book.'}
            </Alert>
          )}

          {canRenew && renewalCount === maxRenewals - 1 && (
            <Alert severity="warning">
              This is your last renewal. Please return the book by the new due date.
            </Alert>
          )}

          {canRenew && renewalCount < maxRenewals - 1 && (
            <Alert severity="info">
              You can renew this book {maxRenewals - renewalCount - 1} more time(s) after this renewal. 
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleRenewal}
          disabled={!canRenew || processing}
          startIcon={<Iconify icon="eva:refresh-outline" />}
        >
          {processing ? 'Renewing...' : 'Renew Book'}
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
