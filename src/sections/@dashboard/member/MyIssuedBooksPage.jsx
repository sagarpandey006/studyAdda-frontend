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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import { fDate } from '../../../utils/formatTime';
import { memberApi } from '../../../services/api';
import RenewalDialog from './RenewalDialog';
import FinePaymentDialog from './FinePaymentDialog';

// Normalize borrowal from backend shape to what this page expects
const normalizeBorrowal = (b) => ({
  ...b,
  book: b.bookId
    ? { ...b.bookId, author: b.bookId.authorId || { name: 'Unknown' }, genre: b.bookId.genreId || { name: 'Uncategorized' } }
    : { name: 'Unknown', author: { name: 'Unknown' }, genre: { name: 'Uncategorized' } },
  fineAmount: b.fine || b.calculatedFine || 0,
  renewalCount: b.renewalCount || 0,
  maxRenewals: 3,
});

const BOOKS_PER_PAGE = 12;

function applySortFilter(array, query) {
  if (query) {
    return filter(array, (book) =>
      book.book?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      book.book?.author?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      book.book?.genre?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return array;
}

export default function MyIssuedBooksPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: Active, 2: Overdue, 3: Returned
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [finePaymentDialogOpen, setFinePaymentDialogOpen] = useState(false);
  const [selectedFineBook, setSelectedFineBook] = useState(null);

  useEffect(() => {
    fetchIssuedBooks();
  }, [user]);

  const fetchIssuedBooks = async () => {
    try {
      const response = await memberApi.getMyBorrowals();
      const normalized = (response.data.borrowalsList || []).map(normalizeBorrowal);
      setIssuedBooks(normalized);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching issued books:', error);
      toast.error('Failed to load issued books');
      setLoading(false);
    }
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
  
  const handleRenewBook = (borrowal) => {
    setSelectedBook(borrowal);
    setRenewalDialogOpen(true);
  };
  
  const handlePayFine = (borrowal) => {
    setSelectedFineBook(borrowal);
    setFinePaymentDialogOpen(true);
  };
  
  const handleRenewalSuccess = async (borrowalId) => {
    await fetchIssuedBooks();
  };

  const handlePaymentSuccess = async (amount, method) => {
    await fetchIssuedBooks();
  };

  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (dueDate, status) => {
    if (status !== 'issued') return false;
    const today = new Date();
    const due = new Date(dueDate);
    return today > due;
  };

  // Apply search filter
  let filteredBooks = applySortFilter(issuedBooks, filterName);
  
  // Apply tab filter
  if (tabValue === 1) {
    // Active (issued and not overdue)
    filteredBooks = filteredBooks.filter(book => book.status === 'issued' && !isOverdue(book.dueDate, book.status));
  } else if (tabValue === 2) {
    // Overdue
    filteredBooks = filteredBooks.filter(book => isOverdue(book.dueDate, book.status));
  } else if (tabValue === 3) {
    // Returned
    filteredBooks = filteredBooks.filter(book => book.status === 'returned');
  }
  
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice((page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE);

  const isNotFound = !filteredBooks.length && !!filterName;

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
        <title>My Issued Books | StudyAdda Smart Library</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Issued Books
          </Typography>
          {/* <Button variant="outlined" startIcon={<Iconify icon="eva:book-open-outline" />}>
            Browse More Books
          </Button> */}
        </Stack>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {filteredBooks.filter(book => book.status === 'issued').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently Issued
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="error">
                  {filteredBooks.filter(book => isOverdue(book.dueDate, book.status)).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overdue Books
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success">
                  {filteredBooks.filter(book => book.status === 'returned').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Returned Books
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="warning">
                  ₹{filteredBooks.reduce((total, book) => total + book.fineAmount, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Fines
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for filtering */}
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Books" />
            <Tab label="Active" />
            <Tab label="Overdue" />
            <Tab label="Returned" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Search your issued books..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {issuedBooks.length === 0 ? (
          <Paper sx={{ textAlign: 'center', py: 8 }}>
            <Iconify icon="eva:book-outline" sx={{ width: 64, height: 64, mb: 2, color: 'text.disabled' }} />
            <Typography variant="h6" paragraph>
              No books issued yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visit our library to issue your first book!
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
              {paginatedBooks.map((issuedBook) => {
                const { _id, book, issueDate, dueDate, status, renewalCount, maxRenewals, fineAmount, returnDate } = issuedBook;
                const daysLeft = calculateDaysLeft(dueDate);
                const overdue = isOverdue(dueDate, status);

                return (
                  <Grid item xs={12} sm={6} md={4} key={_id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        position: 'relative',
                        border: overdue ? '2px solid' : '1px solid',
                        borderColor: overdue ? 'error.main' : 'divider',
                      }}
                    >
                      {overdue && (
                        <Alert severity="error" sx={{ mb: 1 }}>
                          Overdue by {Math.abs(daysLeft)} days
                        </Alert>
                      )}
                      
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom
                          sx={{ 
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            lineHeight: 1.3,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {book.name}
                        </Typography>

                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Author
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {book.author.name}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Genre
                            </Typography>
                            <Chip label={book.genre.name} variant="outlined" size="small" />
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Issue Date
                            </Typography>
                            <Typography variant="body2">
                              {fDate(issueDate)}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Due Date
                            </Typography>
                            <Typography variant="body2" color={overdue ? 'error.main' : 'text.primary'}>
                              {fDate(dueDate)}
                              {status === 'issued' && (
                                <Typography variant="caption" display="block" color={overdue ? 'error.main' : daysLeft <= 3 ? 'warning.main' : 'success.main'}>
                                  {overdue ? `Overdue by ${Math.abs(daysLeft)} days` : `${daysLeft} days left`}
                                </Typography>
                              )}
                            </Typography>
                          </Box>

                          {status === 'returned' && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Return Date
                              </Typography>
                              <Typography variant="body2">
                                {fDate(returnDate)}
                              </Typography>
                            </Box>
                          )}

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Status
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Label color={status === 'issued' ? (overdue ? 'error' : 'warning') : 'success'}>
                                {status === 'issued' ? (overdue ? 'Overdue' : 'Issued') : 'Returned'}
                              </Label>
                              {fineAmount > 0 && (
                                <Chip label={`Fine: ₹${fineAmount}`} color="error" size="small" />
                              )}
                            </Stack>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Renewals
                            </Typography>
                            <Typography variant="body2">
                              {renewalCount}/{maxRenewals} used
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>

                      <Divider />
                      
                      <CardActions sx={{ p: 2 }}>
                        {status === 'issued' ? (
                          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                            {fineAmount > 0 && (
                              <Button
                                fullWidth
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => handlePayFine(issuedBook)}
                                startIcon={<Iconify icon="mdi:currency-inr" />}
                              >
                                Pay Fine (₹{fineAmount})
                              </Button>
                            )}
                            {fineAmount === 0 && renewalCount < maxRenewals && (
                              <Button
                                fullWidth
                                size="small"
                                variant="outlined"
                                onClick={() => handleRenewBook(issuedBook)}
                                startIcon={<Iconify icon="eva:refresh-outline" />}
                              >
                                Renew ({maxRenewals - renewalCount} left)
                              </Button>
                            )}
                            {fineAmount === 0 && renewalCount >= maxRenewals && (
                              <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center', py: 1 }}>
                                Max renewals reached
                              </Typography>
                            )}
                          </Stack>
                        ) : (
                          <Box sx={{ width: '100%', textAlign: 'center' }}>
                            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <Iconify icon="eva:checkmark-circle-outline" sx={{ width: 16, height: 16 }} />
                              Book returned
                            </Typography>
                          </Box>
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

      {/* Renewal Dialog */}
      <RenewalDialog
        open={renewalDialogOpen}
        onClose={() => setRenewalDialogOpen(false)}
        borrowal={selectedBook}
        onRenewal={handleRenewalSuccess}
      />

      {/* Fine Payment Dialog */}
      <FinePaymentDialog
        open={finePaymentDialogOpen}
        onClose={() => setFinePaymentDialogOpen(false)}
        fineAmount={selectedFineBook?.fineAmount || 0}
        borrowalDetails={{
          book: selectedFineBook?.book,
          daysOverdue: selectedFineBook ? Math.abs(calculateDaysLeft(selectedFineBook.dueDate)) : 0
        }}
        onPayment={handlePaymentSuccess}
      />
    </>
  );
}