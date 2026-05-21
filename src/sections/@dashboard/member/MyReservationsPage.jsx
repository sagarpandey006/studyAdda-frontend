import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Stack,
  Paper,
  Button,
  Container,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import { fDate, fDateTime } from '../../../utils/formatTime';
import { memberApi, seatApi } from '../../../services/api';
import CancelReservationDialog from './CancelReservationDialog';

const RESERVATIONS_PER_PAGE = 12;

// Normalize seat history from backend to display format
const normalizeSeatBooking = (seat) => ({
  ...seat,
  reservationDate: seat.bookingDate,
  startTime: seat.bookingStartTime,
  endTime: seat.bookingEndTime,
  location: `Floor ${seat.floor}, Section ${seat.section}`,
  // Map backend status to display status
  displayStatus: seat.status === 'booked' || seat.status === 'occupied' ? 'confirmed' : 'completed',
});

function applySortFilter(array, query) {
  if (query) {
    return filter(array, (reservation) =>
      reservation.seatNumber?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      reservation.location?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return array;
}

export default function MyReservationsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      const response = await memberApi.getMySeatHistory();
      const normalized = (response.data.seatHistory || []).map(normalizeSeatBooking);
      setReservations(normalized);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to load seat history');
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await seatApi.release(reservationId);
      await fetchReservations();
      toast.success('Booking released successfully!');
    } catch (error) {
      console.error('Error releasing booking:', error);
      toast.error(error.response?.data?.message || 'Failed to release booking');
    }
  };

  const handleModifyReservation = async (reservationId) => {
    toast.info('Modify reservation feature coming soon!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const isUpcoming = (startTime) => {
    return new Date(startTime) > new Date();
  };

  const isPast = (endTime) => {
    return new Date(endTime) < new Date();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleFilterByName = (event) => {
    setPage(1);
    setFilterName(event.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };
  
  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setCancelDialogOpen(true);
  };

  // Apply filters
  let filteredReservations = applySortFilter(reservations, filterName);
  
  if (tabValue === 1) {
    filteredReservations = filteredReservations.filter(r => r.displayStatus === 'confirmed');
  } else if (tabValue === 2) {
    filteredReservations = filteredReservations.filter(r => r.displayStatus === 'pending');
  } else if (tabValue === 3) {
    filteredReservations = filteredReservations.filter(r => r.displayStatus === 'cancelled');
  }
  
  const totalPages = Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE);
  const paginatedReservations = filteredReservations.slice((page - 1) * RESERVATIONS_PER_PAGE, page * RESERVATIONS_PER_PAGE);

  const isNotFound = !filteredReservations.length && !!filterName;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Seat Reservations | StudyAdda Smart Library</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Seat Reservations
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Reservation
          </Button> */}
        </Stack>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {filteredReservations.filter(res => res.displayStatus === 'confirmed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Bookings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="warning">
                  {filteredReservations.filter(res => res.displayStatus === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success">
                  {filteredReservations.filter(res => res.displayStatus === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="error">
                  {filteredReservations.filter(res => res.displayStatus === 'cancelled').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cancelled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Search reservations by seat number, purpose, or location..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {reservations.length === 0 ? (
          <Paper sx={{ textAlign: 'center', py: 8 }}>
            <Iconify icon="eva:calendar-outline" sx={{ width: 64, height: 64, mb: 2, color: 'text.disabled' }} />
            <Typography variant="h6" paragraph>
              No reservations yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Make your first seat reservation to get started!
            </Typography>
          </Paper>
        ) : isNotFound ? (
          <Paper sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" paragraph>
              Not found
            </Typography>
            <Typography variant="body2">
              No results found for &nbsp;
              <strong>&quot;{filterName}&quot;</strong>.
              <br /> Try checking for typos or using complete words.
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedReservations.map((reservation) => {
                const { _id, seatNumber, reservationDate, startTime, endTime, displayStatus, location, floor, section } = reservation;
                const upcoming = isUpcoming(startTime);
                const past = isPast(endTime);

                return (
                  <Grid item xs={12} sm={6} md={4} key={_id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        border: displayStatus === 'confirmed' && upcoming ? '2px solid' : '1px solid',
                        borderColor: displayStatus === 'confirmed' && upcoming ? 'success.main' : 'divider',
                      }}
                    >
                      {displayStatus === 'confirmed' && upcoming && (
                        <Alert severity="info" sx={{ mb: 1 }}>
                          Active booking
                        </Alert>
                      )}

                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                          <Typography variant="h6" component="h2" fontWeight={600}>
                            Seat {seatNumber}
                          </Typography>
                          <Label color={getStatusColor(displayStatus)}>
                            {displayStatus ? displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1) : 'N/A'}
                          </Label>
                        </Stack>

                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Location
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {location || `Floor ${floor}, Section ${section}`}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Date
                            </Typography>
                            <Typography variant="body2">
                              {reservationDate ? fDate(reservationDate) : '—'}
                            </Typography>
                          </Box>

                          {(startTime || endTime) && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Time Slot
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {startTime ? new Date(startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                {' - '}
                                {endTime ? new Date(endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                              </Typography>
                              <Typography variant="caption" color={upcoming ? 'success.main' : past ? 'text.disabled' : 'primary.main'}>
                                {upcoming ? 'Upcoming' : past ? 'Past' : 'Today'}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </CardContent>

                      <Divider />

                      <CardActions sx={{ p: 2 }}>
                        {displayStatus === 'confirmed' ? (
                          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleCancelReservation(_id)}
                              startIcon={<Iconify icon="eva:close-outline" />}
                              fullWidth
                            >
                              Release Seat
                            </Button>
                          </Stack>
                        ) : (
                          <Button size="small" variant="outlined" fullWidth startIcon={<Iconify icon="eva:eye-outline" />}>
                            View Details
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}