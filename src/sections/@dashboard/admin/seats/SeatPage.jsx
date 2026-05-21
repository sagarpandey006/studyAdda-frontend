import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
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
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useAuth } from '../../../../hooks/useAuth';
import Iconify from '../../../../components/iconify';
import { apiUrl } from '../../../../constants';
import SeatLayout from "./SeatLayout";
import FloorPlanView from "./FloorPlanView";
import { generateMockSeats, generateMockStatistics, generateMockCurrentBooking } from '../../../../utils/mockSeatData';
import { userApi } from "../../../../services/api";

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
const InteractiveCard = styled(Card)(({ theme, highlight }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  ...(highlight && {
    animation: `${pulseAnimation} 2s infinite`,
    border: `2px solid ${theme.palette.primary.main}`,
  }),
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
}));

const LoadingCard = styled(Card)(({ theme }) => ({
  background: theme.palette.grey[100],
  animation: `${shimmer} 1.5s infinite`,
}));

const StatCard = styled(Card)(({ theme, status }) => {
  const colors = {
    total: theme.palette.info.main,
    available: theme.palette.success.main,
    occupied: theme.palette.error.main,
    booked: theme.palette.warning.main,
    occupancy: theme.palette.primary.main,
  };

  return {
    border: '1px solid',
    borderColor: theme.palette.grey[200],
    backgroundColor: 'white',
    '&:hover': {
      borderColor: colors[status] || theme.palette.grey[300],
      transform: 'translateY(-1px)',
    },
  };
});

// 

// Toggle this to use mock data (true) or real API (false)
const USE_MOCK_DATA = false;

const SeatPage = () => {
  const { user } = useAuth();

  // State management
  const [seats, setSeats] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'floorplan'

  // Interactive states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [notification, setNotification] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isReleasingBook, setIsReleasingBook] = useState(false);

  // Filters
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedSection, setSelectedSection] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Booking form
  // const [bookingDate, setBookingDate] = useState(new Date());
  // const [startTime, setStartTime] = useState(new Date());
  // const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000)); // +1 hour
  // const [isAdvanceBooking, setIsAdvanceBooking] = useState(false);
  // const [notes, setNotes] = useState('');

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Auto-refresh interval (every 30 seconds) with visual feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      Promise.all([
        fetchSeats(),
        fetchStatistics(),
        fetchCurrentBooking()
      ]).finally(() => {
        setIsRefreshing(false);
        setLastUpdated(new Date());
        setConnectionStatus('connected');
      }).catch(() => {
        setConnectionStatus('error');
      });
    }, 30000);

    // Simulate connection status
    const statusInterval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.95 ? 'reconnecting' : 'connected');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [selectedFloor, selectedSection, statusFilter]);

  useEffect(() => {
    fetchSeats();
    fetchStatistics();
    fetchCurrentBooking();
    fetchStudents();
  }, [selectedFloor, selectedSection, statusFilter]);

  const fetchSeats = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Add realistic loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

        // Use mock data
        let mockSeats = generateMockSeats(selectedFloor);

        // Apply filters
        if (selectedSection !== 'all') {
          mockSeats = mockSeats.filter(seat => seat.section === selectedSection);
        }
        if (statusFilter !== 'all') {
          mockSeats = mockSeats.filter(seat => seat.status === statusFilter);
        }

        // Simulate real-time changes
        mockSeats = mockSeats.map(seat => ({
          ...seat,
          lastUpdated: new Date(),
          isNew: Math.random() > 0.95, // Random new seats
        }));

        setSeats(mockSeats);
        setIsLoading(false);
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 1000);
        return;
      }

      // Use real API
      const params = {};
      if (selectedFloor) params.floor = selectedFloor;
      if (selectedSection !== 'all') params.section = selectedSection;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await axios.get(`${apiUrl}/seat`, {
        params,
        withCredentials: true
      });

      if (response.data.success) {
        setSeats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching seats:', error);
      toast.error('Failed to fetch seats');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data
        const allSeats = generateMockSeats(selectedFloor);
        const stats = generateMockStatistics(allSeats);
        setStatistics(stats);
        return;
      }

      // Use real API
      const response = await axios.get(`${apiUrl}/seat/statistics`, {
        withCredentials: true
      });

      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchCurrentBooking = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data - randomly assign a current booking for demo
        const allSeats = generateMockSeats(selectedFloor);
        const mockBooking = generateMockCurrentBooking(user?._id, allSeats);
        setCurrentBooking(mockBooking);
        return;
      }

      // Use real API
      const response = await axios.get(`${apiUrl}/seat/my-booking`, {
        withCredentials: true
      });

      if (response.data.success) {
        setCurrentBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching current booking:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { usersList } = await userApi.getAll();
      setStudents(usersList.filter(user => !user.isAdmin));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeatClick = (seat) => {
    setSelectedSeat(seat);
    setSelectedStudent('');
    setIsBookingDialogOpen(true);
  };

  const handleAssignSeat = async () => {
    try {
      await axios.post(
        `${apiUrl}/seat/admin-book`,
        {
          seatId: selectedSeat._id,
          studentId: selectedStudent
        },
        { withCredentials: true }
      );

      toast.success("Seat assigned successfully");

      setIsBookingDialogOpen(false);
      setSelectedSeat(null);

      await fetchSeats();

    } catch (err) {
      toast.error(err.response?.data?.message || "Error assigning seat");
    }
  };

  const handleReleaseSeat = async (seatId) => {
    try {
      setIsReleasingBook(true);

      // Show loading feedback
      toast.loading('Releasing your seat...', { id: 'release-seat' });

      // Add delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (USE_MOCK_DATA) {
        // Mock success response
        toast.success('🎉 Seat released successfully! Thanks for using our service.', {
          id: 'release-seat',
          duration: 4000,
          style: {
            background: '#4caf50',
            color: 'white',
          },
        });

        // Update UI immediately for better UX
        setCurrentBooking(null);

        // Show additional feedback
        setNotification({
          type: 'success',
          message: 'Your seat has been successfully released and is now available for others.',
        });

        // Haptic feedback
        if (window.navigator?.vibrate) {
          window.navigator.vibrate([100, 50, 100, 50, 200]);
        }

        // Refresh data
        await Promise.all([
          fetchSeats(),
          fetchStatistics(),
          fetchCurrentBooking()
        ]);
      } else {
        const response = await axios.post(
          `${apiUrl}/seat/${seatId}/release`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success('🎉 Seat released successfully! Thanks for using our service.', {
            id: 'release-seat',
            duration: 4000,
          });
          setCurrentBooking(null);

          setNotification({
            type: 'success',
            message: 'Your seat has been successfully released and is now available for others.',
          });

          await Promise.all([
            fetchSeats(),
            fetchStatistics(),
            fetchCurrentBooking()
          ]);
        }
      }

      setIsReleaseDialogOpen(false);

      // Auto-hide success notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);

    } catch (error) {
      console.error('Error releasing seat:', error);
      toast.error(error.response?.data?.message || 'Failed to release seat. Please try again.', {
        id: 'release-seat',
        duration: 5000,
      });

      setNotification({
        type: 'error',
        message: 'Failed to release seat. Please try again or contact support.',
      });

      // Error haptic feedback
      if (window.navigator?.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }

      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsReleasingBook(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Seat Management | Smart Library System</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
            Seat Management
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
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => {
                if (newMode !== null) setViewMode(newMode);
              }}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="grid">
                <Iconify icon="solar:grid-bold" width={18} sx={{ mr: 1 }} />
                Grid View
              </ToggleButton>
              <ToggleButton value="floorplan">
                <Iconify icon="solar:floor-lamp-minimalistic-bold" width={18} sx={{ mr: 1 }} />
                Floor Plan
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              variant="outlined"
              size="small"
              startIcon={
                <Iconify
                  icon={isRefreshing ? "solar:refresh-bold" : "solar:refresh-bold"}
                  width={16}
                  sx={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}}
                />
              }
              onClick={async () => {
                setIsRefreshing(true);
                toast.loading('Refreshing data...', { id: 'refresh' });
                try {
                  await Promise.all([
                    fetchSeats(),
                    fetchStatistics(),
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
        {statistics ? (
          <Grid container spacing={2} sx={{ mb: 3, animation: animateStats ? `${slideIn} 0.8s ease-out` : 'none' }}>
            <Grid item xs={12} sm={6} md={2.4}>
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
            <Grid item xs={12} sm={6} md={2.4}>
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
            <Grid item xs={12} sm={6} md={2.4}>
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
            <Grid item xs={12} sm={6} md={2.4}>
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
                  borderColor: 'warning.main',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}>
                <Stack spacing={1}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: 'warning.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Iconify icon="solar:calendar-mark-bold" width={18} color="warning.main" />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main', mb: 0.25 }}>
                      {statistics.booked}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Booked
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                    <Iconify icon="solar:chart-2-bold" width={18} color="primary.main" />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.25 }}>
                      {statistics.occupancyRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Occupancy Rate
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Grid item xs={12} sm={6} md={2.4} key={item}>
                <Card sx={{
                  p: 2,
                  height: 110,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  boxShadow: 'none',
                  bgcolor: 'white'
                }}>
                  <Stack spacing={1}>
                    <Box sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: 'grey.100',
                      animation: `${shimmer} 1.5s infinite`
                    }} />
                    <Box>
                      <Box sx={{
                        height: 24,
                        width: '50%',
                        bgcolor: 'grey.100',
                        borderRadius: 0.5,
                        mb: 0.25,
                        animation: `${shimmer} 1.5s infinite`
                      }} />
                      <Box sx={{
                        height: 12,
                        width: '70%',
                        bgcolor: 'grey.100',
                        borderRadius: 0.25,
                        animation: `${shimmer} 1.5s infinite`
                      }} />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Status Bar */}
        <Box sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'white'
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: connectionStatus === 'connected' ? 'success.main' : connectionStatus === 'error' ? 'error.main' : 'warning.main'
              }} />
              <Typography variant="caption" fontWeight={500} color="text.primary">
                {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'error' ? 'Offline' : 'Connecting'}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {lastUpdated.toLocaleTimeString()}
            </Typography>
            {notification && (
              <Chip
                label={notification.message}
                color={notification.type}
                size="small"
                onDelete={() => setNotification(null)}
                sx={{
                  ml: 'auto',
                  '& .MuiChip-deleteIcon': {
                    fontSize: 16
                  }
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Current Booking Card */}
        {currentBooking && (
          <Card sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'primary.light',
            bgcolor: 'white',
            boxShadow: 'none',
            animation: `${slideIn} 0.6s ease-out`
          }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems={{ xs: 'stretch', md: 'center' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
                <Box sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Iconify icon="solar:sofa-2-bold" width={20} color="white" />
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                      Your Active Booking
                    </Typography>
                    <Chip
                      label="LIVE"
                      size="small"
                      sx={{
                        bgcolor: 'success.main',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Stack>
                  <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mt: 0.25 }}>
                    Seat {currentBooking.seatNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Floor {currentBooking.floor}, Section {currentBooking.section}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                    <Chip
                      icon={<Iconify icon={currentBooking.isAdvanceBooking ? 'solar:calendar-mark-bold' : 'solar:user-check-bold'} width={16} />}
                      label={currentBooking.isAdvanceBooking ? 'Advance Booking' : 'Currently Occupied'}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '& .MuiChip-icon': { color: 'primary.main' }
                      }}
                    />
                    {currentBooking.bookingEndTime && (
                      <Chip
                        icon={<Iconify icon="solar:clock-circle-bold" width={16} />}
                        label={`Until ${new Date(currentBooking.bookingEndTime).toLocaleTimeString()}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: 'text.secondary',
                          color: 'text.secondary'
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>

              <Stack direction={{ xs: 'row', md: 'column' }} spacing={1} sx={{ minWidth: { md: 120 } }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Iconify icon="solar:clock-circle-bold" width={16} />}
                  onClick={() => toast.info('Extend booking feature coming soon!')}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                  Extend
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  startIcon={
                    <Iconify
                      icon={isReleasingBook ? "solar:refresh-bold" : "solar:logout-2-bold"}
                      width={16}
                      sx={isReleasingBook ? { animation: 'spin 1s linear infinite' } : {}}
                    />
                  }
                  onClick={() => setIsReleaseDialogOpen(true)}
                  disabled={isReleasingBook}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    fontSize: '0.75rem',
                    bgcolor: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.dark'
                    }
                  }}
                >
                  {isReleasingBook ? 'Releasing...' : 'Release'}
                </Button>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Filters */}
        <Card sx={{
          mb: 3,
          p: 2,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'grey.200',
          boxShadow: 'none',
          bgcolor: 'white'
        }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
            Filter Seats
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Floor</InputLabel>
              <Select
                value={selectedFloor}
                label="Floor"
                onChange={(e) => setSelectedFloor(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              >
                <MenuItem value={1}>Floor 1</MenuItem>
                <MenuItem value={2}>Floor 2</MenuItem>
                <MenuItem value={3}>Floor 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Section</InputLabel>
              <Select
                value={selectedSection}
                label="Section"
                onChange={(e) => setSelectedSection(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              >
                <MenuItem value="all">All Sections</MenuItem>
                <MenuItem value="A">Section A</MenuItem>
                <MenuItem value="B">Section B</MenuItem>
                <MenuItem value="C">Section C</MenuItem>
                <MenuItem value="D">Section D</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5
                  }
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="booked">Booked</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* View Toggle - Floor Plan or Grid */}
        {viewMode === 'floorplan' ? (
          <FloorPlanView floor={selectedFloor} statistics={statistics} />
        ) : (
          <SeatLayout
            seats={seats}
            onSeatClick={handleSeatClick}
            selectedSeat={selectedSeat}
            currentUserBooking={currentBooking}
          />
        )}

        {/* Booking Dialog */}
        <Dialog
          open={isBookingDialogOpen}
          onClose={() => {
            setIsBookingDialogOpen(false);
            setSelectedSeat(null);
            setSelectedStudent('');
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: 24
            }
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'primary.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Iconify icon="solar:sofa-2-bold" width={20} color="primary.main" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Book Seat {selectedSeat?.seatNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Floor {selectedSeat?.floor}, Section {selectedSeat?.section}
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography>
                Seat: <b>{selectedSeat?.seatNumber}</b>
              </Typography>

              <Typography>
                Status: <b>{selectedSeat?.status}</b>
              </Typography>

              {selectedSeat?.bookedBy && (
                <>
                  <Typography>Name: {selectedSeat.bookedBy.name}</Typography>
                  <Typography>Scholar No.: {selectedSeat.bookedBy.scholarNumber || 'N/A'}</Typography>
                  <Typography>Enrollnment No.: {selectedSeat.bookedBy.enrollmentNumber || 'N/A'}</Typography>
                  <Typography>Email: {selectedSeat.bookedBy.email}</Typography>
                </>
              )}

              {selectedSeat?.status === "available" && (
                <FormControl fullWidth>
                  <InputLabel>Select Student</InputLabel>

                  <Select
                    value={selectedStudent}
                    label="Select Student"
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          borderRadius: 2
                        }
                      }
                    }}
                  >
                    {students.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        <Stack spacing={0.3}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {s.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Scholar: {s.scholarNumber} | Enroll: {s.enrollmentNumber}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => {
                setIsBookingDialogOpen(false);
                setSelectedSeat(null);
                setSelectedStudent('');
              }}
              variant="outlined"
              sx={{
                borderColor: 'grey.300',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'grey.400',
                  bgcolor: 'grey.50'
                }
              }}
            >
              Cancel
            </Button>
            {selectedSeat?.status === "available" && (
              <Button
                onClick={handleAssignSeat}
                variant="contained"
                disabled={!selectedStudent}
              >
                Assign Seat
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Release Seat Confirmation Dialog */}
        <Dialog
          open={isReleaseDialogOpen}
          onClose={() => !isReleasingBook && setIsReleaseDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'error.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Iconify icon="solar:danger-triangle-bold" width={20} color="error.main" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Release Seat
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confirm to release your booking
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body1">
                Are you sure you want to release your current seat?
              </Typography>

              {currentBooking && (
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Current Booking Details:
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Seat:</strong> {currentBooking.seatNumber}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Location:</strong> Floor {currentBooking.floor}, Section {currentBooking.section}
                    </Typography>
                    {currentBooking.bookingEndTime && (
                      <Typography variant="body2" color="textSecondary">
                        <strong>Booking Until:</strong> {new Date(currentBooking.bookingEndTime).toLocaleString()}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              )}

              <Box sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'warning.lighter',
                border: '1px solid',
                borderColor: 'warning.main'
              }}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <Iconify icon="eva:info-fill" width={20} color="warning.main" />
                  <Box>
                    <Typography variant="body2" color="warning.dark" fontWeight={500}>
                      Important Notice:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                      • Once released, this seat will become available for other users
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • You'll need to book a new seat if you want to continue studying
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • Any remaining booking time will be forfeited
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={() => setIsReleaseDialogOpen(false)}
              disabled={isReleasingBook}
              variant="outlined"
            >
              Cancel
            </Button>
            <AnimatedButton
              onClick={() => handleReleaseSeat(currentBooking?._id)}
              variant="contained"
              color="error"
              disabled={isReleasingBook}
              startIcon={
                <Iconify
                  icon={isReleasingBook ? "eos-icons:loading" : "eva:checkmark-circle-2-fill"}
                  sx={isReleasingBook ? { animation: 'spin 1s linear infinite' } : {}}
                />
              }
            >
              {isReleasingBook ? 'Releasing Seat...' : 'Yes, Release Seat'}
            </AnimatedButton>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default SeatPage;
