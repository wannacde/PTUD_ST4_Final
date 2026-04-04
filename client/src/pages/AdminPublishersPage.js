import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../services/api';

export default function AdminPublishersPage() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', description: '' });
  const [error, setError] = useState('');

  const fetch = () => {
    setLoading(true);
    API.get('/publishers').then(res => setPublishers(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item ? { name: item.name, address: item.address || '', phone: item.phone || '', email: item.email || '', description: item.description || '' } : { name: '', address: '', phone: '', email: '', description: '' });
    setError('');
    setOpen(true);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editItem) {
        await API.put(`/publishers/${editItem._id}`, form);
      } else {
        await API.post('/publishers', form);
      }
      fetch();
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi, vui lòng thử lại');
    }
  };

  const handleDelete = id => {
    if (window.confirm('Xóa nhà xuất bản này?')) {
      API.delete(`/publishers/${id}`).then(fetch);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 8, mx: 'auto', display: 'block' }} />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Quản lý Nhà xuất bản</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>+ Thêm nhà xuất bản</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>Tên NXB</b></TableCell>
              <TableCell><b>Địa chỉ</b></TableCell>
              <TableCell><b>Điện thoại</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {publishers.length === 0 && (
              <TableRow><TableCell colSpan={5} align="center">Chưa có nhà xuất bản nào</TableCell></TableRow>
            )}
            {publishers.map(p => (
              <TableRow key={p._id} hover>
                <TableCell><b>{p.name}</b></TableCell>
                <TableCell>{p.address || '—'}</TableCell>
                <TableCell>{p.phone || '—'}</TableCell>
                <TableCell>{p.email || '—'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(p)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editItem ? 'Sửa nhà xuất bản' : 'Thêm nhà xuất bản'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField autoFocus label="Tên NXB *" name="name" fullWidth margin="dense" value={form.name} onChange={handleChange} required />
            <TextField label="Địa chỉ" name="address" fullWidth margin="dense" value={form.address} onChange={handleChange} />
            <TextField label="Điện thoại" name="phone" fullWidth margin="dense" value={form.phone} onChange={handleChange} />
            <TextField label="Email" name="email" fullWidth margin="dense" value={form.email} onChange={handleChange} />
            <TextField label="Mô tả" name="description" fullWidth margin="dense" multiline rows={2} value={form.description} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained">{editItem ? 'Lưu' : 'Thêm'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
