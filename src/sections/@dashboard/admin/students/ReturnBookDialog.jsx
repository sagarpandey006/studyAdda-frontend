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
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
  Box
} from "@mui/material";

import Label from '../../../../components/label';
import { borrowalApi } from '../../../../services/api';

//

const ReturnBookDialog = ({ open, onClose, student, issuedBooks, onSuccess }) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedBook = issuedBooks.find(book => book._id === selectedBookId);
  const fine = selectedBook?.fine || selectedBook?.calculatedFine || 0;

  const handleReturnBook = async () => {
    if (!selectedBookId) {
      toast.error("Please select a book");
      return;
    }

    try {
      setLoading(true);
      await borrowalApi.returnBook({
        bookId: selectedBookId,   // this is the borrowal _id
        returnDate: new Date(),
        fine
      });

      toast.success("Book returned successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to return book");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBookId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Return Book</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Student Name"
            value={student?.fullName || ''}
            disabled
          />

          <TextField
            fullWidth
            label="Scholar Number"
            value={student?.scholarNumber || ''}
            disabled
          />

          <TextField
            select
            fullWidth
            label="Select Book to Return"
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
          >
            {issuedBooks.map((book) => (
              <MenuItem key={book._id} value={book._id}>
                {book.bookName || book.bookId?.name || 'Unknown'} — Issued: {new Date(book.issueDate).toLocaleDateString()}
                {book.isOverdue && ` (Overdue: ${book.lateDays} days)`}
              </MenuItem>
            ))}
          </TextField>

          {selectedBook && (
            <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Issue Date:</Typography>
                  <Typography variant="body2">{new Date(selectedBook.issueDate).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Due Date:</Typography>
                  <Typography variant="body2">{new Date(selectedBook.dueDate).toLocaleDateString()}</Typography>
                </Box>
                {selectedBook.isOverdue && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Late Days:</Typography>
                      <Label color="error">{selectedBook.lateDays} days</Label>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Fine Amount:</Typography>
                      <Typography variant="h6" color="error.main">₹{fine.toFixed(2)}</Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Box>
          )}

          {fine > 0 && (
            <Alert severity="warning">
              A fine of ₹{fine.toFixed(2)} will be added to the student's account.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleReturnBook}
          disabled={loading || !selectedBookId}
        >
          {loading ? <CircularProgress size={24} /> : 'Return Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnBookDialog;
