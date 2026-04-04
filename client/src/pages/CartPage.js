import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Box, CircularProgress,
  TextField, Stack, Divider, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import API from '../services/api';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [discountCode, setDiscountCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [applyingCode, setApplyingCode] = useState(false);

  const fetchCart = () => {
    setLoading(true);
    API.get('/cart')
      .then(res => setCart(res.data))
      .catch(() => setCart([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = (id) => {
    API.delete(`/cart/${id}`).then(fetchCart);
  };

  const handleQuantity = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    API.put(`/cart/${item._id}`, { quantity: newQty }).then(fetchCart);
  };

  const handleApplyCode = () => {
    if (!discountCode.trim()) return;
    setApplyingCode(true);
    setDiscountInfo(null);
    API.post('/discountcodes/apply', { code: discountCode.trim() })
      .then(res => setDiscountInfo(res.data))
      .catch(() => setMessage({ text: 'Mã giảm giá không hợp lệ!', type: 'error' }))
      .finally(() => setApplyingCode(false));
  };

  const handlePlaceOrder = () => {
    setPlacingOrder(true);
    setMessage({ text: '', type: 'success' });
    API.post('/orders', discountInfo ? { discountCode: discountInfo.code } : {})
      .then(() => {
        setMessage({ text: 'Đặt hàng thành công!', type: 'success' });
        setDiscountCode('');
        setDiscountInfo(null);
        fetchCart();
      })
      .catch(() => setMessage({ text: 'Đặt hàng thất bại!', type: 'error' }))
      .finally(() => setPlacingOrder(false));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const discountAmount = discountInfo ? Math.round(subtotal * discountInfo.discount / 100) : 0;
  const total = subtotal - discountAmount;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Giỏ hàng</Typography>
      {cart.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#fafafa' }}>
          <Typography variant="h6" color="text.secondary">Giỏ hàng trống.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Hãy thêm sách vào giỏ từ trang chủ.
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><b>Sách</b></TableCell>
                  <TableCell><b>Tác giả</b></TableCell>
                  <TableCell align="right"><b>Đơn giá</b></TableCell>
                  <TableCell align="center"><b>Số lượng</b></TableCell>
                  <TableCell align="right"><b>Thành tiền</b></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item._id} hover>
                    <TableCell>{item.book.title}</TableCell>
                    <TableCell>{item.book.author}</TableCell>
                    <TableCell align="right">{item.book.price.toLocaleString()} đ</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                        <IconButton size="small" onClick={() => handleQuantity(item, -1)} disabled={item.quantity <= 1}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: 28, textAlign: 'center' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleQuantity(item, 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{(item.book.price * item.quantity).toLocaleString()} đ</TableCell>
                    <TableCell>
                      <IconButton color="error" size="small" onClick={() => handleRemove(item._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Discount Code */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              <LocalOfferIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: 18 }} />
              Mã giảm giá
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Nhập mã giảm giá"
                value={discountCode}
                onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountInfo(null); }}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleApplyCode} disabled={applyingCode || !discountCode.trim()}>
                Áp dụng
              </Button>
            </Stack>
            {discountInfo && (
              <Alert severity="success" sx={{ mt: 1 }}>
                Áp dụng mã <b>{discountInfo.code}</b> — giảm <b>{discountInfo.discount}%</b> ({discountInfo.description})
              </Alert>
            )}
          </Paper>

          {/* Summary */}
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Tạm tính</Typography>
                <Typography>{subtotal.toLocaleString()} đ</Typography>
              </Stack>
              {discountInfo && (
                <Stack direction="row" justifyContent="space-between" color="success.main">
                  <Typography>Giảm giá ({discountInfo.discount}%)</Typography>
                  <Typography>- {discountAmount.toLocaleString()} đ</Typography>
                </Stack>
              )}
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">Tổng cộng</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">{total.toLocaleString()} đ</Typography>
              </Stack>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              disabled={placingOrder}
              onClick={handlePlaceOrder}
            >
              {placingOrder ? 'Đang đặt hàng...' : 'Đặt hàng ngay'}
            </Button>
            {message.text && (
              <Alert severity={message.type} sx={{ mt: 2 }}>{message.text}</Alert>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
}


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
