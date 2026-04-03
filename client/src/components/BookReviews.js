import React, { useEffect, useState } from 'react';
import { Box, Typography, Rating, TextField, Button, Alert } from '@mui/material';
import API from '../services/api';

export default function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const fetchReviews = () => {
    API.get(`/reviews/book/${bookId}`)
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await API.post(`/reviews/book/${bookId}`, { rating, comment });
      setMessage('Đánh giá thành công!');
      setRating(0); setComment('');
      fetchReviews();
    } catch {
      setMessage('Bạn cần đăng nhập để đánh giá!');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Đánh giá sách</Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
        <TextField label="Nhận xét" value={comment} onChange={e => setComment(e.target.value)} fullWidth multiline rows={2} sx={{ mt: 1 }} />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>Gửi đánh giá</Button>
        {message && <Alert sx={{ mt: 1 }} severity={message.includes('thành công') ? 'success' : 'error'}>{message}</Alert>}
      </form>
      {reviews.length === 0 ? <Typography>Chưa có đánh giá nào.</Typography> : (
        reviews.map(r => (
          <Box key={r._id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography fontWeight="bold">{r.user?.username || 'Ẩn danh'}</Typography>
            <Rating value={r.rating} readOnly size="small" />
            <Typography variant="body2">{r.comment}</Typography>
            <Typography variant="caption" color="text.secondary">{new Date(r.createdAt).toLocaleString()}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
