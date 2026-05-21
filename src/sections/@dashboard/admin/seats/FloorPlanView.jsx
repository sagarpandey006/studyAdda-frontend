import PropTypes from 'prop-types';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';

const FloorPlanContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1.5),
  minHeight: 500,
  border: '1px solid',
  borderColor: theme.palette.grey[200],
}));

const SectionBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[1],
  '&:hover': {
    boxShadow: theme.shadows[2],
    transform: 'translateY(-1px)',
  },
  transition: 'all 0.2s ease-in-out',
}));

const EntranceBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.success.main,
  color: 'white',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1.5),
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  boxShadow: theme.shadows[3],
  fontSize: '0.875rem',
  
}));

const FacilityMarker = styled(Box)(({ theme, type }) => {
  const colors = {
    restroom: theme.palette.info.main,
    water: theme.palette.info.main,
    exit: theme.palette.error.main,
  };

  return {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: theme.spacing(1.5),
    backgroundColor: colors[type] || theme.palette.grey[400],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: theme.shadows[2],
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: theme.shadows[3],
    },
    transition: 'all 0.2s ease-in-out',
  };
});

export default function FloorPlanView({ floor, statistics }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
          Floor {floor} Layout
        </Typography>

        <FloorPlanContainer>
          {/* Main Entrance */}
          <EntranceBox sx={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}>
            <Iconify icon="solar:door-bold" width={20} />
            <Typography variant="caption" fontWeight={600}>Entrance</Typography>
          </EntranceBox>

          {/* Section A - Top Left */}
          <SectionBox sx={{ top: 60, left: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section A
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quiet Study Zone
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:volume-off" width={20} color="success.main" />
                <Iconify icon="mdi:desk-lamp" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Section B - Top Right */}
          <SectionBox sx={{ top: 60, right: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section B
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Group Study Area
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:account-group" width={20} color="success.main" />
                <Iconify icon="mdi:desk" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Section C - Bottom Left */}
          <SectionBox sx={{ bottom: 60, left: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section C
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Computer Workstations
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:monitor" width={20} color="success.main" />
                <Iconify icon="mdi:power-plug" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Section D - Bottom Right */}
          <SectionBox sx={{ bottom: 60, right: 20, width: '45%', height: '40%' }}>
            <Stack spacing={1}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                Section D
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reading Lounge
              </Typography>
              <Box display="flex" gap={1} mt={1}>
                <Iconify icon="mdi:book-open-page-variant" width={20} color="success.main" />
                <Iconify icon="mdi:lamp" width={20} color="warning.main" />
                <Iconify icon="mdi:wifi" width={20} color="info.main" />
              </Box>
              {statistics && (
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  15 Seats
                </Typography>
              )}
            </Stack>
          </SectionBox>

          {/* Facilities */}
          <FacilityMarker type="restroom" sx={{ top: '50%', left: 10, transform: 'translateY(-50%)' }}>
            <Iconify icon="solar:user-bold" width={18} />
          </FacilityMarker>

          <FacilityMarker type="water" sx={{ top: '50%', right: 10, transform: 'translateY(-50%)' }}>
            <Iconify icon="solar:cup-hot-bold" width={18} />
          </FacilityMarker>

          <FacilityMarker type="exit" sx={{ bottom: 10, left: '25%' }}>
            <Iconify icon="solar:logout-2-bold" width={18} />
          </FacilityMarker>

          <FacilityMarker type="exit" sx={{ bottom: 10, right: '25%' }}>
            <Iconify icon="solar:logout-2-bold" width={18} />
          </FacilityMarker>

          {/* Central Info Area */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 2,
                }}
              >
                <Stack alignItems="center" spacing={0.5}>
                  <Iconify icon="solar:info-circle-bold" width={32} color="white" />
                  <Typography variant="caption" color="white" fontWeight={600}>
                    Info Desk
                  </Typography>
                </Stack>
              </Box>
              {statistics && (
                <Card sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {statistics.available}/{statistics.total}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Available Seats
                  </Typography>
                </Card>
              )}
            </Stack>
          </Box>
        </FloorPlanContainer>

        {/* Legend */}
        <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1.5}>
          <Typography variant="subtitle2" fontWeight={600} mb={1.5} color="text.primary">
            Floor Plan Legend
          </Typography>
          <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: 1,
                  bgcolor: 'info.main',
                }}
              />
              <Typography variant="caption" color="text.secondary">Restrooms</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: 1,
                  bgcolor: 'info.main',
                }}
              />
              <Typography variant="caption" color="text.secondary">Refreshments</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: 1,
                  bgcolor: 'error.main',
                }}
              />
              <Typography variant="caption" color="text.secondary">Exit Points</Typography>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

FloorPlanView.propTypes = {
  floor: PropTypes.number.isRequired,
  statistics: PropTypes.object,
};
