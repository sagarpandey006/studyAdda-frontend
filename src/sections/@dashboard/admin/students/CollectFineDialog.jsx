import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Typography,
  Box,
  MenuItem
} from "@mui/material";

import { paymentApi } from '../../../../services/api';

//

const CollectFineDialog = ({ open, onClose, student, onSuccess }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const unpaidFine = student?.unpaidFine || 0;

  const handleCollectFine = async () => {
    const amount = parseFloat(paymentAmount);

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > unpaidFine) {
      toast.error("Amount cannot exceed unpaid fine");
      return;
    }

    try {
      setLoading(true);
      await paymentApi.collectFine({
        studentId: student._id,
        amount,
        paymentMethod,
        receiptNumber,
        paymentDate: new Date()
      });

      toast.success("Fine collected successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to collect fine");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentAmount('');
    setPaymentMethod('Cash');
    setReceiptNumber('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Collect Fine</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField fullWidth label="Student Name" value={student?.fullName || ''} disabled />
          <TextField fullWidth label="Scholar Number" value={student?.scholarNumber || ''} disabled />

          <Box sx={{ p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Total Unpaid Fine</Typography>
            <Typography variant="h4" color="warning.main">₹{unpaidFine.toFixed(2)}</Typography>
          </Box>

          <TextField
            fullWidth
            label="Payment Amount"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            helperText={`Maximum: ₹${unpaidFine.toFixed(2)}`}
            inputProps={{ min: 0, max: unpaidFine, step: 0.01 }}
          />

          <TextField
            select
            fullWidth
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Net Banking">Net Banking</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Receipt Number (Optional)"
            value={receiptNumber}
            onChange={(e) => setReceiptNumber(e.target.value)}
            placeholder="e.g., RCP-2024-001"
          />

          {paymentAmount && parseFloat(paymentAmount) < unpaidFine && (
            <Typography variant="caption" color="text.secondary">
              Remaining Fine: ₹{(unpaidFine - parseFloat(paymentAmount)).toFixed(2)}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleCollectFine}
          disabled={loading || !paymentAmount}
        >
          {loading ? <CircularProgress size={24} /> : 'Collect Fine'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollectFineDialog;
