import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Divider
} from "@mui/material";

import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import TableToolbar from '../../../../components/table-toolbar';
import FilterDrawer from '../../../../components/filter-drawer';
import { applySortFilter, getComparator } from '../../../../utils/tableOperations';
import { exportToCSV } from '../../../../utils/exportData';
import { checkInApi } from '../../../../services/api';
import CheckInOutListHead from "./CheckInOutListHead";
import CheckInDialog from "./CheckInDialog";
import CheckOutDialog from "./CheckOutDialog";


const TABLE_HEAD = [
  { id: "student", label: "Student", alignRight: false },
  { id: "rfidCard", label: "RFID Card", alignRight: false },
  { id: "checkInTime", label: "Check-In Time", alignRight: false },
  { id: "checkOutTime", label: "Check-Out Time", alignRight: false },
  { id: "timeSpent", label: "Time Spent", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "", label: "Actions", alignRight: true }
];

// Helper function to calculate time spent
const calculateTimeSpent = (checkInTime, checkOutTime) => {
  if (!checkInTime) return "--";

  const startTime = new Date(checkInTime);
  const endTime = checkOutTime ? new Date(checkOutTime) : new Date();
  const diffMs = endTime - startTime;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

const CheckInOutPage = () => {
  // Table state
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('checkInTime');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Data state
  const [checkIns, setCheckIns] = useState([]);
  const [filteredCheckIns, setFilteredCheckIns] = useState([]);
  const [selectedCheckInId, setSelectedCheckInId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isCheckOutDialogOpen, setIsCheckOutDialogOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    selectedDate: ''
  });

  // RFID scanning state
  const [rfidScanning, setRfidScanning] = useState(false);
  const [scanningType, setScanningType] = useState(null); // 'checkin' or 'checkout'

  // Load data
  useEffect(() => {
    getAllCheckIns();
  }, []);

  // call manually on apply
  const handleApplyFilters = () => {
    getAllCheckIns(filters);
  };

  // Apply search and filters
  // useEffect(() => {
  //   setFilteredCheckIns(checkIns);
  // }, [checkIns]);
  useEffect(() => {
    let result = [...checkIns];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      result = result.filter((checkIn) =>
        checkIn.student?.name?.toLowerCase().includes(query) ||
        checkIn.student?.scholarNumber?.toLowerCase().includes(query) ||
        checkIn.rfidCard?.toLowerCase().includes(query)
      );
    }

    setFilteredCheckIns(result);

  }, [checkIns, searchQuery]);

  const getAllCheckIns = async (customFilters = filters) => {
    try {
      setIsTableLoading(true);

      const { checkInsList } = await checkInApi.getAll({
        status: customFilters.status,
        date: customFilters.dateRange,
        selectedDate: customFilters.selectedDate
      });

      setCheckIns(checkInsList);

    } catch (error) {
      console.error("API ERROR:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleRFIDTap = async (rfidCard) => {
    try {
      const res = await checkInApi.tap(rfidCard);

      if (res.type === "checkin") {
        toast.success(`${res.student.name} entered`);
      } else {
        toast.success(`${res.student.name} exited (${res.duration} min)`);
      }

      getAllCheckIns();
      handleCloseCheckInDialog();
    } catch (err) {
      toast.error(err.response?.data?.message || "RFID failed");
    }
  };

  const handleManualCheckIn = async (rfidCard) => {
    try {
      const res = await checkInApi.checkIn(rfidCard);

      toast.success(`🟢 ${res.student.name} checked in`);
      getAllCheckIns();
      handleCloseCheckInDialog();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleManualCheckOut = async (id) => {
    try {
      const res = await checkInApi.checkOut(id);

      toast.success(`🔴 ${res.student.name} checked out`);
      getAllCheckIns();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  // RFID scanning
  const startRFIDScan = (type) => {
    setScanningType(type);
    setRfidScanning(true);
    toast.success("Ready to scan... Tap the RFID card on scanner");

    // Simulate RFID scan (in real implementation, this would listen to RFID reader)
    setTimeout(() => {
      const mockRfidData = "RFID-STU-2024-001";
      handleRFIDTap(mockRfidData);
      setRfidScanning(false);
    }, 2000);
  };

  // Handler functions
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => {
      const updated = { ...prev, [filterName]: value };

      // if preset selected → clear custom
      if (filterName === 'dateRange') {
        updated.selectedDate = '';
      }

      // if custom date selected → disable preset
      if (filterName === 'selectedDate') {
        updated.dateRange = 'custom';
      }

      return updated;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      selectedDate: ''
    });
    setSearchQuery('');
    toast.success('Filters reset');
  };

  const handleExport = () => {
    const columns = [
      { field: 'student.name', headerName: 'Student Name' },
      { field: 'student.scholarNumber', headerName: 'Scholar Number' },
      { field: 'rfidCard', headerName: 'RFID Card' },
      { field: 'checkInTime', headerName: 'Check-In Time' },
      { field: 'checkOutTime', headerName: 'Check-Out Time' },
      { field: 'timeSpent', headerName: 'Time Spent' },
      { field: 'status', headerName: 'Status' }
    ];

    exportToCSV(filteredCheckIns, columns, 'check-in-out-records.csv');
    toast.success('Data exported successfully');
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenMenu = (event, id) => {
    setIsMenuOpen(event.currentTarget);
    setSelectedCheckInId(id);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(null);
    setSelectedCheckInId(null);
  };

  const handleOpenCheckInDialog = () => {
    setIsCheckInDialogOpen(true);
  };

  const handleCloseCheckInDialog = () => {
    setIsCheckInDialogOpen(false);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCheckIns.length) : 0;

  // Statistics calculations
  const todayCheckIns = checkIns.filter(c => {
    const today = new Date();
    const checkInDate = new Date(c.checkInTime);
    return checkInDate.toDateString() === today.toDateString();
  });

  const activeCheckIns = checkIns.filter(c => c.status === 'checked-in').length;
  const totalCheckInsToday = todayCheckIns.length;
  const totalCheckOutsToday = todayCheckIns.filter(c => c.status === 'checked-out').length;

  // Calculate average time spent today
  const avgTimeSpentToday = () => {
    const completedToday = todayCheckIns.filter(c => c.checkOutTime);
    if (completedToday.length === 0) return "N/A";

    const totalMinutes = completedToday.reduce((sum, c) => {
      const diff = new Date(c.checkOutTime) - new Date(c.checkInTime);
      return sum + (diff / (1000 * 60));
    }, 0);

    const avgMinutes = Math.floor(totalMinutes / completedToday.length);
    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <Helmet>
        <title>Check-In/Check-Out Management | Smart Library</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Student Check-In/Check-Out Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:nfc" />}
            onClick={handleOpenCheckInDialog}
            disabled={rfidScanning}
          >
            {rfidScanning ? "Scanning..." : "Tap / Manual Entry"}
          </Button>
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="mdi:login"
                sx={{ width: 48, height: 48, color: 'primary.main', mb: 1, mx: 'auto' }}
              />
              <Typography variant="h4">{totalCheckInsToday}</Typography>
              <Typography variant="body2" color="text.secondary">
                Check-Ins Today
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="mdi:logout"
                sx={{ width: 48, height: 48, color: 'success.main', mb: 1, mx: 'auto' }}
              />
              <Typography variant="h4">{totalCheckOutsToday}</Typography>
              <Typography variant="body2" color="text.secondary">
                Check-Outs Today
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="mdi:account-check"
                sx={{ width: 48, height: 48, color: 'warning.main', mb: 1, mx: 'auto' }}
              />
              <Typography variant="h4">{activeCheckIns}</Typography>
              <Typography variant="body2" color="text.secondary">
                Currently In Library
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Iconify
                icon="mdi:clock-outline"
                sx={{ width: 48, height: 48, color: 'info.main', mb: 1, mx: 'auto' }}
              />
              <Typography variant="h4">{avgTimeSpentToday()}</Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Time Today
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <TableToolbar
            filterValue={searchQuery}
            onFilterChange={handleSearchChange}
            onFilterOpen={() => setIsFilterOpen(true)}
            onExport={handleExport}
            placeholder="Search by student name, scholar number, or RFID..."
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              {isTableLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table >
                  <CheckInOutListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={filteredCheckIns.length}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredCheckIns
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { _id, student, rfidCard, checkInTime, checkOutTime, status } = row;
                        const timeSpent = calculateTimeSpent(checkInTime, checkOutTime);

                        return (
                          <TableRow hover key={_id} tabIndex={-1} >

                            <TableCell align="left">
                              <Stack spacing={0.5}>
                                <Typography variant="subtitle2">
                                  {student?.name}
                                </Typography>

                                <Typography variant="caption" color="text.secondary">
                                  {student?.email}
                                </Typography>

                                <Typography variant="caption" color="text.secondary">
                                  🎓 {student?.scholarNumber} • {student?.enrollmentNumber}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">
                              <Chip
                                label={rfidCard || "N/A"}
                                size="small"
                                color="default"
                                variant="outlined"
                              />
                            </TableCell>

                            <TableCell align="left">
                              {checkInTime ? new Date(checkInTime).toLocaleString() : "--"}
                            </TableCell>

                            <TableCell align="left">
                              {checkOutTime ? new Date(checkOutTime).toLocaleString() : "--"}
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="body2" fontWeight="bold">
                                {timeSpent}
                              </Typography>
                            </TableCell>

                            <TableCell align="left">
                              <Label
                                color={status === "checked-in" ? "success" : "default"}
                              >
                                {status === "checked-in" ? "🟢 In Library" : "⚪ Checked Out"}
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">

                                {/* RFID Tap */}
                                {/* <IconButton
                                  color="primary"
                                  onClick={() => handleRFIDTap(rfidCard)}
                                >
                                  <Iconify icon="mdi:gesture-tap" />
                                </IconButton> */}

                                {/* Manual Checkout */}
                                {status === "checked-in" ? (
                                  <IconButton
                                    color="error"
                                    onClick={() => handleManualCheckOut(_id)}
                                  >
                                    <Iconify icon="mdi:logout" />
                                  </IconButton>
                                ) : (
                                  <IconButton disabled>
                                    <Iconify icon="mdi:logout-variant" />
                                  </IconButton>
                                )}

                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={9} />
                      </TableRow>
                    )}
                  </TableBody>

                  {filteredCheckIns.length === 0 && !isTableLoading && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
                          <Paper sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h6" paragraph>
                              No check-in records found
                            </Typography>
                            <Typography variant="body2">
                              {searchQuery || filters.status !== 'all' || filters.dateRange !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Start by checking in a student using their RFID card'}
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              )}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredCheckIns.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* Filter Drawer */}
      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      >
        <Stack spacing={3}>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Status
            </Typography>
            <Stack spacing={1}>
              {['all', 'checked-in', 'checked-out'].map((statusOption) => (
                <Button
                  key={statusOption}
                  variant={filters.status === statusOption ? 'contained' : 'outlined'}
                  onClick={() => handleFilterChange('status', statusOption)}
                  fullWidth
                >
                  {statusOption === 'all' ? 'All' : statusOption === 'checked-in' ? 'In Library' : 'Checked Out'}
                </Button>
              ))}
            </Stack>
          </div>

          <Divider />

          <div>
            <Typography variant="subtitle2" gutterBottom>
              Date Range
            </Typography>
            <Stack spacing={1}>
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 Days' },
                { value: 'month', label: 'Last 30 Days' },
                { value: 'all', label: 'All Time' }
              ].map((dateOption) => (
                <Button
                  key={dateOption.value}
                  variant={filters.dateRange === dateOption.value ? 'contained' : 'outlined'}
                  onClick={() => handleFilterChange('dateRange', dateOption.value)}
                  fullWidth
                >
                  {dateOption.label}
                </Button>
              ))}
            </Stack>
            {/* Date Filter */}
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Custom Date Range
            </Typography>

            <Stack spacing={2}>
              <TextField
                type="date"
                value={filters.selectedDate}
                onChange={(e) => handleFilterChange('selectedDate', e.target.value)}
              />
            </Stack>
          </div>
        </Stack>
      </FilterDrawer>

      {/* Check-In Dialog */}
      <CheckInDialog
        open={isCheckInDialogOpen}
        onClose={handleCloseCheckInDialog}
        onCheckIn={(rfid) => handleManualCheckIn(rfid)}
        rfidScanning={rfidScanning}
        onStartScan={() => startRFIDScan('checkin')}
      />
    </>
  );
};

export default CheckInOutPage;
