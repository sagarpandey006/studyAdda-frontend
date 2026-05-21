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
  Alert,
  Typography
} from "@mui/material";

import { userApi } from '../../../../services/api';

//

const BlockStudentDialog = ({ open, onClose, student, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const isBlocked = student?.status === 'Blocked';

  const handleToggleBlock = async () => {
    if (!isBlocked && !reason.trim()) {
      toast.error("Please provide a reason for blocking");
      return;
    }

    try {
      setLoading(true);

      if (isBlocked) {
        await userApi.unblock(student._id);
        toast.success("Student unblocked successfully!");
      } else {
        await userApi.block(student._id, reason);
        toast.success("Student blocked successfully!");
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `Failed to ${isBlocked ? 'unblock' : 'block'} student`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isBlocked ? 'Unblock Student' : 'Block Student'}</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField fullWidth label="Student Name" value={student?.fullName || ''} disabled />
          <TextField fullWidth label="Scholar Number" value={student?.scholarNumber || ''} disabled />

          <Alert severity={isBlocked ? "info" : "warning"}>
            {isBlocked
              ? "Unblocking this student will restore their library access and allow them to issue books again."
              : "Blocking this student will prevent them from issuing new books and accessing library services. Currently issued books can still be returned."
            }
          </Alert>

          {!isBlocked && (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason for Blocking"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for blocking this student..."
              required
            />
          )}

          {isBlocked && student.blockReason && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Previous Block Reason"
              value={student.blockReason}
              disabled
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color={isBlocked ? "success" : "error"}
          onClick={handleToggleBlock}
          disabled={loading || (!isBlocked && !reason.trim())}
        >
          {loading ? <CircularProgress size={24} /> : (isBlocked ? 'Unblock Student' : 'Block Student')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockStudentDialog;
