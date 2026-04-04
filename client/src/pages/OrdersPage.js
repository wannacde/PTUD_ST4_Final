import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Chip } from '@mui/material';
import API from '../services/api';

const STATUS_MAP = {
  pending:   { label: 'Chờ xác nhận', color: 'warning' },
  paid:      { label: 'Đã thanh toán', color: 'info' },
  shipped:   { label: 'Đang giao',    color: 'primary' },
  completed: { label: 'Hoàn thành',   color: 'success' },
  cancelled: { label: 'Đã huỷ',       color: 'error' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders')
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Lịch sử đơn hàng</Typography>
      {orders.length === 0 ? (
        <Typography>Bạn chưa có đơn hàng nào.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
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
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_MAP[order.status]?.label || order.status}
                      color={STATUS_MAP[order.status]?.color || 'default'}
                      size="small"
                    />
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
      )}
    </Container>
  );
}
