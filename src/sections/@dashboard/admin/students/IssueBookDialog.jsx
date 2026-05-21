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
  Autocomplete,
  CircularProgress
} from "@mui/material";

import { borrowalApi } from '../../../../services/api';

//

const IssueBookDialog = ({ open, onClose, student, onSuccess }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchBooks = async (searchText) => {
    if (searchText.length < 2) return;

    try {
      setSearchLoading(true);
      const availableBooks = await borrowalApi.searchAvailableBooks(searchText);
      setBooks(availableBooks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to search books");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleIssueBook = async () => {
    if (!selectedBook) {
      toast.error("Please select a book");
      return;
    }

    try {
      setLoading(true);
      await borrowalApi.issueBook({
        studentId: student._id,
        bookId: selectedBook._id,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      });

      toast.success("Book issued successfully!");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBook(null);
    setBooks([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Issue New Book</DialogTitle>

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
            fullWidth
            label="Available Book Limit"
            value={student?.availableBookLimit || 0}
            disabled
          />

          <Autocomplete
            fullWidth
            options={books}
            getOptionLabel={(option) => `${option.name} (${option.isbn})`}
            loading={searchLoading}
            value={selectedBook}
            onChange={(event, newValue) => setSelectedBook(newValue)}
            onInputChange={(event, newInputValue) => {
              handleSearchBooks(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Book"
                placeholder="Type to search books..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleIssueBook}
          disabled={loading || !selectedBook || student?.availableBookLimit <= 0}
        >
          {loading ? <CircularProgress size={24} /> : 'Issue Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IssueBookDialog;
