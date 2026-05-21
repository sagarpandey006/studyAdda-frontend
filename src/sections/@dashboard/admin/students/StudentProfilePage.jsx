import { Helmet } from "react-helmet-async";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

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
  Alert
} from "@mui/material";

import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import { userApi, borrowalApi } from '../../../../services/api';

import IssueBookDialog from './IssueBookDialog';
import ReturnBookDialog from './ReturnBookDialog';
import CollectFineDialog from './CollectFineDialog';
import BlockStudentDialog from './BlockStudentDialog';

// 

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  
  // Dialog states
  const [issueBookDialogOpen, setIssueBookDialogOpen] = useState(false);
  const [returnBookDialogOpen, setReturnBookDialogOpen] = useState(false);
  const [collectFineDialogOpen, setCollectFineDialogOpen] = useState(false);
  const [blockStudentDialogOpen, setBlockStudentDialogOpen] = useState(false);

  const loadStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentData, rawIssued, rawHistory] = await Promise.all([
        userApi.getById(studentId),
        borrowalApi.getIssuedByStudent(studentId),
        borrowalApi.getHistoryByStudent(studentId)
      ]);

      // Normalize borrowals to the shape StudentProfilePage and dialogs expect
      const normalizeBorrowal = (b) => {
        const today = new Date();
        const due = new Date(b.dueDate);
        const isOverdue = today > due && b.status !== 'returned';
        const lateDays = isOverdue ? Math.ceil((today - due) / (1000 * 60 * 60 * 24)) : 0;
        return {
          ...b,
          bookName: b.bookId?.name || 'Unknown',
          isOverdue,
          lateDays,
          fine: b.fine || b.calculatedFine || 0,
        };
      };

      setStudent(studentData);
      setIssuedBooks(rawIssued.map(normalizeBorrowal));
      setTransactionHistory(rawHistory.map(normalizeBorrowal));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadStudentData();
  }, [studentId, loadStudentData]);

  const handlePrintCard = () => {
    toast.success("Printing library card...");
    // Implementation for printing library card
  };

  const handleExportPDF = () => {
    toast.success("Exporting to PDF...");
    // Implementation for PDF export
  };

  const handleExportExcel = () => {
    toast.success("Exporting to Excel...");
    // Implementation for Excel export
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

  if (!student) {
    return (
      <Container>
        <Alert severity="error">Student not found</Alert>
        <Button onClick={() => navigate('/admin/students')} sx={{ mt: 2 }}>
          Back to Student Management
        </Button>
      </Container>
    );
  }

  const overdueBooks = issuedBooks.filter(book => book.isOverdue) || [];
  const totalFine = student?.fineAmount || 0;
  const unpaidFine = student?.unpaidFine || 0;

  return (
    <>
      <Helmet>
        <title> Student Profile | Library System </title>
      </Helmet>

      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => navigate('/admin/students')}>
              <Iconify icon="eva:arrow-back-fill" />
            </IconButton>
            <Typography variant="h4">
              Student Profile
            </Typography>
          </Stack>
{/*           
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:printer" />}
              onClick={handlePrintCard}
            >
              Print Card
            </Button>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:file-pdf-box" />}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:file-excel" />}
              onClick={handleExportExcel}
            >
              Export Excel
            </Button>
          </Stack> */}
        </Stack>

        <Grid container spacing={3}>
          {/* Basic Information Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <Avatar
                    src={student.photoUrl}
                    sx={{ width: 150, height: 150 }}
                  />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                      {student.fullName}
                    </Typography>
                    <Label color={getStatusColor(student.status)}>
                      {student.status}
                    </Label>
                  </Box>

                  <Divider sx={{ width: '100%' }} />

                  <Stack spacing={2} sx={{ width: '100%' }}>
                    <InfoRow 
                      icon="mdi:identifier" 
                      label="Scholar Number" 
                      value={student.scholarNumber} 
                    />
                    <InfoRow 
                      icon="mdi:card-account-details" 
                      label="Enrollment Number" 
                      value={student.enrollmentNumber} 
                    />
                    <InfoRow 
                      icon="mdi:nfc" 
                      label="RFID Card" 
                      value={student.rfidCard || 'N/A'} 
                    />
                    <InfoRow 
                      icon="mdi:school" 
                      label="Course/Branch" 
                      value={`${student.course} - ${student.branch}`} 
                    />
                    <InfoRow 
                      icon="mdi:calendar-clock" 
                      label="Year/Semester" 
                      value={`Year ${student.year} - Sem ${student.semester}`} 
                    />
                    <InfoRow 
                      icon="mdi:google-classroom" 
                      label="Section" 
                      value={student.section} 
                    />
                    <InfoRow 
                      icon="mdi:phone" 
                      label="Contact" 
                      value={student.contactNumber} 
                    />
                    <InfoRow 
                      icon="mdi:email" 
                      label="Email" 
                      value={student.email} 
                    />
                    <InfoRow 
                      icon="mdi:map-marker" 
                      label="Address" 
                      value={student.address} 
                    />
                    <InfoRow 
                      icon="mdi:calendar" 
                      label="Admission Date" 
                      value={new Date(student.admissionDate).toLocaleDateString()} 
                    />
                  </Stack>

                  <Divider sx={{ width: '100%' }} />

                  <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color={student.status === 'Blocked' ? 'success' : 'error'}
                      onClick={() => setBlockStudentDialogOpen(true)}
                    >
                      {student.status === 'Blocked' ? 'Unblock' : 'Block'}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Library Information & Actions */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Library Stats */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                    Library Information
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <StatCard
                        icon="mdi:book-open-page-variant"
                        title="Books Issued"
                        value={student.totalBooksIssued || 0}
                        color="info"
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatCard
                        icon="mdi:book-check"
                        title="Book Limit"
                        value={student.maxBookLimit || 5}
                        color="primary"
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatCard
                        icon="mdi:book-plus"
                        title="Available"
                        value={student.availableBookLimit || 5}
                        color="success"
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <StatCard
                        icon="mdi:alert-circle"
                        title="Overdue"
                        value={overdueBooks.length}
                        color="error"
                      />
                    </Grid>
                  </Grid>

                  {unpaidFine > 0 && (
                    <Alert severity="warning" sx={{ mt: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2">
                            Unpaid Fine Amount
                          </Typography>
                          <Typography variant="h5" color="warning.main">
                            ₹{unpaidFine.toFixed(2)}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => setCollectFineDialogOpen(true)}
                        >
                          Collect Fine
                        </Button>
                      </Stack>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="mdi:book-plus" />}
                      onClick={() => setIssueBookDialogOpen(true)}
                      disabled={student.availableBookLimit <= 0 || student.status === 'Blocked'}
                    >
                      Issue New Book
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Iconify icon="mdi:book-arrow-left" />}
                      onClick={() => setReturnBookDialogOpen(true)}
                      disabled={issuedBooks.length === 0}
                    >
                      Return Book
                    </Button>
                    {unpaidFine > 0 && (
                      <Button
                        variant="contained"
                        color="warning"
                        startIcon={<Iconify icon="mdi:cash" />}
                        onClick={() => setCollectFineDialogOpen(true)}
                      >
                        Collect Fine
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Currently Issued Books */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Currently Issued Books
                  </Typography>
                  
                  {issuedBooks.length === 0 ? (
                    <Alert severity="info">No books currently issued</Alert>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Book Name</TableCell>
                            <TableCell>Issue Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Fine</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {issuedBooks.map((book) => (
                            <TableRow key={book._id}>
                              <TableCell>{book.bookName}</TableCell>
                              <TableCell>{new Date(book.issueDate).toLocaleDateString()}</TableCell>
                              <TableCell>{new Date(book.dueDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Label color={book.isOverdue ? 'error' : 'success'}>
                                  {book.isOverdue ? `Overdue (${book.lateDays} days)` : 'On Time'}
                                </Label>
                              </TableCell>
                              <TableCell>
                                {book.fine > 0 ? `₹${book.fine.toFixed(2)}` : '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>

              {/* Transaction History */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Transaction History
                  </Typography>
                  
                  {transactionHistory.length === 0 ? (
                    <Alert severity="info">No transaction history</Alert>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Book Name</TableCell>
                            <TableCell>Issue Date</TableCell>
                            <TableCell>Return Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Late Days</TableCell>
                            <TableCell>Fine</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {transactionHistory.map((transaction) => (
                            <TableRow key={transaction._id}>
                              <TableCell>{transaction.bookName}</TableCell>
                              <TableCell>
                                {new Date(transaction.issueDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {transaction.returnDate 
                                  ? new Date(transaction.returnDate).toLocaleDateString() 
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {new Date(transaction.dueDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {transaction.lateDays > 0 ? transaction.lateDays : '-'}
                              </TableCell>
                              <TableCell>
                                {transaction.fine > 0 ? `₹${transaction.fine.toFixed(2)}` : '-'}
                              </TableCell>
                              <TableCell>
                                <Label color={transaction.fineStatus === 'Paid' ? 'success' : 'warning'}>
                                  {transaction.fineStatus || 'No Fine'}
                                </Label>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>

              {/* Lost/Damaged Books */}
              {student.lostDamagedBooks && student.lostDamagedBooks.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }} color="error">
                      Lost / Damaged Book Records
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Book Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Fine Amount</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {student.lostDamagedBooks.map((record) => (
                            <TableRow key={record._id}>
                              <TableCell>{record.bookName}</TableCell>
                              <TableCell>
                                <Label color={record.type === 'Lost' ? 'error' : 'warning'}>
                                  {record.type}
                                </Label>
                              </TableCell>
                              <TableCell>
                                {new Date(record.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>₹{record.fineAmount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Label color={record.status === 'Paid' ? 'success' : 'error'}>
                                  {record.status}
                                </Label>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Dialogs */}
      <IssueBookDialog
        open={issueBookDialogOpen}
        onClose={() => setIssueBookDialogOpen(false)}
        student={student}
        onSuccess={loadStudentData}
      />
      
      <ReturnBookDialog
        open={returnBookDialogOpen}
        onClose={() => setReturnBookDialogOpen(false)}
        student={student}
        issuedBooks={issuedBooks}
        onSuccess={loadStudentData}
      />
      
      <CollectFineDialog
        open={collectFineDialogOpen}
        onClose={() => setCollectFineDialogOpen(false)}
        student={student}
        onSuccess={loadStudentData}
      />
      
      <BlockStudentDialog
        open={blockStudentDialogOpen}
        onClose={() => setBlockStudentDialogOpen(false)}
        student={student}
        onSuccess={loadStudentData}
      />
    </>
  );
};

// Helper Components
const InfoRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1} alignItems="flex-start">
    <Iconify icon={icon} sx={{ width: 20, height: 20, color: 'text.secondary', mt: 0.3 }} />
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
        {value || '-'}
      </Typography>
    </Box>
  </Stack>
);

InfoRow.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const StatCard = ({ icon, title, value, color }) => (
  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: `${color}.lighter` }}>
    <Iconify icon={icon} sx={{ width: 32, height: 32, color: `${color}.main`, mb: 1 }} />
    <Typography variant="h4" color={`${color}.main`}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {title}
    </Typography>
  </Paper>
);

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

export default StudentProfilePage;
