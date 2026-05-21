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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  TextField,
} from '@mui/material';
import toast from 'react-hot-toast';
import Iconify from '../../../components/iconify';

FinePaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fineAmount: PropTypes.number,
  borrowalDetails: PropTypes.object,
  onPayment: PropTypes.func,
};

export default function FinePaymentDialog({ open, onClose, fineAmount = 0, borrowalDetails, onPayment }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    if (paymentMethod === 'cash') {
      toast.success(`Please visit the library counter to pay ₹${fineAmount} in cash.`);
      setUpiId('');
      setPaymentMethod('upi');
      onClose();
      return;
    }

    setProcessing(true);
    try {
      if (onPayment) {
        onPayment(fineAmount, paymentMethod);
      }
      toast.success(`Payment request of ₹${fineAmount} submitted via ${paymentMethod}. Visit counter to confirm payment.`);
      setUpiId('');
      setPaymentMethod('upi');
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:currency-inr" width={24} height={24} />
          <Typography variant="h6">Pay Fine</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Fine Amount */}
          <Box sx={{ p: 3, bgcolor: 'error.lighter', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="error.dark">
              Total Fine Amount
            </Typography>
            <Typography variant="h3" color="error.main" sx={{ my: 1 }}>
              ₹{fineAmount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Overdue charges for library books
            </Typography>
          </Box>

          {/* Book Details */}
          {borrowalDetails && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Fine Details
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                <DetailRow label="Book" value={borrowalDetails.book?.name || 'Multiple Books'} />
                <DetailRow label="Days Overdue" value={borrowalDetails.daysOverdue || 'N/A'} />
                <DetailRow label="Fine per Day" value="₹5" />
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Payment Method Selection */}
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <Typography variant="subtitle2">Select Payment Method</Typography>
            </FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                value="upi"
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="simple-icons:paytm" width={20} height={20} />
                    <Typography variant="body2">UPI (GPay, PhonePe, Paytm)</Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="eva:credit-card-outline" width={20} height={20} />
                    <Typography variant="body2">Credit/Debit Card</Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="netbanking"
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="mdi:bank" width={20} height={20} />
                    <Typography variant="body2">Net Banking</Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="mdi:cash" width={20} height={20} />
                    <Typography variant="body2">Cash (Library Counter)</Typography>
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>

          {/* UPI ID Input */}
          {paymentMethod === 'upi' && (
            <TextField
              fullWidth
              label="UPI ID"
              placeholder="yourname@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              InputProps={{
                startAdornment: <Iconify icon="simple-icons:paytm" width={20} height={20} sx={{ mr: 1 }} />,
              }}
            />
          )}

          {/* Card Payment Info */}
          {paymentMethod === 'card' && (
            <Alert severity="info">
              You will be redirected to a secure payment gateway to complete your card payment.
            </Alert>
          )}

          {/* Net Banking Info */}
          {paymentMethod === 'netbanking' && (
            <Alert severity="info">
              You will be redirected to your bank's website to complete the payment.
            </Alert>
          )}

          {/* Cash Payment Info */}
          {paymentMethod === 'cash' && (
            <Alert severity="warning">
              Please visit the library counter to pay the fine in cash. A receipt will be provided.
            </Alert>
          )}

          {/* Important Note */}
          <Alert severity="info" icon={<Iconify icon="eva:info-outline" />}>
            <Typography variant="caption">
              After payment, you will receive a confirmation email and the fine will be cleared from your account immediately.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={processing}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePayment}
          disabled={processing}
          startIcon={processing ? <Iconify icon="eos-icons:loading" /> : <Iconify icon="mdi:currency-inr" />}
        >
          {processing ? 'Processing...' : `Pay ₹${fineAmount}`}
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
