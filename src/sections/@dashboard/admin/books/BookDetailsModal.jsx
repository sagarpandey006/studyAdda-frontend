import {
    Box,
    Modal,
    Typography,
    Grid,
    Chip,
    Stack
} from "@mui/material";

const BookDetailsModal = ({ open, handleClose, book }) => {
    if (!book) return null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'white',
        borderRadius: 3,
        boxShadow: 24,
        p: 3
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Grid container spacing={3}>

                    {/* IMAGE */}
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                height: '100%',
                                minHeight: 300,
                                borderRadius: '10px',
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                component="img"
                                src={book.photoUrl}
                                alt={book.name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* DETAILS */}
                    <Grid item xs={12} md={7}>
                        <Stack spacing={1.5}>
                            <Typography variant="h5">{book.name}</Typography>

                            <Typography color="text.secondary">
                                by {book.author?.name}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={book.isAvailable ? "Available" : "Not Available"}
                                    color={book.isAvailable ? "success" : "error"}
                                />
                                <Chip label={book.genre?.name} />
                            </Stack>

                            <Typography><b>ISBN:</b> {book.isbn}</Typography>
                            <Typography><b>Year:</b> {book.publishYear}</Typography>
                            <Typography><b>Location:</b> {book.location}</Typography>
                            <Typography><b>RFID:</b> {book.rfidTag}</Typography>
                            <Typography>
                                <b>Copies:</b> {book.availableCopies}/{book.totalCopies}
                            </Typography>

                            <Typography mt={1}>
                                <b>Summary:</b><br />
                                {book.summary}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default BookDetailsModal;