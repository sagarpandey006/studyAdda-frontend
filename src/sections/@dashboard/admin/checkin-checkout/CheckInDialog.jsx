import PropTypes from 'prop-types';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { useState } from 'react';
import Iconify from '../../../../components/iconify';

// 

CheckInDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCheckIn: PropTypes.func,
  rfidScanning: PropTypes.bool,
  onStartScan: PropTypes.func,
};

export default function CheckInDialog({ open, onClose, onCheckIn, rfidScanning, onStartScan }) {
  const [rfidCard, setRfidCard] = useState('');
  const [manualMode, setManualMode] = useState(false);

  const handleSubmit = () => {
    if (rfidCard.trim()) {
      onCheckIn(rfidCard);
      setRfidCard('');
      setManualMode(false);
    }
  };

  const handleClose = () => {
    setRfidCard('');
    setManualMode(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:login" width={24} />
          <Typography variant="h6">Check In Student</Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {!manualMode ? (
            <>
              <Alert severity="info" icon={<Iconify icon="mdi:information" />}>
                Tap the student's RFID card on the scanner to check them in
              </Alert>

              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    rfidScanning ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Iconify icon="mdi:nfc" width={24} />
                    )
                  }
                  onClick={onStartScan}
                  disabled={rfidScanning}
                  sx={{ py: 2, px: 4 }}
                >
                  {rfidScanning ? 'Scanning...' : 'Start RFID Scan'}
                </Button>
              </Box>

              <Divider>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                variant="outlined"
                onClick={() => setManualMode(true)}
                startIcon={<Iconify icon="mdi:keyboard" />}
              >
                Enter RFID Manually
              </Button>
            </>
          ) : (
            <>
              <Alert severity="warning" icon={<Iconify icon="mdi:alert" />}>
                Manual mode: Enter the RFID card number manually
              </Alert>

              <TextField
                fullWidth
                label="RFID Card Number"
                value={rfidCard}
                onChange={(e) => setRfidCard(e.target.value)}
                placeholder="Enter RFID card number..."
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />

              <Button
                variant="text"
                onClick={() => setManualMode(false)}
                startIcon={<Iconify icon="mdi:arrow-left" />}
              >
                Back to Scanner Mode
              </Button>
            </>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        {manualMode && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!rfidCard.trim()}
          >
            Check In
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
