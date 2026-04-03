import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../services/api';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCart = () => {
    setLoading(true);
    API.get('/cart')
      .then(res => setCart(res.data))
      .catch(() => setCart([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = (id) => {
    API.delete(`/cart/${id}`).then(fetchCart);
  };

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    setMessage('');
    API.post('/orders')
      .then(() => {
        setMessage('Đặt hàng thành công!');
        fetchCart();
      })
      .catch(() => setMessage('Đặt hàng thất bại!'))
      .finally(() => setPlacingOrder(false));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const total = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Giỏ hàng</Typography>
      {cart.length === 0 ? (
        <Typography>Giỏ hàng trống.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sách</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map(item => (
                <TableRow key={item._id}>
                  <TableCell>{item.book.title}</TableCell>
                  <TableCell>{item.book.author}</TableCell>
                  <TableCell>{item.book.price.toLocaleString()} đ</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleRemove(item._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2}><b>Tổng cộng</b></TableCell>
                <TableCell colSpan={3}><b>{total.toLocaleString()} đ</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" disabled={cart.length === 0 || placingOrder} onClick={handlePlaceOrder}>
          Đặt hàng
        </Button>
        {message && <Typography sx={{ mt: 2 }} color={message.includes('thành công') ? 'primary' : 'error'}>{message}</Typography>}
      </Box>
    </Container>
  );
}
