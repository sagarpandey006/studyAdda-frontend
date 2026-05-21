import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import { fDate, fDateTime } from '../../../utils/formatTime';
import { memberApi } from '../../../services/api';

const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Iconify icon={icon} width={24} height={24} sx={{ color: 'text.secondary' }} />
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

export default function MemberProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    phone: '',
    email: '',
  });

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      const [profileRes, borrowalRes] = await Promise.all([
        memberApi.getMyProfile(),
        memberApi.getMyBorrowals({ status: 'issued' })
      ]);

      const profile = profileRes.data.user;
      const activeBooks = borrowalRes.data.borrowalsList || [];

      setStudentData({
        fullName: profile.name,
        email: profile.email,
        phone: profile.phone || '—',
        scholarNumber: profile.scholarNumber || `ST${profile._id.substr(-4).toUpperCase()}`,
        enrollmentNumber: profile.enrollmentNumber || `ST${profile._id.substr(-4).toUpperCase()}`,
        status: profile.status || 'Active',
        photoUrl: profile.photoUrl,
        joinDate: profile.admissionDate || profile.createdAt,
        department: profile.branch || profile.course || '—',
        semester: profile.semester ? `${profile.semester}th` : '—',
        booksIssued: profile.totalBooksIssued || activeBooks.length,
        booksLimit: profile.maxBookLimit || 5,
        fineAmount: profile.fineAmount || 0,
        unpaidFine: profile.unpaidFine || 0,
      });

      setIssuedBooks(activeBooks);
      setReservations([]);
      setEditFormData({ phone: profile.phone || '', email: profile.email || '' });
      setTransactionHistory([]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      await memberApi.updateMyProfile(editFormData);
      toast.success('Profile updated successfully!');
      setEditDialogOpen(false);
      await loadProfileData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!studentData) {
    return (
      <Container>
        <Alert severity="error">Failed to load profile data</Alert>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | StudyAdda Smart Library</title>
      </Helmet>

      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">My Profile</Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:edit-outline" />}
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {/* Basic Information Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <Avatar
                    src={studentData.photoUrl}
                    alt={studentData.fullName}
                    sx={{ width: 150, height: 150 }}
                  />

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                      {studentData.fullName}
                    </Typography>
                    <Label color={getStatusColor(studentData.status)}>
                      {studentData.status}
                    </Label>
                  </Box>

                  <Divider sx={{ width: '100%' }} />

                  <Stack spacing={2} sx={{ width: '100%' }}>
                    <InfoRow
                      icon="mdi:identifier"
                      label="Scholar Number"
                      value={studentData.scholarNumber}
                    />
                    <InfoRow
                      icon="mdi:identifier"
                      label="Enrollment Number"
                      value={studentData.enrollmentNumber}
                    />
                    <InfoRow
                      icon="eva:email-outline"
                      label="Email"
                      value={studentData.email}
                    />
                    <InfoRow
                      icon="eva:phone-outline"
                      label="Phone"
                      value={studentData.phone}
                    />
                    <InfoRow
                      icon="mdi:school-outline"
                      label="Department"
                      value={studentData.department}
                    />
                    <InfoRow
                      icon="mdi:book-education-outline"
                      label="Semester"
                      value={studentData.semester}
                    />
                    <InfoRow
                      icon="eva:calendar-outline"
                      label="Member Since"
                      value={fDate(studentData.joinDate)}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistics and Current Status */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Statistics Cards */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.lighter' }}>
                    <Iconify icon="eva:book-outline" width={40} height={40} sx={{ color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" color="primary.main">{studentData.booksIssued}</Typography>
                    <Typography variant="caption" color="text.secondary">Books Issued</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.lighter' }}>
                    <Iconify icon="mdi:book-open-variant" width={40} height={40} sx={{ color: 'info.main', mb: 1 }} />
                    <Typography variant="h4" color="info.main">{studentData.booksLimit - studentData.booksIssued}</Typography>
                    <Typography variant="caption" color="text.secondary">Books Available</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                    <Iconify icon="eva:bookmark-outline" width={40} height={40} sx={{ color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main">{reservations.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Active Reservations</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: studentData.unpaidFine > 0 ? 'error.lighter' : 'success.lighter' }}>
                    <Iconify icon="mdi:currency-inr" width={40} height={40} sx={{ color: studentData.unpaidFine > 0 ? 'error.main' : 'success.main', mb: 1 }} />
                    <Typography variant="h4" color={studentData.unpaidFine > 0 ? 'error.main' : 'success.main'}>₹{studentData.unpaidFine}</Typography>
                    <Typography variant="caption" color="text.secondary">Pending Fines</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Current Issued Books */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Currently Issued Books ({issuedBooks.length})
                  </Typography>
                  {issuedBooks.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Book Name</TableCell>
                            <TableCell>Issue Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {issuedBooks.map((borrowal) => {
                            const isOverdue = new Date(borrowal.dueDate) < new Date() && borrowal.status === 'issued';
                            return (
                              <TableRow key={borrowal._id}>
                                <TableCell>{borrowal.book?.name || 'N/A'}</TableCell>
                                <TableCell>{fDate(borrowal.issueDate)}</TableCell>
                                <TableCell sx={{ color: isOverdue ? 'error.main' : 'inherit' }}>
                                  {fDate(borrowal.dueDate)}
                                </TableCell>
                                <TableCell>
                                  <Label color={isOverdue ? 'error' : 'warning'}>
                                    {isOverdue ? 'Overdue' : 'Issued'}
                                  </Label>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="info">No books currently issued</Alert>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {transactionHistory.map((transaction) => (
                      <Paper key={transaction._id} sx={{ p: 2, bgcolor: 'background.neutral' }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Iconify
                            icon={
                              transaction.type.includes('Book') ? 'eva:book-outline' :
                                transaction.type.includes('Seat') ? 'mdi:seat-outline' :
                                  'eva:checkmark-circle-2-outline'
                            }
                            width={24}
                            height={24}
                            sx={{ color: 'primary.main' }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {transaction.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.description}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {fDate(transaction.date)}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Phone"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />
            <Alert severity="info">
              To update other information (Name, Scholar No., Department), please contact the library administrator.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
