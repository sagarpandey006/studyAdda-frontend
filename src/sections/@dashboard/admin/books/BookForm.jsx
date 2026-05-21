import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
  Alert
} from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Iconify from '../../../../components/iconify';
import { authorApi, genreApi } from '../../../../services/api';
import {
  validateRequired,
  validateISBN,
  validateMinLength,
  validateMaxLength,
  validateNumberRange
} from '../../../../utils/formValidation';

const BookForm = ({
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  book,
  setBook,
  handleAddBook,
  handleUpdateBook
}) => {
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [isAddingGenre, setIsAddingGenre] = useState(false);

  const loadFormOptions = async () => {
    setIsModalLoading(true);
    try {
      const [authorsResponse, genresResponse] = await Promise.all([
        authorApi.getAll(),
        genreApi.getAll()
      ]);
      const authorsList = authorsResponse.authorsList || [];
      const genresList = genresResponse.genresList || [];
      setAuthors(authorsList);
      setGenres(genresList);
      return { authorsList, genresList };
    } catch (error) {
      console.error(error);
      toast.error("Failed to load authors/genres");
      return { authorsList: [], genresList: [] };
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleAddAuthor = async () => {
    const trimmedName = newAuthorName.trim();
    if (!trimmedName) {
      toast.error('Author name is required');
      return;
    }

    setIsAddingAuthor(true);
    try {
      await authorApi.add({ name: trimmedName });
      const { authorsList } = await loadFormOptions();
      const createdAuthor = authorsList.find(
        (author) => (author?.name || '').toLowerCase() === trimmedName.toLowerCase()
      );
      if (createdAuthor?._id) {
        handleFieldChange('authorId', createdAuthor._id);
      }
      setNewAuthorName('');
      toast.success('Author added successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add author');
    } finally {
      setIsAddingAuthor(false);
    }
  };

  const handleAddGenre = async () => {
    const trimmedName = newGenreName.trim();
    if (!trimmedName) {
      toast.error('Genre name is required');
      return;
    }

    setIsAddingGenre(true);
    try {
      await genreApi.add({ name: trimmedName });
      const { genresList } = await loadFormOptions();
      const createdGenre = genresList.find(
        (genre) => (genre?.name || '').toLowerCase() === trimmedName.toLowerCase()
      );
      if (createdGenre?._id) {
        handleFieldChange('genreId', createdGenre._id);
      }
      setNewGenreName('');
      toast.success('Genre added successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add genre');
    } finally {
      setIsAddingGenre(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      loadFormOptions();
    }
  }, [isModalOpen]);

  // Validation
  const validateField = (fieldName, value) => {
    let validation = { isValid: true, error: '' };

    switch (fieldName) {
      case 'name':
        validation = validateRequired(value, 'Book name');
        if (validation.isValid) {
          validation = validateMinLength(value, 2, 'Book name');
        }
        break;
      case 'isbn':
        validation = validateRequired(value, 'ISBN');
        if (validation.isValid) {
          validation = validateISBN(value);
        }
        break;
      case 'authorId':
        validation = validateRequired(value, 'Author');
        break;
      case 'genreId':
        validation = validateRequired(value, 'Genre');
        break;
      case 'summary':
        if (value) {
          validation = validateMaxLength(value, 500, 'Summary');
        }
        break;
      case 'totalCopies':
        validation = validateNumberRange(value, 1, 1000, 'Total copies');
        break;
      case 'availableCopies':
        validation = validateNumberRange(value, 0, book.totalCopies || 1000, 'Available copies');
        break;
      case 'publishYear':
        if (value) {
          const currentYear = new Date().getFullYear();
          validation = validateNumberRange(value, 1000, currentYear, 'Publish year');
        }
        break;
      default:
        break;
    }

    return validation;
  };

  const handleFieldChange = (fieldName, value) => {
    const nextBook = { ...book, [fieldName]: value };

    if (fieldName === 'totalCopies') {
      const totalCopies = Number(value);
      const currentAvailableCopies = Number(nextBook.availableCopies);

      if (!Number.isNaN(totalCopies)) {
        if (!isUpdateForm || Number.isNaN(currentAvailableCopies) || currentAvailableCopies > totalCopies) {
          nextBook.availableCopies = totalCopies;
        }
      }
    }

    if (fieldName === 'availableCopies') {
      const totalCopies = Number(nextBook.totalCopies);
      const availableCopies = Number(value);

      if (!Number.isNaN(totalCopies) && !Number.isNaN(availableCopies)) {
        nextBook.availableCopies = Math.min(Math.max(availableCopies, 0), totalCopies);
      }
    }

    setBook(nextBook);

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const handleFieldBlur = (fieldName) => {
    const validation = validateField(fieldName, book[fieldName]);
    if (!validation.isValid) {
      setErrors({ ...errors, [fieldName]: validation.error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['name', 'isbn', 'authorId', 'genreId', 'totalCopies', 'availableCopies'];

    fieldsToValidate.forEach(field => {
      const validation = validateField(field, book[field]);
      if (!validation.isValid) {
        newErrors[field] = validation.error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isUpdateForm) {
        await handleUpdateBook();
      } else {
        await handleAddBook();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    maxHeight: '90vh',
    bgcolor: 'white',
    borderRadius: '20px',
    boxShadow: 16,
    p: 2,
    overflow: 'hidden'
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Container>
          <Typography variant="h4" textAlign="center" paddingBottom={2} paddingTop={1}>
            {isUpdateForm ? 'Update' : 'Add'} Book
          </Typography>

          {isModalLoading ? (
            <Grid padding={4} style={{ textAlign: "center" }}>
              <CircularProgress />
            </Grid>
          ) : (
            <Stack
              spacing={3}
              paddingY={2}
              paddingX={3}
              height="600px"
              overflow="auto"
            >
              <TextField
                name="name"
                label="Book Name *"
                value={book.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name')}
                error={!!errors.name}
                helperText={errors.name || `${(book.name || '').length}/200`}
                autoFocus
                fullWidth
                inputProps={{ maxLength: 200 }}
              />

              <TextField
                name="isbn"
                label="ISBN *"
                value={book.isbn || ''}
                onChange={(e) => handleFieldChange('isbn', e.target.value)}
                onBlur={() => handleFieldBlur('isbn')}
                error={!!errors.isbn}
                helperText={errors.isbn || 'Enter ISBN-10 or ISBN-13'}
                fullWidth
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={!!errors.authorId}
                  >
                    <InputLabel id="author-label">Author *</InputLabel>
                    <Select
                      labelId="author-label"
                      id="author"
                      value={book.authorId || ''}
                      label="Author *"
                      onChange={(e) => handleFieldChange('authorId', e.target.value)}
                      onBlur={() => handleFieldBlur('authorId')}
                    >
                      <MenuItem value="">
                        <em>Select an author</em>
                      </MenuItem>
                      {authors.map((author) => (
                        <MenuItem key={author._id} value={author._id}>
                          {author.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.authorId && (
                      <FormHelperText>{errors.authorId}</FormHelperText>
                    )}
                  </FormControl>

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      label="New Author"
                      value={newAuthorName}
                      onChange={(e) => setNewAuthorName(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddAuthor}
                      disabled={isAddingAuthor}
                    >
                      {isAddingAuthor ? 'Adding...' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={!!errors.genreId}
                  >
                    <InputLabel id="genre-label">Genre *</InputLabel>
                    <Select
                      labelId="genre-label"
                      id="genre"
                      value={book.genreId || ''}
                      label="Genre *"
                      onChange={(e) => handleFieldChange('genreId', e.target.value)}
                      onBlur={() => handleFieldBlur('genreId')}
                    >
                      <MenuItem value="">
                        <em>Select a genre</em>
                      </MenuItem>
                      {genres.map((genre) => (
                        <MenuItem key={genre._id} value={genre._id}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.genreId && (
                      <FormHelperText>{errors.genreId}</FormHelperText>
                    )}
                  </FormControl>

                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      label="New Genre"
                      value={newGenreName}
                      onChange={(e) => setNewGenreName(e.target.value)}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddGenre}
                      disabled={isAddingGenre}
                    >
                      {isAddingGenre ? 'Adding...' : 'Add'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    name="publishYear"
                    label="Publish Year"
                    type="number"
                    value={book.publishYear || ''}
                    onChange={(e) => handleFieldChange('publishYear', e.target.value)}
                    onBlur={() => handleFieldBlur('publishYear')}
                    error={!!errors.publishYear}
                    helperText={errors.publishYear}
                    fullWidth
                    inputProps={{ min: 1000, max: new Date().getFullYear() }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    name="totalCopies"
                    label="Total Copies *"
                    type="number"
                    value={book.totalCopies ?? 1}
                    onChange={(e) => handleFieldChange('totalCopies', e.target.value)}
                    onBlur={() => handleFieldBlur('totalCopies')}
                    error={!!errors.totalCopies}
                    helperText={errors.totalCopies}
                    fullWidth
                    inputProps={{ min: 1, max: 1000 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    name="availableCopies"
                    label="Available Copies *"
                    type="number"
                    value={book.availableCopies ?? 1}
                    onChange={(e) => handleFieldChange('availableCopies', e.target.value)}
                    onBlur={() => handleFieldBlur('availableCopies')}
                    error={!!errors.availableCopies}
                    helperText={errors.availableCopies}
                    fullWidth
                    inputProps={{ min: 0, max: book.totalCopies || 1000 }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="location"
                    label="Location"
                    value={book.location || ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    helperText="e.g., A-001, Shelf 2B"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    name="rfidTag"
                    label="RFID Tag"
                    value={book.rfidTag || ''}
                    onChange={(e) => handleFieldChange('rfidTag', e.target.value)}
                    helperText="RFID tag identifier"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <FormControl>
                <FormLabel id="available-label">Availability</FormLabel>
                <RadioGroup
                  aria-labelledby="available-label"
                  value={book.isAvailable}
                  name="radio-buttons-group"
                  onChange={(e) => handleFieldChange('isAvailable', e.target.value === 'true')}
                  row
                >
                  <FormControlLabel value="true" control={<Radio />} label="Available" />
                  <FormControlLabel value="false" control={<Radio />} label="Not available" />
                </RadioGroup>
              </FormControl>

              <TextField
                name="summary"
                label="Summary"
                value={book.summary || ''}
                onChange={(e) => handleFieldChange('summary', e.target.value)}
                onBlur={() => handleFieldBlur('summary')}
                error={!!errors.summary}
                helperText={errors.summary || `${(book.summary || '').length}/500 characters`}
                multiline
                rows={3}
                maxRows={5}
                fullWidth
                inputProps={{ maxLength: 500 }}
              />

              <Button variant="outlined" component="label">
                Upload Book Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    setBook({
                      ...book,
                      imageFile: e.target.files[0],
                    });
                  }}
                />
              </Button>

              {book.imageFile && (
                <Box mt={2}>
                  <img
                    src={URL.createObjectURL(book.imageFile)}
                    alt="preview"
                    width="120"
                    style={{ borderRadius: "8px" }}
                  />
                </Box>
              )}

              {isUpdateForm && (
                <Alert severity="info" variant="outlined">
                  Last updated: {new Date(book.updatedAt || Date.now()).toLocaleString()}
                </Alert>
              )}

              <Box textAlign="center" paddingBottom={2}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Iconify icon="bi:check-lg" />
                    )
                  }
                  style={{ marginRight: "12px" }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>

                <Button
                  size="large"
                  color="inherit"
                  variant="contained"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  startIcon={<Iconify icon="charm:cross" />}
                  style={{ marginLeft: "12px" }}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          )}
        </Container>
      </Box>
    </Modal>
  );
};

BookForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  book: PropTypes.object,
  setBook: PropTypes.func,
  handleAddBook: PropTypes.func,
  handleUpdateBook: PropTypes.func
};

export default BookForm;
