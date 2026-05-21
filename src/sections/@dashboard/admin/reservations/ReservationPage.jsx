import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  CircularProgress,
  Box,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../hooks/useAuth';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import Label from '../../../../components/label';
import { fDate } from '../../../../utils/formatTime';
import MockDataService from '../../../../utils/mockDataService';

// Hardcoded reservation data
const HARDCODED_RESERVATIONS = [
  {
    _id: 'res1',
    seatNumber: '1A01',
    user: { _id: 'user3', name: 'Amit Patel', email: 'amit.patel@email.com', studentId: 'ST001' },
    reservationDate: new Date('2024-12-01'),
    startTime: new Date('2024-12-01T09:00:00'),
    endTime: new Date('2024-12-01T13:00:00'),
    status: 'confirmed',
    purpose: 'Study session - Mathematics',
    floor: 1,
    section: 'A',
    contactNumber: '+91 9876543210'
  },
  {
    _id: 'res2',
    seatNumber: '2B05',
    user: { _id: 'user4', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', studentId: 'ST002' },
    reservationDate: new Date('2024-12-02'),
    startTime: new Date('2024-12-02T14:00:00'),
    endTime: new Date('2024-12-02T18:00:00'),
    status: 'confirmed',
    purpose: 'Research work - Computer Science',
    floor: 2,
    section: 'B',
    contactNumber: '+91 9876543211'
  },
  {
    _id: 'res3',
    seatNumber: '1C03',
    user: { _id: 'user5', name: 'Vikram Singh', email: 'vikram.singh@email.com', studentId: 'ST003' },
    reservationDate: new Date('2024-12-03'),
    startTime: new Date('2024-12-03T10:00:00'),
    endTime: new Date('2024-12-03T16:00:00'),
    status: 'confirmed',
    purpose: 'Group study - Physics',
    floor: 1,
    section: 'C',
    contactNumber: '+91 9876543212'
  },
  {
    _id: 'res4',
    seatNumber: '3A02',
    user: { _id: 'user1', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@email.com', studentId: 'FC001' },
    reservationDate: new Date('2024-11-29'),
    startTime: new Date('2024-11-29T11:00:00'),
    endTime: new Date('2024-11-29T15:00:00'),
    status: 'cancelled',
    purpose: 'Exam preparation - Statistics',
    floor: 3,
    section: 'A',
    contactNumber: '+91 9876543213'
  },
  {
    _id: 'res5',
    seatNumber: '2D01',
    user: { _id: 'user2', name: 'Priya Sharma', email: 'priya.sharma@email.com', studentId: 'ST004' },
    reservationDate: new Date('2024-12-04'),
    startTime: new Date('2024-12-04T08:00:00'),
    endTime: new Date('2024-12-04T12:00:00'),
    status: 'confirmed',
    purpose: 'Project work - Software Engineering',
    floor: 2,
    section: 'D',
    contactNumber: '+91 9876543214'
  },
  {
    _id: 'res6',
    seatNumber: '1B02',
    user: { _id: 'user6', name: 'Arjun Mehta', email: 'arjun.mehta@email.com', studentId: 'ST005' },
    reservationDate: new Date('2024-12-05'),
    startTime: new Date('2024-12-05T13:00:00'),
    endTime: new Date('2024-12-05T17:00:00'),
    status: 'confirmed',
    purpose: 'Individual study - Chemistry',
    floor: 1,
    section: 'B',
    contactNumber: '+91 9876543215'
  },
  {
    _id: 'res7',
    seatNumber: '3C04',
    user: { _id: 'user7', name: 'Kavya Nair', email: 'kavya.nair@email.com', studentId: 'ST006' },
    reservationDate: new Date('2024-12-06'),
    startTime: new Date('2024-12-06T10:00:00'),
    endTime: new Date('2024-12-06T14:00:00'),
    status: 'pending',
    purpose: 'Thesis writing - Literature',
    floor: 3,
    section: 'C',
    contactNumber: '+91 9876543216'
  },
  {
    _id: 'res8',
    seatNumber: '2A03',
    user: { _id: 'user8', name: 'Rohit Gupta', email: 'rohit.gupta@email.com', studentId: 'ST007' },
    reservationDate: new Date('2024-12-07'),
    startTime: new Date('2024-12-07T09:00:00'),
    endTime: new Date('2024-12-07T12:00:00'),
    status: 'confirmed',
    purpose: 'Exam preparation - Biology',
    floor: 2,
    section: 'A',
    contactNumber: '+91 9876543217'
  },
  {
    _id: 'res9',
    seatNumber: '1D05',
    user: { _id: 'user9', name: 'Ananya Das', email: 'ananya.das@email.com', studentId: 'ST008' },
    reservationDate: new Date('2024-11-28'),
    startTime: new Date('2024-11-28T15:00:00'),
    endTime: new Date('2024-11-28T19:00:00'),
    status: 'completed',
    purpose: 'Group discussion - Economics',
    floor: 1,
    section: 'D',
    contactNumber: '+91 9876543218'
  },
  {
    _id: 'res10',
    seatNumber: '3B01',
    user: { _id: 'user10', name: 'Siddharth Joshi', email: 'siddharth.joshi@email.com', studentId: 'ST009' },
    reservationDate: new Date('2024-12-08'),
    startTime: new Date('2024-12-08T11:00:00'),
    endTime: new Date('2024-12-08T16:00:00'),
    status: 'confirmed',
    purpose: 'Research work - Data Science',
    floor: 3,
    section: 'B',
    contactNumber: '+91 9876543219'
  },
  {
    _id: 'res11',
    seatNumber: '2C02',
    user: { _id: 'user11', name: 'Meera Iyer', email: 'meera.iyer@email.com', studentId: 'ST010' },
    reservationDate: new Date('2024-12-09'),
    startTime: new Date('2024-12-09T08:30:00'),
    endTime: new Date('2024-12-09T12:30:00'),
    status: 'pending',
    purpose: 'Project presentation prep - Marketing',
    floor: 2,
    section: 'C',
    contactNumber: '+91 9876543220'
  },
  {
    _id: 'res12',
    seatNumber: '1A04',
    user: { _id: 'user12', name: 'Karan Malhotra', email: 'karan.malhotra@email.com', studentId: 'ST011' },
    reservationDate: new Date('2024-11-27'),
    startTime: new Date('2024-11-27T14:00:00'),
    endTime: new Date('2024-11-27T18:00:00'),
    status: 'cancelled',
    purpose: 'Study session - Mechanical Engineering',
    floor: 1,
    section: 'A',
    contactNumber: '+91 9876543221'
  },
  {
    _id: 'res13',
    seatNumber: '3D03',
    user: { _id: 'user13', name: 'Ritika Agarwal', email: 'ritika.agarwal@email.com', studentId: 'ST012' },
    reservationDate: new Date('2024-12-10'),
    startTime: new Date('2024-12-10T10:30:00'),
    endTime: new Date('2024-12-10T15:30:00'),
    status: 'confirmed',
    purpose: 'Individual study - Psychology',
    floor: 3,
    section: 'D',
    contactNumber: '+91 9876543222'
  },
  {
    _id: 'res14',
    seatNumber: '2B04',
    user: { _id: 'user14', name: 'Manish Kumar', email: 'manish.kumar@email.com', studentId: 'ST013' },
    reservationDate: new Date('2024-12-11'),
    startTime: new Date('2024-12-11T12:00:00'),
    endTime: new Date('2024-12-11T17:00:00'),
    status: 'confirmed',
    purpose: 'Coding practice - Software Development',
    floor: 2,
    section: 'B',
    contactNumber: '+91 9876543223'
  },
  {
    _id: 'res15',
    seatNumber: '1C01',
    user: { _id: 'user15', name: 'Pooja Verma', email: 'pooja.verma@email.com', studentId: 'ST014' },
    reservationDate: new Date('2024-12-12'),
    startTime: new Date('2024-12-12T09:30:00'),
    endTime: new Date('2024-12-12T13:30:00'),
    status: 'pending',
    purpose: 'Dissertation work - History',
    floor: 1,
    section: 'C',
    contactNumber: '+91 9876543224'
  }
];

const TABLE_HEAD = [
  { id: 'seatNumber', label: 'Seat Number', alignRight: false },
  { id: 'userName', label: 'User Name', alignRight: false },
  { id: 'reservationDate', label: 'Reservation Date', alignRight: false },
  { id: 'startTime', label: 'Start Time', alignRight: false },
  { id: 'endTime', label: 'End Time', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_reservation) => _reservation.seatNumber.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ReservationPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(null);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('seatNumber');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredReservations;
      if (user.isAdmin) {
        // Admin sees all reservations
        filteredReservations = HARDCODED_RESERVATIONS;
      } else {
        // Users see only their own reservations
        filteredReservations = HARDCODED_RESERVATIONS.filter(res => res.user._id === user._id);
      }
      
      setReservations(filteredReservations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to load reservations');
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update the reservation status to cancelled in local state
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res._id === selectedReservationId 
            ? { ...res, status: 'cancelled' }
            : res
        )
      );
      
      toast.success('Reservation cancelled successfully');
      handleCloseMenu();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Failed to cancel reservation');
    }
  };

  const handleOpenMenu = (event, reservationId) => {
    setOpen(event.currentTarget);
    setSelectedReservationId(reservationId);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = reservations.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const filteredReservations = applySortFilter(reservations, getComparator(order, orderBy), filterName);

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
        <title>Reservations Management | StudyAdda</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {user.isAdmin ? 'All Seat Reservations' : 'My Seat Reservations'} - Smart Library System
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<Iconify icon="eva:search-fill" />}>
              Search Reservations
            </Button>
            <Button variant="outlined" startIcon={<Iconify icon="eva:download-fill" />}>
              Export Report
            </Button>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Reservation
            </Button>
          </Stack>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <thead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < reservations.length}
                        checked={reservations.length > 0 && selected.length === reservations.length}
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.alignRight ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        <Typography variant="subtitle2">
                          {headCell.label}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </thead>
                <TableBody>
                  {filteredReservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, seatNumber, user: reservationUser, reservationDate, startTime, endTime, status } = row;
                    const selectedReservation = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedReservation}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedReservation} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {seatNumber}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{reservationUser?.name || 'Unknown User'}</TableCell>

                        <TableCell align="left">{fDate(reservationDate)}</TableCell>

                        <TableCell align="left">{new Date(startTime).toLocaleString()}</TableCell>

                        <TableCell align="left">{new Date(endTime).toLocaleString()}</TableCell>

                        <TableCell align="left">
                          <Label color={status === 'confirmed' ? 'success' : status === 'cancelled' ? 'error' : 'warning'}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, _id)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={reservations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 160,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => {
          // View details functionality can be added here
          toast.info('View details coming soon');
          handleCloseMenu();
        }}>
          <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
          View Details
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleCancelReservation}>
          <Iconify icon={'eva:close-circle-fill'} sx={{ mr: 2 }} />
          Cancel Reservation
        </MenuItem>
      </Popover>
    </>
  );
}