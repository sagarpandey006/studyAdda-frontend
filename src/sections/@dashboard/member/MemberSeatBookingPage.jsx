import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Alert,
  Divider
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify';
import { seatApi } from '../../../services/api';
import SeatLayout from '../admin/seats/SeatLayout';
// Animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const shimmer = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Styled Components
const SeatCard = styled(Paper)(({ theme, status, isSelected }) => {
  const statusColors = {
    available: {
      bg: theme.palette.success.lighter,
      border: theme.palette.success.main,
      color: theme.palette.success.dark,
    },
    booked: {
      bg: theme.palette.warning.lighter,
      border: theme.palette.warning.main,
      color: theme.palette.warning.dark,
    },
    occupied: {
      bg: theme.palette.error.lighter,
      border: theme.palette.error.main,
      color: theme.palette.error.dark,
    },
  };

  const colorScheme = statusColors[status] || statusColors.available;

  return {
    minWidth: 70,
    minHeight: 85,
    padding: theme.spacing(1),
    cursor: status === 'available' ? 'pointer' : 'not-allowed',
    backgroundColor: isSelected ? theme.palette.primary.lighter : colorScheme.bg,
    border: `2px solid ${isSelected ? theme.palette.primary.main : colorScheme.border}`,
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: status === 'available' ? 'translateY(-4px)' : 'none',
      boxShadow: status === 'available' ? theme.shadows[4] : 'none',
    },
  };
});

const CurrentBookingCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  animation: `${slideIn} 0.5s ease`,
  border: `1px solid ${theme.palette.primary.dark}`,
  borderRadius: theme.spacing(1.5),
  boxShadow: theme.shadows[4],
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral || theme.palette.grey[50],
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

// Mock Data Generator (for development)
const generateMockSeats = () => {
  const seats = [];
  const floors = [1, 2, 3];
  const sections = ['A', 'B', 'C', 'D'];
  const statuses = ['available', 'occupied', 'booked'];

  let seatNumber = 1;
  floors.forEach(floor => {
    sections.forEach(section => {
      for (let i = 1; i <= 10; i += 1) {
        seats.push({
          _id: `seat_${seatNumber}`,
          seatNumber: `${floor}${section}${i.toString().padStart(2, '0')}`,
          floor,
          section,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          currentBooking: Math.random() > 0.7 ? {
            userId: 'user123',
            userName: 'John Doe',
            startTime: new Date(),
            endTime: new Date(Date.now() + 3600000)
          } : null
        });
        seatNumber += 1;
      }
    });
  });
  return seats;
};

const generateMockCurrentBooking = (userId) => {
  if (Math.random() > 0.5) {
    return {
      _id: 'booking123',
      seatId: 'seat_45',
      seatNumber: '2A05',
      startTime: new Date(Date.now() - 1800000), // Started 30 min ago
      endTime: new Date(Date.now() + 5400000), // Ends in 90 min
      status: 'active'
    };
  }
  return null;
};

// Toggle for mock data
const USE_MOCK_DATA = false;

const MemberSeatBookingPage = () => {
  const { user } = useAuth();

  // State management
  const [seats, setSeats] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);

  // Interactive states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [animateStats, setAnimateStats] = useState(false);

  // Filters
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSection, setSelectedSection] = useState('all');

  // Booking form
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch available seats
  const fetchSeats = async () => {
    try {
      if (USE_MOCK_DATA) {
        const mockSeats = generateMockSeats();
        setSeats(mockSeats);

        // Generate statistics
        const stats = {
          total: mockSeats.length,
          available: mockSeats.filter(s => s.status === 'available').length,
          occupied: mockSeats.filter(s => s.status === 'occupied').length,
          booked: mockSeats.filter(s => s.status === 'booked').length,
        };
        stats.occupancy = ((stats.occupied + stats.booked) / stats.total * 100).toFixed(1);
        setStatistics(stats);
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 1000);
        return;
      }

      const response = await seatApi.getAll({
        floor: selectedFloor,
        section: selectedSection !== 'all' ? selectedSection : undefined
      });
      const seatList = response.data || [];
      setSeats(seatList);

      // Calculate statistics
      const stats = {
        total: seatList.length,
        available: seatList.filter(s => s.status === 'available').length,
        occupied: seatList.filter(s => s.status === 'occupied').length,
        booked: seatList.filter(s => s.status === 'booked').length,
      };
      stats.occupancy = stats.total > 0 ? ((stats.occupied + stats.booked) / stats.total * 100).toFixed(1) : 0;
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching seats:', error);
      toast.error('Failed to fetch seats');
    }
  };

  // Fetch current user's booking
  const fetchCurrentBooking = async () => {
    try {
      if (USE_MOCK_DATA) {
        const mockBooking = generateMockCurrentBooking(user?.id);
        setCurrentBooking(mockBooking);
        setIsLoading(false);
        return;
      }

      const response = await seatApi.getCurrentBooking();
      setCurrentBooking(response.data || null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching current booking:', error);
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSeats();
    fetchCurrentBooking();
    // eslint-disable-next-line
  }, [selectedFloor, selectedSection]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      Promise.all([
        fetchSeats(),
        fetchCurrentBooking()
      ]).finally(() => {
        setIsRefreshing(false);
        setLastUpdated(new Date());
      });
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Handle seat selection
  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') {
      toast.error("Seat not available");
      return;
    }

    if (currentBooking) {
      toast.error("You already have a seat");
      setSelectedSeat(null);
      return;
    }

    setSelectedSeat(seat);
    setIsBookingDialogOpen(true);
  };

  // Handle booking
  const handleBookSeat = async () => {
    if (!selectedSeat) return;

    setIsProcessing(true);
    try {
      if (USE_MOCK_DATA) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newBooking = {
          _id: `booking_${Date.now()}`,
          seatId: selectedSeat._id,
          seatNumber: selectedSeat.seatNumber,
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 3600000),
          status: 'active',
        };

        setCurrentBooking(newBooking);
        toast.success(`Seat ${selectedSeat.seatNumber} booked successfully!`);
        setIsBookingDialogOpen(false);
        setSelectedSeat(null);
        fetchSeats();
        setIsProcessing(false);
        return;
      }

      const response = await seatApi.book(selectedSeat._id);

      setCurrentBooking(response.seat || response.data || null);
      toast.success(`Seat ${selectedSeat.seatNumber} booked successfully!`);
      setIsBookingDialogOpen(false);
      setSelectedSeat(null);
      fetchSeats();
    } catch (error) {
      console.error('Error booking seat:', error);
      toast.error(error.response?.data?.message || 'Failed to book seat');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle release booking
  const handleReleaseBooking = async () => {
    if (!currentBooking) return;

    setIsProcessing(true);
    try {
      if (USE_MOCK_DATA) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success('Booking released successfully!');
        setCurrentBooking(null);
        setIsReleaseDialogOpen(false);
        fetchSeats();
        setIsProcessing(false);
        return;
      }

      await seatApi.release(currentBooking._id || currentBooking.seatId);

      toast.success('Booking released successfully!');
      setCurrentBooking(null);
      setIsReleaseDialogOpen(false);
      fetchSeats();
    } catch (error) {
      console.error('Error releasing booking:', error);
      toast.error(error.response?.data?.message || 'Failed to release booking');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter seats
  const filteredSeats = seats.filter(seat => {
    if (selectedFloor && seat.floor !== selectedFloor) return false;
    if (selectedSection !== 'all' && seat.section !== selectedSection) return false;
    return true;
  });

  // Group seats by section for better display
  const groupedSeats = filteredSeats.reduce((acc, seat) => {
    if (!acc[seat.section]) {
      acc[seat.section] = [];
    }
    acc[seat.section].push(seat);
    return acc;
  }, {});

  // Sort seats within each section
  Object.keys(groupedSeats).forEach((section) => {
    groupedSeats[section].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
  });

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Seat Booking | StudyAdda</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
            Seat Booking
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Find and book your perfect study seat
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={
                <Iconify
                  icon="solar:refresh-bold"
                  width={16}
                  sx={isRefreshing ? {
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    },
                    animation: 'spin 1s linear infinite'
                  } : {}}
                />
              }
              onClick={async () => {
                setIsRefreshing(true);
                toast.loading('Refreshing data...', { id: 'refresh' });
                try {
                  await Promise.all([
                    fetchSeats(),
                    fetchCurrentBooking()
                  ]);
                  toast.success('Data refreshed successfully!', { id: 'refresh' });
                } catch (error) {
                  toast.error('Failed to refresh data', { id: 'refresh' });
                } finally {
                  setIsRefreshing(false);
                  setLastUpdated(new Date());
                }
              }}
              disabled={isRefreshing}
              sx={{
                minWidth: 100,
                px: 1.5,
                py: 0.5,
                borderColor: 'grey.300',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'grey.50'
                }
              }}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Stack>
        </Box>

        {/* Statistics Cards */}
        {statistics && (
          <Grid container spacing={2} sx={{ mb: 3, animation: animateStats ? `${slideIn} 0.8s ease-out` : 'none' }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                p: 2,
                height: '100%',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'grey.200',
                boxShadow: 'none',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: 1,
                  borderColor: 'info.main',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Stack spacing={1}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'info.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="solar:sofa-2-bold" width={18} color="info.main" />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.25 }}>
                      {statistics.total}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Seats
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                p: 2,
                height: '100%',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'grey.200',
                boxShadow: 'none',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: 1,
                  borderColor: 'success.main',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Stack spacing={1}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'success.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="solar:check-circle-bold" width={18} color="success.main" />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', mb: 0.25 }}>
                      {statistics.available}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Available
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                p: 2,
                height: '100%',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'grey.200',
                boxShadow: 'none',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: 1,
                  borderColor: 'error.main',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Stack spacing={1}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'error.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="solar:user-bold" width={18} color="error.main" />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main', mb: 0.25 }}>
                      {statistics.occupied}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Occupied
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{
                p: 2,
                height: '100%',
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'grey.200',
                boxShadow: 'none',
                bgcolor: 'white',
                '&:hover': {
                  boxShadow: 1,
                  borderColor: 'primary.main',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Stack spacing={1}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="solar:chart-bold" width={18} color="primary.main" />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.25 }}>
                      {statistics.occupancy}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Occupancy Rate
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Current Booking */}
        {currentBooking && (
          <CurrentBookingCard sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon="solar:bookmark-bold" sx={{ mr: 1 }} width={24} />
                    Your Current Booking
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>Seat Number</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{currentBooking.seatNumber}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Tap your RFID card at entry to activate your seat
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>Start Time</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {/* {new Date(currentBooking.startTime).toLocaleTimeString()} */}
                      {new Date(currentBooking.bookingStartTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>End Time</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {/* {new Date(currentBooking.endTime).toLocaleTimeString()} */}
                      {new Date(currentBooking.bookingEndTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={() => setIsReleaseDialogOpen(true)}
                      startIcon={<Iconify icon="solar:logout-2-bold" />}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      Release Seat
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </CurrentBookingCard>
        )}

        {/* Info Alert */}
        {!currentBooking && (
          <Alert
            severity="info"
            icon={<Iconify icon="solar:info-circle-bold" />}
            sx={{ mb: 3, borderRadius: 1.5 }}
          >
            You don't have any active booking. Select an available seat below to book.
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3, borderRadius: 1.5 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Floor</InputLabel>
                  <Select
                    value={selectedFloor}
                    label="Floor"
                    onChange={(e) => setSelectedFloor(e.target.value)}
                  >
                    <MenuItem value={1}>Floor 1</MenuItem>
                    <MenuItem value={2}>Floor 2</MenuItem>
                    <MenuItem value={3}>Floor 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={selectedSection}
                    label="Section"
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    <MenuItem value="all">All Sections</MenuItem>
                    <MenuItem value="A">Section A</MenuItem>
                    <MenuItem value="B">Section B</MenuItem>
                    <MenuItem value="C">Section C</MenuItem>
                    <MenuItem value="D">Section D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'success.lighter',
                        border: '2px solid',
                        borderColor: 'success.main',
                        borderRadius: 0.5,
                      }}
                    />
                    <Typography variant="caption">Available</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'error.lighter',
                        border: '2px solid',
                        borderColor: 'error.main',
                        borderRadius: 0.5,
                      }}
                    />
                    <Typography variant="caption">Occupied</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'warning.lighter',
                        border: '2px solid',
                        borderColor: 'warning.main',
                        borderRadius: 0.5,
                      }}
                    />
                    <Typography variant="caption">Reserved</Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Seat Grid */}
        <Card sx={{ borderRadius: 1.5 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Floor {selectedFloor} {selectedSection !== 'all' ? `- Section ${selectedSection}` : ''}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {filteredSeats.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Iconify icon="solar:sofa-2-bold-duotone" width={64} height={64} color="text.disabled" />
                <Typography variant="h6" color="text.secondary" mt={2}>
                  No seats found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your filters
                </Typography>
              </Box>
            ) : (
              <SeatLayout
                seats={filteredSeats}
                onSeatClick={handleSeatClick}
                selectedSeat={selectedSeat}
                currentUserBooking={currentBooking}
              />
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Booking Dialog */}
      <Dialog
        open={isBookingDialogOpen}
        onClose={() => !isProcessing && setIsBookingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:bookmark-bold" width={24} color="primary.main" />
            <Typography variant="h6">Book Seat {selectedSeat?.seatNumber}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity="info">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Floor {selectedSeat?.floor}, Section {selectedSeat?.section}
              </Typography>
            </Alert>

            <Alert severity="info">
              {currentBooking
                ? "You already have a seat"
                : "Your seat will be reserved for 20 minutes. Please check-in using RFID to confirm."
              }
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsBookingDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBookSeat}
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Iconify icon="solar:check-circle-bold" />}
          >
            {isProcessing ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Release Dialog */}
      <Dialog
        open={isReleaseDialogOpen}
        onClose={() => !isProcessing && setIsReleaseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:logout-2-bold" width={24} color="error.main" />
            <Typography variant="h6">Release Seat Booking</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }} icon={<Iconify icon="solar:danger-bold" />}>
            Are you sure you want to release your current booking for seat <strong>{currentBooking?.seatNumber}</strong>?
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsReleaseDialogOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReleaseBooking}
            color="error"
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Iconify icon="solar:logout-2-bold" />}
          >
            {isProcessing ? 'Releasing...' : 'Release Seat'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MemberSeatBookingPage;
