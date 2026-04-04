import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, CardActions, Button, CircularProgress, Box, Snackbar, Alert, Chip, Stack } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BookReviews from '../components/BookReviews';
import API from '../services/api';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    API.get(`/books/${id}`)
      .then(res => setBook(res.data))
      .catch(() => setBook(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    API.post('/cart', { bookId: id, quantity: 1 })
      .then(() => setSnackbar({ open: true, message: 'Đã thêm vào giỏ hàng!', severity: 'success' }))
      .catch(() => setSnackbar({ open: true, message: 'Vui lòng đăng nhập để mua hàng!', severity: 'error' }));
  };

  const handleAddToWishlist = () => {
    API.post('/wishlist', { bookId: id })
      .then(() => setSnackbar({ open: true, message: 'Đã thêm vào yêu thích!', severity: 'success' }))
      .catch((err) => {
        const msg = err.response?.data?.message;
        setSnackbar({ open: true, message: msg === 'Book already in wishlist' ? 'Sách đã có trong yêu thích!' : 'Vui lòng đăng nhập!', severity: 'warning' });
      });
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (!book) return <Typography variant="h6" color="error" align="center" sx={{ mt: 8 }}>Không tìm thấy sách</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        {book.image && (
          <CardMedia
            component="img"
            height="300"
            image={`http://localhost:5000/uploads/${book.image}`}
            alt={book.title}
          />
        )}
        <CardContent>
          <Typography variant="h5" fontWeight="bold">{book.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>{book.author}</Typography>
          {book.category && (
            <Chip label={book.category} size="small" sx={{ mb: 1 }} />
          )}
          <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{book.description}</Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h5" color="primary" fontWeight="bold">{book.price.toLocaleString()} đ</Typography>
            <Chip
              label={book.stock > 0 ? `Còn ${book.stock} cuốn` : 'Hết hàng'}
              color={book.stock > 0 ? 'success' : 'error'}
              size="small"
              variant="outlined"
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            size="large"
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            sx={{ flex: 1 }}
          >
            {book.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Button>
          <Button
            size="large"
            variant="outlined"
            color="error"
            startIcon={<FavoriteIcon />}
            onClick={handleAddToWishlist}
          >
            Yêu thích
          </Button>
        </CardActions>
      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <BookReviews bookId={id} />
    </Container>
  );
}
