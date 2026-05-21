import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Stack, Box, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../../components/iconify';
import { useAuth } from '../../../../hooks/useAuth';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.customShadows.card,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  position: 'relative',
  overflow: 'visible',
}));

const StyledIcon = styled('div')(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
}));

export default function AppSeatAvailability({ statistics }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!statistics) {
    return null;
  }

  const availabilityPercentage = statistics.total > 0 
    ? (statistics.available / statistics.total) * 100 
    : 0;

  const getStatusColor = () => {
    if (availabilityPercentage > 50) return 'success';
    if (availabilityPercentage > 20) return 'warning';
    return 'error';
  };

  const handleViewAll = () => {
    if (user?.isAdmin) {
      navigate('/admin/seats');
    } else {
      navigate('/member/seat-booking');
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <StyledIcon>
              <Iconify icon="mdi:seat" width={32} color="white" />
            </StyledIcon>
            <Button
              variant="text"
              size="small"
              endIcon={<Iconify icon="eva:arrow-forward-fill" />}
              onClick={handleViewAll}
            >
              View All
            </Button>
          </Stack>

          <Typography variant="h4" gutterBottom>
            Seat Availability
          </Typography>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h3" color={`${getStatusColor()}.main`}>
                {statistics.available}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                / {statistics.total} Total
              </Typography>
            </Stack>
            
            <LinearProgress
              variant="determinate"
              value={availabilityPercentage}
              color={getStatusColor()}
              sx={{ height: 8, borderRadius: 1, mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {availabilityPercentage.toFixed(1)}% Available
            </Typography>
          </Box>

          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="h6" color="warning.main">
                {statistics.booked}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Booked
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="error.main">
                {statistics.occupied}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Occupied
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6">
                {statistics.todayBookings}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Today's Bookings
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.neutral',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify 
                icon={availabilityPercentage > 20 ? 'eva:checkmark-circle-2-fill' : 'eva:alert-circle-fill'} 
                color={availabilityPercentage > 20 ? 'success.main' : 'error.main'}
                width={20}
              />
              <Typography variant="body2">
                {availabilityPercentage > 20 
                  ? 'Seats are available for booking'
                  : 'Limited seats available! Book now'}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </StyledCard>
  );
}

AppSeatAvailability.propTypes = {
  statistics: PropTypes.shape({
    total: PropTypes.number,
    available: PropTypes.number,
    booked: PropTypes.number,
    occupied: PropTypes.number,
    maintenance: PropTypes.number,
    todayBookings: PropTypes.number,
    occupancyRate: PropTypes.string,
  }),
};
