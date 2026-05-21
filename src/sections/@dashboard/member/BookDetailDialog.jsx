import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Chip,
  Grid,
  Rating,
  TextField,
  IconButton,
} from '@mui/material';
import toast from 'react-hot-toast';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';

BookDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  book: PropTypes.object,
  onReserve: PropTypes.func,
};

export default function BookDetailDialog({ open, onClose, book, onReserve }) {
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!book) return null;

  const {
    name,
    author,
    genre,
    isbn,
    summary,
    isAvailable,
    availableCopies,
    totalCopies,
    publishYear,
    location,
    photoUrl,
  } = book;

  const handleReserve = () => {
    if (onReserve) {
      onReserve(book._id);
    }
    onClose();
  };

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    toast.success('Review submitted successfully!');
    setShowReviewForm(false);
    setUserRating(0);
    setReview('');
  };

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist!');
  };

  const mockReviews = [
    {
      id: 1,
      userName: 'Rahul Kumar',
      rating: 5,
      comment: 'Excellent book! Very helpful for understanding the concepts.',
      date: '2024-11-20',
    },
    {
      id: 2,
      userName: 'Priya Sharma',
      rating: 4,
      comment: 'Good content but could use more practical examples.',
      date: '2024-11-15',
    },
  ];

  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Book Details</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Book Image */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={photoUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
              alt={name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 1,
                boxShadow: 3,
              }}
            />
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                disabled={!isAvailable}
                onClick={handleReserve}
                startIcon={<Iconify icon="eva:bookmark-outline" />}
              >
                {isAvailable ? 'Reserve Book' : 'Not Available'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAddToWishlist}
                startIcon={<Iconify icon="eva:heart-outline" />}
              >
                Add to Wishlist
              </Button>
            </Stack>
          </Grid>

          {/* Book Information */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Label color={isAvailable ? 'success' : 'error'}>
                    {isAvailable ? 'Available' : 'Not Available'}
                  </Label>
                  <Chip label={genre?.name} size="small" color="primary" variant="outlined" />
                  <Typography variant="caption" color="text.secondary">
                    {availableCopies}/{totalCopies} copies available
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              {/* Book Details */}
              <Stack spacing={1.5}>
                <DetailRow label="Author" value={author?.name} icon="eva:person-outline" />
                <DetailRow label="ISBN" value={isbn} icon="mdi:barcode" />
                <DetailRow label="Genre" value={genre?.name} icon="mdi:bookmark-outline" />
                <DetailRow label="Publish Year" value={publishYear} icon="eva:calendar-outline" />
                <DetailRow label="Location" value={location} icon="eva:pin-outline" />
              </Stack>

              <Divider />

              {/* Summary */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {summary || 'No summary available for this book.'}
                </Typography>
              </Box>

              <Divider />

              {/* Ratings & Reviews */}
              {/* <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">
                    Ratings & Reviews
                  </Typography>
                  {!showReviewForm && (
                    <Button
                      size="small"
                      startIcon={<Iconify icon="eva:edit-outline" />}
                      onClick={() => setShowReviewForm(true)}
                    >
                      Write Review
                    </Button>
                  )}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Rating value={averageRating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {averageRating.toFixed(1)} ({mockReviews.length} reviews)
                  </Typography>
                </Stack>

                
                {showReviewForm && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Your Review
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Rating
                        </Typography>
                        <Rating
                          value={userRating}
                          onChange={(event, newValue) => setUserRating(newValue)}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Write your review..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSubmitReview}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setShowReviewForm(false);
                            setUserRating(0);
                            setReview('');
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                )}

                
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {mockReviews.map((reviewItem) => (
                    <Box key={reviewItem.id} sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">{reviewItem.userName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reviewItem.date}
                        </Typography>
                      </Stack>
                      <Rating value={reviewItem.rating} size="small" readOnly sx={{ mt: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {reviewItem.comment}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box> */}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function DetailRow({ label, value, icon }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Iconify icon={icon} width={20} height={20} sx={{ color: 'text.secondary' }} />
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || 'N/A'}
      </Typography>
    </Stack>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  icon: PropTypes.string.isRequired,
};
