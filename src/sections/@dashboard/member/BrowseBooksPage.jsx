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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Drawer,
  IconButton,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import Label from '../../../components/label';
import { bookApi } from '../../../services/api';
import BookDetailsModal from '../admin/books/BookDetailsModal';

const BOOKS_PER_PAGE = 12;

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

function applySortFilter(array, comparator, query, filters) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredArray = stabilizedThis.map((el) => el[0]);

  if (query) {
    filteredArray = filter(filteredArray, (_book) =>
      _book.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      _book.author?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
      _book.genre?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  // Apply genre filter
  if (filters.genre && filters.genre !== 'all') {
    filteredArray = filteredArray.filter(book => book.genre._id === filters.genre);
  }

  // Apply availability filter
  if (filters.availability && filters.availability !== 'all') {
    filteredArray = filteredArray.filter(book =>
      filters.availability === 'available' ? book.isAvailable : !book.isAvailable
    );
  }

  // Apply author filter
  if (filters.author && filters.author !== 'all') {
    filteredArray = filteredArray.filter(book => book.author._id === filters.author);
  }

  return filteredArray;
}

export default function BrowseBooksPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    genre: 'all',
    author: 'all',
    availability: 'all',
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetailOpen, setBookDetailOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookApi.getAll();
      setBooks(response.booksList);

      // Extract unique genres and authors from real data
      const uniqueGenres = [...new Map(response.booksList.map(book => [book.genre?._id, book.genre]).filter(([id]) => id)).values()];
      const uniqueAuthors = [...new Map(response.booksList.map(book => [book.author?._id, book.author]).filter(([id]) => id)).values()];

      setGenres(uniqueGenres);
      setAuthors(uniqueAuthors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
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

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  };

  const handleOrderChange = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      genre: 'all',
      author: 'all',
      availability: 'all',
    });
    setFilterName('');
    setPage(1);
  };

  const handleBookDetails = (book) => {
    setSelectedBook(book);
    setBookDetailOpen(true);
  };

  const handleReserveBook = async (bookId) => {
    // Book issue is done by the librarian at the counter — student can only view availability
    toast.success('Book is available! Visit the library counter to issue it.');
  };

  const filteredBooks = applySortFilter(books, getComparator(order, sortBy), filterName, filters);

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
        <title>Browse Books | StudyAdda Smart Library</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4">
            Browse Books
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredBooks.length} books found
            </Typography>
            {/* <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
            >
              <ToggleButton value="grid">
                <Iconify icon="eva:grid-outline" width={20} height={20} />
              </ToggleButton>
              <ToggleButton value="list">
                <Iconify icon="eva:list-outline" width={20} height={20} />
              </ToggleButton>
            </ToggleButtonGroup> */}
          </Stack>
        </Stack>

        {/* Search and Filter Toolbar */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              value={filterName}
              onChange={handleFilterByName}
              placeholder="Search books by title, author, or genre..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:funnel-outline" />}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </Button>
          </Stack>

          {/* Active Filters & Sort */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="publishYear">Year</MenuItem>
                <MenuItem value="availableCopies">Availability</MenuItem>
              </Select>
            </FormControl>

            <IconButton onClick={handleOrderChange} size="small">
              <Iconify icon={order === 'asc' ? 'eva:arrow-upward-outline' : 'eva:arrow-downward-outline'} />
            </IconButton>

            {(filters.genre !== 'all' || filters.author !== 'all' || filters.availability !== 'all') && (
              <Button
                size="small"
                onClick={handleClearFilters}
                startIcon={<Iconify icon="eva:close-outline" />}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
        </Stack>

        {isNotFound ? (
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
              {paginatedBooks.map((book) => {
                const { _id, name, author, genre, isAvailable, availableCopies, totalCopies, summary } = book;

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
                    <Card
                      onClick={() => handleBookDetails(book)}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: (theme) => theme.shadows[8],
                        }
                      }}
                    >
                      {/* IMAGE */}
                      <Box sx={{ pt: '100%', position: 'relative' }}>
                        <Box
                          component="img"
                          src={book.photoUrl}
                          alt={book.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>

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
                          {name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {summary}
                        </Typography>

                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Author
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {author.name}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Genre
                            </Typography>
                            <Chip label={genre.name} variant="outlined" size="small" />
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              Availability
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Label color={isAvailable ? 'success' : 'error'}>
                                {isAvailable ? 'Available' : 'Not Available'}
                              </Label>
                              <Typography variant="caption" color="text.secondary">
                                {availableCopies}/{totalCopies}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>

                      <Divider />

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

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320, p: 3 }
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          </Stack>

          <Divider />

          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={filters.genre}
              label="Genre"
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <MenuItem value="all">All Genres</MenuItem>
              {genres.map((genre) => (
                <MenuItem key={genre._id} value={genre._id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Author</InputLabel>
            <Select
              value={filters.author}
              label="Author"
              onChange={(e) => handleFilterChange('author', e.target.value)}
            >
              <MenuItem value="all">All Authors</MenuItem>
              {authors.map((author) => (
                <MenuItem key={author._id} value={author._id}>
                  {author.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Availability</InputLabel>
            <Select
              value={filters.availability}
              label="Availability"
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <MenuItem value="all">All Books</MenuItem>
              <MenuItem value="available">Available Only</MenuItem>
              <MenuItem value="unavailable">Unavailable Only</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<Iconify icon="eva:refresh-outline" />}
            >
              Reset
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFilterDrawerOpen(false)}
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </Drawer>

      {/* Book Detail Dialog */}
      <BookDetailsModal
        open={bookDetailOpen}
        handleClose={() => setBookDetailOpen(false)}
        book={selectedBook}
      />
    </>
  );
}