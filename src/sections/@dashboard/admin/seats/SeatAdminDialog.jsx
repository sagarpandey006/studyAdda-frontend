import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

export default function SeatAdminDialog({ open, onClose, onSubmit, seat }) {
  const [formData, setFormData] = useState({
    seatNumber: seat?.seatNumber || '',
    floor: seat?.floor || 1,
    section: seat?.section || 'A',
    status: seat?.status || 'available',
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{seat ? 'Edit Seat' : 'Create New Seat'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Seat Number"
            value={formData.seatNumber}
            onChange={handleChange('seatNumber')}
            fullWidth
            required
            helperText="Format: {Floor}{Section}{Number} (e.g., 1A01)"
          />

          <FormControl fullWidth required>
            <InputLabel>Floor</InputLabel>
            <Select
              value={formData.floor}
              label="Floor"
              onChange={handleChange('floor')}
            >
              <MenuItem value={1}>Floor 1</MenuItem>
              <MenuItem value={2}>Floor 2</MenuItem>
              <MenuItem value={3}>Floor 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Section</InputLabel>
            <Select
              value={formData.section}
              label="Section"
              onChange={handleChange('section')}
            >
              <MenuItem value="A">Section A</MenuItem>
              <MenuItem value="B">Section B</MenuItem>
              <MenuItem value="C">Section C</MenuItem>
              <MenuItem value="D">Section D</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={handleChange('status')}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {seat ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SeatAdminDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  seat: PropTypes.object,
};
