import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import Label from '../../../../components/label';
import { fDate } from '../../../../utils/formatTime';
import { borrowalApi } from '../../../../services/api';

const TABLE_HEAD = [
  { id: 'bookTitle', label: 'Book Details', alignRight: false },
  { id: 'userName', label: 'Member Details', alignRight: false },
  { id: 'issueDate', label: 'Issue Date', alignRight: false },
  { id: 'dueDate', label: 'Due Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'rfidTag', label: 'RFID Tag', alignRight: false },
  { id: 'fine', label: 'Fine (₹)', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: false },
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
    return filter(array, (_issue) => _issue.bookTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function IssueReturnManagementPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('bookTitle');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rfidDialogOpen, setRfidDialogOpen] = useState(false);
  const [rfidScanResult, setRfidScanResult] = useState('');
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [issueReturns, setIssueReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchBorrowals();
  }, []);

  const fetchBorrowals = async () => {
    try {
      const res = await borrowalApi.getAll();
      setIssueReturns(res.borrowalsList);
      // console.log("check api is working: ", res.borrowalsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued':
        return 'info';
      case 'overdue':
        return 'error';
      case 'returned':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleRFIDScan = () => {
    setRfidDialogOpen(true);
  };

  const handleIssueBook = () => {
    setIssueDialogOpen(true);
  };

  const handleReturnBook = async (row) => {
    try {
      await borrowalApi.returnBook({
        bookId: row._id,
        returnDate: new Date(),
      });

      fetchBorrowals();
    } catch (err) {
      console.error(err);
    }
  };

  // const handleRFIDSubmit = async () => {
  //   try {
  //     const res = await checkInApi.checkOutByRFID(rfidScanResult);
  //     alert(res.message);
  //     fetchBorrowals();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleIssueSubmit = async () => {
    try {
      await borrowalApi.issueBook({
        studentId,
        bookId,
        dueDate,
      });

      setIssueDialogOpen(false);
      fetchBorrowals();
    } catch (err) {
      console.error(err);
    }
  };

  const processRFIDScan = () => {
    // Simulate RFID processing
    if (rfidScanResult) {
      const foundTransaction = issueReturns.find(item => item.rfidTag === rfidScanResult);
      if (foundTransaction) {
        if (foundTransaction.status === 'issued' || foundTransaction.status === 'overdue') {
          handleReturnBook(foundTransaction);
        }
        setRfidDialogOpen(false);
        setRfidScanResult('');
      } else {
        alert('RFID tag not found in system');
      }
    }
  };

  const filteredIssueReturns = applySortFilter(issueReturns, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredIssueReturns.length && !!filterName;

  return (
    <>
      <Helmet>
        <title>Issue/Return Management | Smart Library System</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Issue/Return Management - RFID Integration
          </Typography>
          <Stack direction="row" spacing={2}>
            {/* <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:wifi-fill" />}
              onClick={handleRFIDScan}
              color="info"
            >
              RFID Scanner
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleIssueBook}
            >
              Issue Book
            </Button> */}
          </Stack>
        </Stack>

        {/* Statistics Cards */}
        <Stack direction="row" spacing={3} mb={3}>
          <Card sx={{ p: 3, flex: 1, bgcolor: 'primary.lighter' }}>
            <Typography variant="h3" color="primary.main">
              {issueReturns.filter(item => item.status === 'issued').length}
            </Typography>
            <Typography variant="subtitle2">Books Issued</Typography>
          </Card>
          <Card sx={{ p: 3, flex: 1, bgcolor: 'error.lighter' }}>
            <Typography variant="h3" color="error.main">
              {issueReturns.filter(item => item.status === 'overdue').length}
            </Typography>
            <Typography variant="subtitle2">Overdue Books</Typography>
          </Card>
          <Card sx={{ p: 3, flex: 1, bgcolor: 'success.lighter' }}>
            <Typography variant="h3" color="success.main">
              {issueReturns.filter(item => item.status === 'returned').length}
            </Typography>
            <Typography variant="subtitle2">Returned Today</Typography>
          </Card>
          <Card sx={{ p: 3, flex: 1, bgcolor: 'warning.lighter' }}>
            <Typography variant="h3" color="warning.main">
              ₹{issueReturns.reduce((sum, item) => sum + item.fine, 0)}
            </Typography>
            <Typography variant="subtitle2">Total Fines</Typography>
          </Card>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableBody>
                  {filteredIssueReturns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, bookTitle, userName, userEmail, userId, issueDate, dueDate, returnDate, status, rfidTag, fine, bookId } = row;
                    const selectedIssue = selected.indexOf(id) !== -1;

                    return (
                      <TableRow hover key={row._id}>

                        {/* BOOK */}
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle2">
                              {row.book?.name}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                              ISBN: {row.book?.isbn}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* USER */}
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle2">
                              {row.user?.name}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                              {row.user?.email}
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                              🎓 {row.user?.scholarNumber} • {row.user?.enrollmentNumber}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* ISSUE */}
                        <TableCell>{fDate(row.issueDate)}</TableCell>

                        {/* DUE */}
                        <TableCell>
                          <Typography
                            color={
                              row.status !== "returned" &&
                                new Date(row.dueDate) < new Date()
                                ? "error.main"
                                : "text.primary"
                            }
                          >
                            {fDate(row.dueDate)}
                          </Typography>
                        </TableCell>

                        {/* STATUS */}
                        <TableCell>
                          <Label
                            color={
                              row.status === "issued"
                                ? "info"
                                : row.status === "overdue"
                                  ? "error"
                                  : "success"
                            }
                          >
                            {row.status}
                          </Label>
                        </TableCell>

                        {/* FINE */}
                        <TableCell>
                          <Typography
                            sx={{
                              color: row.fine > 0 ? "error.main" : "text.secondary",
                              fontWeight: row.fine > 0 ? "bold" : "normal",
                            }}
                          >
                            ₹{row.fine}
                          </Typography>
                        </TableCell>

                        {/* ACTION */}
                        <TableCell>
                          {row.status !== "returned" ? (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleReturnBook(row)}
                            >
                              Return
                            </Button>
                          ) : (
                            <Chip label="Returned" color="success" size="small" />
                          )}
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>
                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
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
            count={issueReturns.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        {/* RFID Scanner Dialog */}
        <Dialog open={rfidDialogOpen} onClose={() => setRfidDialogOpen(false)}>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="eva:wifi-fill" />
              <Typography variant="h6">RFID Scanner</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: 400, p: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Place the book near the RFID scanner or enter RFID tag manually
              </Alert>
              <TextField
                fullWidth
                label="RFID Tag"
                value={rfidScanResult}
                onChange={(e) => setRfidScanResult(e.target.value)}
                placeholder="e.g., RFID001"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Scanning for RFID tags...
                <Box component="span" sx={{ color: 'primary.main', ml: 1 }}>
                  📡 Ready
                </Box>
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRfidDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={processRFIDScan}
              disabled={!rfidScanResult}
            >
              Process Scan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Issue Book Dialog */}
        <Dialog open={issueDialogOpen} onClose={() => setIssueDialogOpen(false)}>
          <DialogTitle>Issue New Book</DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: 400, p: 2 }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />

                <TextField
                  fullWidth
                  label="Book ID"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                />
                {/* <TextField
                  fullWidth
                  label="RFID Tag"
                  placeholder="Scan RFID tag or enter manually"
                /> */}
                <TextField
                  fullWidth
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIssueDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleIssueSubmit}>
              Issue Book
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}