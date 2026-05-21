import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import Iconify from '../../../../components/iconify';
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateRFID
} from '../../../../utils/formValidation';

const UserForm = ({
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  user,
  setUser,
  handleAddUser,
  handleUpdateUser
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [books, setBooks] = useState(user.lostDamagedBooks || []);

  // Validation
  const validateField = (fieldName, value) => {
    let validation = { isValid: true, error: '' };

    switch (fieldName) {
      case 'name':
        validation = validateRequired(value, 'Name');
        if (validation.isValid) {
          validation = validateMinLength(value, 2, 'Name');
        }
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        if (value) { // Phone is optional
          validation = validatePhone(value);
        }
        break;
      case 'dob':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 15 || age > 120) {
            validation = { isValid: false, error: 'Age must be between 15 and 120 years' };
          }
        }
        break;
      case 'rfidCard':
        if (!user.isAdmin || value) {
          validation = validateRFID(value);
        }
        break;
      default:
        break;
    }

    return validation;
  };

  const handleFieldChange = (fieldName, value) => {
    setUser({ ...user, [fieldName]: value });

    // Auto-generate avatar URL when name changes
    if (fieldName === 'name' && value) {
      setUser({
        ...user,
        name: value,
        photoUrl: `https://avatars.dicebear.com/api/male/${value.replace(" ", "+")}.svg`
      });
    }

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
  };

  const handleFieldBlur = (fieldName) => {
    const validation = validateField(fieldName, user[fieldName]);
    if (!validation.isValid) {
      setErrors({ ...errors, [fieldName]: validation.error });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['name', 'email'];

    if (!isUpdateForm) {
      fieldsToValidate.push('password');
    }

    fieldsToValidate.forEach(field => {
      const validation = validateField(field, user[field]);
      if (!validation.isValid) {
        newErrors[field] = validation.error;
      }
    });

    // Validate optional fields if filled
    if (user.phone) {
      const phoneValidation = validateField('phone', user.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error;
      }
    }

    if (user.dob) {
      const dobValidation = validateField('dob', user.dob);
      if (!dobValidation.isValid) {
        newErrors.dob = dobValidation.error;
      }
    }

    if (!user.isAdmin) {
      const rfidValidation = validateField('rfidCard', user.rfidCard);
      if (!rfidValidation.isValid) {
        newErrors.rfidCard = rfidValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async () => {
  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     if (isUpdateForm) {
  //       await handleUpdateUser();
  //     } else {
  //       await handleAddUser();
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      ...user,
      lostDamagedBooks: books,
    };

    setIsSubmitting(true);

    try {
      if (isUpdateForm) {
        await handleUpdateUser(payload);
      } else {
        await handleAddUser(payload);
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
    p: 4,
    overflow: 'auto'
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
            {isUpdateForm ? 'Update' : 'Add'} User
          </Typography>

          <Stack spacing={3} paddingY={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  name="name"
                  label="Full Name *"
                  value={user.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  error={!!errors.name}
                  helperText={errors.name || 'Enter full name'}
                  autoFocus
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  value={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  onBlur={() => handleFieldBlur('dob')}
                  error={!!errors.dob}
                  helperText={errors.dob}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: new Date().toISOString().split('T')[0]
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              name="rfidCard"
              label="RFID Card Number"
              value={user.rfidCard || ''}
              onChange={(e) => handleFieldChange('rfidCard', e.target.value)}
              onBlur={() => handleFieldBlur('rfidCard')}
              error={!!errors.rfidCard}
              helperText={errors.rfidCard || (user.isAdmin ? 'Optional for librarians' : 'Required for students and check-in')}
              inputProps={{ maxLength: 30 }}
              sx={{ mt: 1 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address *"
                  type="email"
                  value={user.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  error={!!errors.email}
                  helperText={errors.email || 'Enter valid email address'}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  value={user.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  onBlur={() => handleFieldBlur('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone || '10 digits starting with 6-9'}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Scholar Number" fullWidth value={user.scholarNumber || ''}
                  onChange={(e) => handleFieldChange('scholarNumber', e.target.value)} />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Enrollment Number" fullWidth value={user.enrollmentNumber || ''}
                  onChange={(e) => handleFieldChange('enrollmentNumber', e.target.value)} />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Course" fullWidth value={user.course || ''}
                  onChange={(e) => handleFieldChange('course', e.target.value)} />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Branch" fullWidth value={user.branch || ''}
                  onChange={(e) => handleFieldChange('branch', e.target.value)} />
              </Grid>

              <Grid item xs={4}>
                <TextField label="Year" type="number" fullWidth
                  value={user.year || ''} onChange={(e) => handleFieldChange('year', Number(e.target.value))} />
              </Grid>

              <Grid item xs={4}>
                <TextField label="Semester" type="number" fullWidth
                  value={user.semester || ''} onChange={(e) => handleFieldChange('semester', Number(e.target.value))} />
              </Grid>

              <Grid item xs={4}>
                <TextField label="Section" fullWidth
                  value={user.section || ''} onChange={(e) => handleFieldChange('section', e.target.value)} />
              </Grid>

              <Grid item xs={12}>
                <TextField label="Address" fullWidth multiline
                  value={user.address || ''} onChange={(e) => handleFieldChange('address', e.target.value)} />
              </Grid>
            </Grid>

            <Typography variant="h6">Library Info</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Max Book Limit" type="number"
                  value={user.maxBookLimit || 0}
                  onChange={(e) => handleFieldChange('maxBookLimit', Number(e.target.value))} fullWidth />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Books Issued" type="number"
                  value={user.totalBooksIssued || 0}
                  onChange={(e) => handleFieldChange('totalBooksIssued', Number(e.target.value))} fullWidth />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Fine Amount"
                  value={user.fineAmount || 0}
                  onChange={(e) => handleFieldChange('fineAmount', Number(e.target.value))} fullWidth />
              </Grid>

              <Grid item xs={6}>
                <TextField label="Unpaid Fine"
                  value={user.unpaidFine || 0}
                  onChange={(e) => handleFieldChange('unpaidFine', Number(e.target.value))} fullWidth />
              </Grid>
            </Grid>

            <FormControl>
              <FormLabel id="role-label" sx={{ mb: 1 }}>
                User Role *
              </FormLabel>
              <RadioGroup
                aria-labelledby="role-label"
                value={user.isAdmin}
                name="radio-buttons-group"
                onChange={(e) => handleFieldChange('isAdmin', e.target.value === 'true')}
                row
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Librarian (Admin)"
                      sx={{ width: "100%", border: '1px solid #e0e0e0', borderRadius: 1, px: 2, py: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="Member (Student)"
                      sx={{ width: "100%", border: '1px solid #e0e0e0', borderRadius: 1, px: 2, py: 1 }}
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
              <FormHelperText>
                Librarians have full access, Members have limited access
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={user.status || "Active"}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
            </FormControl>

            {user.status === "Blocked" && (
              <TextField
                label="Block Reason"
                fullWidth
                value={user.blockReason || ''}
                onChange={(e) => handleFieldChange('blockReason', e.target.value)}
              />
            )}

            {isUpdateForm && (
              <Alert severity="info" variant="outlined">
                Last updated: {new Date(user.updatedAt || Date.now()).toLocaleString()}
              </Alert>
            )}

            <Typography variant="h6">Lost/Damaged Books</Typography>

            <Button onClick={() => {
              setBooks([...books, {
                bookName: "",
                type: "Lost",
                fineAmount: 0,
                status: "Unpaid"
              }])
            }}>
              + Add Book
            </Button>

            {books.map((b, i) => (
              <Grid container spacing={2} key={i}>
                <Grid item xs={4}>
                  <TextField label="Book Name"
                    value={b.bookName}
                    onChange={(e) => {
                      const updated = [...books];
                      updated[i].bookName = e.target.value;
                      setBooks(updated);
                    }}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Select value={b.type}
                    onChange={(e) => {
                      const updated = [...books];
                      updated[i].type = e.target.value;
                      setBooks(updated);
                    }}>
                    <MenuItem value="Lost">Lost</MenuItem>
                    <MenuItem value="Damaged">Damaged</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={3}>
                  <TextField label="Fine"
                    value={b.fineAmount}
                    onChange={(e) => {
                      const updated = [...books];
                      updated[i].fineAmount = e.target.value;
                      setBooks(updated);
                    }}
                  />
                </Grid>

                <Grid item xs={2}>
                  <Select value={b.status}
                    onChange={(e) => {
                      const updated = [...books];
                      updated[i].status = e.target.value;
                      setBooks(updated);
                    }}>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Unpaid">Unpaid</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            ))}

            <Box textAlign="center" sx={{ pt: 2 }}>
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
        </Container>
      </Box>
    </Modal>
  );
};

UserForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  user: PropTypes.object,
  setUser: PropTypes.func,
  handleAddUser: PropTypes.func,
  handleUpdateUser: PropTypes.func
};

export default UserForm;
