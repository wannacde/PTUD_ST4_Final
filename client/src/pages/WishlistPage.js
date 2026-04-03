import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Box, CircularProgress } from '@mui/material';
import API from '../services/api';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    setLoading(true);
    API.get('/wishlist')
      .then(res => setWishlist(res.data))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = (id) => {
    API.delete(`/wishlist/${id}`).then(fetchWishlist);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Danh sách yêu thích</Typography>
      {wishlist.length === 0 ? (
        <Typography>Bạn chưa có sách yêu thích nào.</Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card>
                {item.book.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000/uploads/${item.book.image}`}
                    alt={item.book.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{item.book.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.book.author}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="error" variant="outlined" onClick={() => handleRemove(item._id)}>Xóa</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
