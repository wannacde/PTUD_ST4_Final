import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, CircularProgress } from '@mui/material';
import API from '../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    API.get('/orders/all')
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (id, status) => {
    API.put(`/orders/${id}/status`, { status }).then(fetchOrders);
  };

  if (loading) return <CircularProgress sx={{ mt: 8, mx: 'auto', display: 'block' }} />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Quản lý Đơn hàng (Admin)</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Sản phẩm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
                <TableCell>{order._id.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{order.user?.username || order.user}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">pending</MenuItem>
                    <MenuItem value="paid">paid</MenuItem>
                    <MenuItem value="shipped">shipped</MenuItem>
                    <MenuItem value="completed">completed</MenuItem>
                    <MenuItem value="cancelled">cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{order.total.toLocaleString()} đ</TableCell>
                <TableCell>
                  {order.items.map(item => (
                    <div key={item.book._id}>{item.book.title} x {item.quantity}</div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
