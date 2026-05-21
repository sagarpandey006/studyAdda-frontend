import { Helmet } from "react-helmet-async";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  CircularProgress,
  Divider,
  Paper
} from "@mui/material";

import Iconify from '../../../../components/iconify';
import { userApi } from '../../../../services/api';

// 

const StudentPage = () => {
  const navigate = useNavigate();
  const [scholarNumber, setScholarNumber] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [rfidScanning, setRfidScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock RFID scanning simulation
  const handleRFIDScan = async () => {
    setRfidScanning(true);
    toast.success("Ready to scan... Tap the student card on RFID scanner");
    
    // Simulate RFID scan (in real implementation, this would listen to RFID reader)
    setTimeout(async () => {
      const mockRfidData = "RFID-STU-2024-001"; // This would come from actual RFID scanner
      await searchByRFID(mockRfidData);
      setRfidScanning(false);
    }, 2000);
  };

  const searchByRFID = async (rfidData) => {
    try {
      setLoading(true);
      const student = await userApi.searchByRFID(rfidData);
      if (student) {
        toast.success("Student found!");
        navigate(`/admin/students/profile/${student._id}`);
      } else {
        toast.error("No student found with this RFID card");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to scan RFID");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByScholar = async () => {
    if (!scholarNumber.trim()) {
      toast.error("Please enter Scholar Number");
      return;
    }
    
    try {
      setLoading(true);
      const student = await userApi.searchByScholar(scholarNumber);
      if (student) {
        toast.success("Student found!");
        navigate(`/admin/students/profile/${student._id}`);
      } else {
        toast.error("No student found with this Scholar Number");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to search student");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByEnrollment = async () => {
    if (!enrollmentNumber.trim()) {
      toast.error("Please enter Enrollment Number");
      return;
    }
    
    try {
      setLoading(true);
      const student = await userApi.searchByEnrollment(enrollmentNumber);
      if (student) {
        toast.success("Student found!");
        navigate(`/admin/students/profile/${student._id}`);
      } else {
        toast.error("No student found with this Enrollment Number");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to search student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Student Management | Library System </title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Student Management
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* RFID Scan Section */}
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.lighter' }}>
              <Iconify 
                icon="mdi:card-account-details" 
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2, color: 'primary.main' }}
              />
              <Typography variant="h5" gutterBottom>
                RFID Student Card Scanner
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Click the button below and tap the student card on the RFID scanner
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  rfidScanning ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mdi:nfc" />
                }
                onClick={handleRFIDScan}
                disabled={rfidScanning || loading}
                sx={{ minWidth: 200 }}
              >
                {rfidScanning ? 'Scanning...' : 'Scan RFID Card'}
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR SEARCH MANUALLY
              </Typography>
            </Divider>
          </Grid>

          {/* Search by Scholar Number */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify 
                    icon="mdi:account-school" 
                    sx={{ width: 32, height: 32, color: 'info.main' }}
                  />
                  <Typography variant="h6">
                    Search by Scholar Number
                  </Typography>
                </Box>
                
                <TextField
                  fullWidth
                  label="Scholar Number"
                  value={scholarNumber}
                  onChange={(e) => setScholarNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchByScholar();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="mdi:pound" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="e.g., SCH2024001"
                />
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSearchByScholar}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="mdi:magnify" />}
                >
                  Search Student
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* Search by Enrollment Number */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify 
                    icon="mdi:card-account-details-outline" 
                    sx={{ width: 32, height: 32, color: 'success.main' }}
                  />
                  <Typography variant="h6">
                    Search by Enrollment Number
                  </Typography>
                </Box>
                
                <TextField
                  fullWidth
                  label="Enrollment Number"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchByEnrollment();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="mdi:identifier" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="e.g., EN2024001"
                />
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSearchByEnrollment}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="mdi:magnify" />}
                  color="success"
                >
                  Search Student
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* Quick Info Card */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'background.neutral' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="mdi:information-outline" sx={{ width: 24, height: 24, color: 'info.main' }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Tip:</strong> Use the RFID scanner for fastest access or search manually using Scholar Number or Enrollment Number.
                  After finding a student, you can view their complete profile, library records, and transaction history.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default StudentPage;
