import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Chip
} from "@mui/material";
import { Alert } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { useAuth } from '../../../../hooks/useAuth';

import Label from '../../../../components/label';
import BookDialog from "./BookDialog";
import BookForm from "./BookForm";
import BookDetailsModal from "./BookDetailsModal";
import Iconify from '../../../../components/iconify';
import TableToolbar from '../../../../components/table-toolbar';
import FilterDrawer from '../../../../components/filter-drawer';
import { bookApi } from '../../../../services/api';
import { exportToCSV } from '../../../../utils/exportData';

// 

const StyledBookImage = styled("img")({
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  position: "absolute"
});

const BookPage = () => {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.isAdmin);

  // Data
  const [book, setBook] = useState({
    id: "",
    name: "",
    isbn: "",
    summary: "",
    isAvailable: true,
    authorId: "",
    genreId: "",
    photoUrl: "",
    rfidTag: "",
    totalCopies: 1,
    availableCopies: 1,
    publishYear: "",
    location: ""
  });

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    genre: 'all',
    author: 'all',
    availability: 'all',
    publishYear: 'all'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  // API operations
  const getAllBooks = async () => {
    try {
      const response = await bookApi.getAll();
      setBooks(response.booksList);
      setFilteredBooks(response.booksList);
      setIsTableLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load books");
      setIsTableLoading(false);
    }
  };

  const addBook = async () => {
    try {
      const formData = new FormData();

      Object.keys(book).forEach((key) => {
        if (key !== "imageFile" && book[key] !== undefined) {
          formData.append(key, book[key]);
        }
      });

      if (book.imageFile) {
        formData.append("image", book.imageFile);
      }

      await bookApi.add(formData);

      toast.success("Book added successfully");
      handleCloseModal();
      getAllBooks();
      clearForm();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const updateBook = async () => {
    try {
      const formData = new FormData();

      Object.keys(book).forEach((key) => {
        if (key !== "imageFile" && book[key] !== undefined) {
          formData.append(key, book[key]);
        }
      });

      if (book.imageFile) {
        formData.append("image", book.imageFile);
      }

      await bookApi.update(selectedBookId, formData);

      toast.success("Book updated successfully");
      handleCloseModal();
      handleCloseMenu();
      getAllBooks();
      clearForm();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await bookApi.delete(bookId);
      toast.success("Book deleted successfully");
      handleCloseDialog();
      handleCloseMenu();
      getAllBooks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong, please try again");
    }
  };

  const bulkDeleteBooks = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedBooks.length} books?`)) {
      try {
        await Promise.all(selectedBooks.map(id => bookApi.delete(id)));
        toast.success(`${selectedBooks.length} books deleted successfully`);
        setSelectedBooks([]);
        getAllBooks();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete some books");
      }
    }
  };

  const getSelectedBookDetails = () => {
    const selectedBook = books.find((element) => element._id === selectedBookId);
    console.log(selectedBook);
    setBook(selectedBook);
  };

  const clearForm = () => {
    setBook({
      id: "",
      name: "",
      isbn: "",
      summary: "",
      isAvailable: true,
      authorId: "",
      genreId: "",
      photoUrl: "",
      rfidTag: "",
      totalCopies: 1,
      availableCopies: 1,
      publishYear: "",
      location: ""
    });
  };

  // Filter and Search
  useEffect(() => {
    let result = [...books];

    // Apply search
    if (searchQuery) {
      result = result.filter(book =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.genre !== 'all') {
      result = result.filter(book => book.genreId === filters.genre);
    }
    if (filters.author !== 'all') {
      result = result.filter(book => book.authorId === filters.author);
    }
    if (filters.availability !== 'all') {
      const isAvailable = filters.availability === 'available';
      result = result.filter(book => book.isAvailable === isAvailable);
    }
    if (filters.publishYear !== 'all') {
      result = result.filter(book => book.publishYear === filters.publishYear);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'author':
          return (a.author?.name || '').localeCompare(b.author?.name || '');
        case 'publishYear':
          return (b.publishYear || '').localeCompare(a.publishYear || '');
        case 'availability':
          return b.isAvailable - a.isAvailable;
        default:
          return 0;
      }
    });

    setFilteredBooks(result);
  }, [searchQuery, filters, sortBy, books]);

  // Handler functions
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    toast.success('Filters applied');
  };

  const handleResetFilters = () => {
    setFilters({
      genre: 'all',
      author: 'all',
      availability: 'all',
      publishYear: 'all'
    });
    setSearchQuery('');
    toast.success('Filters reset');
  };

  const handleExport = () => {
    const columns = [
      { field: 'name', headerName: 'Book Name' },
      { field: 'isbn', headerName: 'ISBN' },
      { field: 'author.name', headerName: 'Author' },
      { field: 'genre.name', headerName: 'Genre' },
      { field: 'publishYear', headerName: 'Publish Year' },
      { field: 'totalCopies', headerName: 'Total Copies' },
      { field: 'availableCopies', headerName: 'Available Copies' },
      { field: 'isAvailable', headerName: 'Status' },
      { field: 'location', headerName: 'Location' },
      { field: 'rfidTag', headerName: 'RFID Tag' }
    ];
    exportToCSV(filteredBooks, columns, 'books');
    toast.success('Books exported successfully');
  };

  const handleOpenMenu = (event) => {
    setIsMenuOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Load data on initial page load
  useEffect(() => {
    getAllBooks();
  }, []);

  // Get unique values for filters
  const genres = [...new Set(books.map(b => ({ id: b.genreId, name: b.genre?.name })))];
  const authors = [...new Set(books.map(b => ({ id: b.authorId, name: b.author?.name })))];
  const years = [...new Set(books.map(b => b.publishYear).filter(Boolean))].sort((a, b) => b - a);

  return (
    <>
      <Helmet>
        <title>Books | Library System</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h3">
            Book Management
          </Typography>
          {isAdmin && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setIsUpdateForm(false);
                  clearForm();
                  handleOpenModal();
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Add New Book
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Toolbar with Search and Actions */}
        <Card sx={{ mb: 3 }}>
          <TableToolbar
            numSelected={selectedBooks.length}
            filterValue={searchQuery}
            onFilterChange={handleSearchChange}
            onFilterOpen={() => setIsFilterOpen(true)}
            onExport={handleExport}
            onBulkDelete={bulkDeleteBooks}
            placeholder="Search books by name, ISBN, author..."
            showFilter
            showExport
          />

          {/* View Controls */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, pb: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              {selectedBooks.length > 0 && (
                <Chip
                  label={`${selectedBooks.length} selected`}
                  color="primary"
                  onDelete={() => setSelectedBooks([])}
                />
              )}
              <Typography variant="body2" color="text.secondary">
                {filteredBooks.length} of {books.length} books
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="author">Author</MenuItem>
                  <MenuItem value="publishYear">Year</MenuItem>
                  <MenuItem value="availability">Availability</MenuItem>
                </Select>
              </FormControl>

            </Stack>
          </Stack>
        </Card>

        {/* Books Display */}
        {isTableLoading ? (
          <Grid container justifyContent="center" sx={{ py: 10 }}>
            <CircularProgress />
          </Grid>
        ) : filteredBooks.length > 0 ? (
          <Grid container spacing={3}>
            {filteredBooks.map((book) => (
              <Grid key={book._id} item xs={12} sm={6} md={viewMode === 'grid' ? 3 : 12}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: '0.3s',
                    boxShadow: 2,
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: 6,
                    }
                  }}
                >

                  <Box sx={{ pt: viewMode === 'grid' ? '100%' : '40%', position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 10,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#fff',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          fontSize: '10px'
                        }}
                      >
                        {book.genre?.name}
                      </Typography>
                    </Box>

                    {isAdmin && (
                      <Label
                        variant="filled"
                        sx={{
                          zIndex: 9,
                          top: 12,
                          right: 16,
                          position: 'absolute',
                          borderRadius: "100%",
                          width: "30px",
                          height: "30px",
                          color: "white",
                          backgroundColor: "white"
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            setSelectedBookId(book._id);
                            handleOpenMenu(e);
                          }}
                        >
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </Label>
                    )}

                    <StyledBookImage alt={book.name} src={book.photoUrl} />
                  </Box>

                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Typography variant="h6" noWrap>
                      {book.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }} noWrap>
                      {book.author?.name}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Label color={book.isAvailable ? "success" : "error"}>
                        {book.isAvailable ? 'Available' : 'Not available'}
                      </Label>
                      {book.rfidTag && (
                        <Label color="info">
                          RFID: {book.rfidTag}
                        </Label>
                      )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      ISBN: {book.isbn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Copies: {book.availableCopies ?? 1}/{book.totalCopies ?? 1}
                    </Typography>
                    {book.publishYear && (
                      <Typography variant="body2" color="text.secondary">
                        Published: {book.publishYear}
                      </Typography>
                    )}
                    {viewMode === 'list' && (
                      <Typography variant="body2" noWrap>
                        {book.summary}
                      </Typography>
                    )}
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ mt: 3 }}>
            {searchQuery || Object.values(filters).some(f => f !== 'all')
              ? 'No books found matching your search criteria. Try adjusting your filters.'
              : 'No books found. Add your first book to get started!'}
          </Alert>
        )}
      </Container>

      {/* Filter Drawer */}
      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        title="Filter Books"
      >
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={filters.genre}
              label="Genre"
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <MenuItem value="all">All Genres</MenuItem>
              {genres.map((genre) => genre.name && (
                <MenuItem key={genre.id} value={genre.id}>
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
              {authors.map((author) => author.name && (
                <MenuItem key={author.id} value={author.id}>
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

          <FormControl fullWidth>
            <InputLabel>Publish Year</InputLabel>
            <Select
              value={filters.publishYear}
              label="Publish Year"
              onChange={(e) => handleFilterChange('publishYear', e.target.value)}
            >
              <MenuItem value="all">All Years</MenuItem>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </FilterDrawer>

      {/* Context Menu */}
      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => {
          const selected = books.find(b => b._id === selectedBookId);
          setBook(selected);
          setIsViewOpen(true);
          handleCloseMenu();
        }}>
          <Iconify icon={'eva:eye-fill'} sx={{ mr: 2 }} />
          View
        </MenuItem>

        <MenuItem onClick={() => {
          setIsUpdateForm(true);
          getSelectedBookDetails();
          handleCloseMenu();
          handleOpenModal();
        }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDialog}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      {/* Forms and Dialogs */}
      <BookForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        id={selectedBookId}
        book={book}
        setBook={setBook}
        handleAddBook={addBook}
        handleUpdateBook={updateBook}
      />

      <BookDialog
        isDialogOpen={isDialogOpen}
        bookId={selectedBookId}
        handleDeleteBook={deleteBook}
        handleCloseDialog={handleCloseDialog}
      />

      <BookDetailsModal
        open={isViewOpen}
        handleClose={() => setIsViewOpen(false)}
        book={book}
      />
    </>
  );
};

export default BookPage;
