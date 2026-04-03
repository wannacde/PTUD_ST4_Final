import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, CardActions, Button, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
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
          <Typography variant="h5">{book.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{book.author}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{book.description}</Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>{book.price.toLocaleString()} đ</Typography>
        </CardContent>
        <CardActions>
          <Button size="large" variant="contained" onClick={handleAddToCart}>Thêm vào giỏ hàng</Button>
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
