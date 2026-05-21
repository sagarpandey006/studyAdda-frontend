import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, Card, CardContent, Box, Button, Stack, CircularProgress, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify';
import { memberApi, seatApi } from '../../../services/api';
import { fDateTime } from '../../../utils/formatTime';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [seatStats, setSeatStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [dashRes, seatRes] = await Promise.all([
        memberApi.getDashboard(),
        seatApi.getStatistics()
      ]);
      setDashboardData(dashRes.data.data);
      if (seatRes.data?.success) setSeatStats(seatRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const summary = dashboardData?.summary || {};
  const checkinStatus = dashboardData?.checkinStatus || {};
  const seatStatus = dashboardData?.seatStatus || {};
  const recentCheckins = dashboardData?.recentCheckins || [];
  const activeBooks = dashboardData?.activeBooks || [];

  return (
    <>
      <Helmet>
        <title>Student Dashboard | StudyAdda Smart Library</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome back, {user.name.split(' ')[0]}!
        </Typography>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6} lg={4}>
            <StyledCard>
              <StyledIcon sx={{ color: (theme) => theme.palette.primary.dark, backgroundImage: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)` }}>
                <Iconify icon="eva:book-outline" width={24} height={24} />
              </StyledIcon>
              <Typography variant="h3">{summary.issuedBooksCount || 0}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Books Issued</Typography>
              <Button variant="contained" sx={{ mt: 2 }} href="/member/my-issued-books">My Books</Button>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <StyledCard>
              <StyledIcon sx={{ color: (theme) => theme.palette.info.dark, backgroundImage: (theme) => `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.dark} 100%)` }}>
                <Iconify icon="eva:calendar-outline" width={24} height={24} />
              </StyledIcon>
              <Typography variant="h3">{seatStats?.available ?? '—'}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Available Seats</Typography>
              <Button variant="contained" sx={{ mt: 2 }} href="/member/seat-booking">Book Seat</Button>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <StyledCard>
              <StyledIcon sx={{ color: (theme) => theme.palette.warning.dark, backgroundImage: (theme) => `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.dark} 100%)` }}>
                <Iconify icon="eva:alert-triangle-outline" width={24} height={24} />
              </StyledIcon>
              <Typography variant="h3" color={summary.overdueCount > 0 ? 'error.main' : 'text.primary'}>
                {summary.overdueCount || 0}
              </Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Overdue Books</Typography>
              <Button variant="outlined" sx={{ mt: 2 }} href="/member/my-issued-books">View All</Button>
            </StyledCard>
          </Grid>

          {/* My Current Status */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>My Current Status</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">📚 Issued Books</Typography>
                  <Typography variant="h6" color="primary">
                    {summary.issuedBooksCount || 0} / {summary.maxBookLimit || 5}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">🪑 Current Seat</Typography>
                  {seatStatus.hasActiveBooking ? (
                    <Chip
                      label={`Seat ${seatStatus.seat.seatNumber} (${seatStatus.seat.status})`}
                      color="info"
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">No active booking</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">🔐 Library Status</Typography>
                  <Chip
                    label={checkinStatus.isCheckedIn ? `Checked In (${checkinStatus.durationSoFar} min)` : 'Not checked in'}
                    color={checkinStatus.isCheckedIn ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">💰 Pending Fines</Typography>
                  <Typography variant="h6" color={summary.unpaidFine > 0 || summary.calculatedPendingFine > 0 ? 'error.main' : 'success.main'}>
                    ₹{(summary.unpaidFine || 0) + (summary.calculatedPendingFine || 0)}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Recent Check-ins</Typography>
              {recentCheckins.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No recent activity</Typography>
              ) : (
                <Stack spacing={2}>
                  {recentCheckins.slice(0, 3).map((checkin) => (
                    <Box key={checkin._id}>
                      <Typography variant="body2" color="text.secondary">
                        {fDateTime(checkin.checkInTime)}
                      </Typography>
                      <Typography variant="body1">
                        {checkin.status === 'checked-out'
                          ? `Stayed ${checkin.duration} min`
                          : '🟢 Currently inside'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Card>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Quick Access</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button variant="outlined" startIcon={<Iconify icon="eva:search-outline" />} href="/member/browse-books">
                  Search Books
                </Button>
                <Button variant="outlined" startIcon={<Iconify icon="eva:calendar-outline" />} href="/member/seat-booking">
                  Book Study Seat
                </Button>
                <Button variant="outlined" startIcon={<Iconify icon="eva:bookmark-outline" />} href="/member/my-reservations">
                  My Reservations
                </Button>
                <Button variant="outlined" startIcon={<Iconify icon="eva:book-open-outline" />} href="/member/my-issued-books">
                  My Books
                </Button>
                <Button variant="outlined" startIcon={<Iconify icon="eva:person-outline" />} href="/member/profile">
                  My Profile
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
