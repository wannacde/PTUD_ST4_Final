import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, CircularProgress, Alert,
  Switch, FormControlLabel, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../services/api';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', imageUrl: '', link: '', isActive: true, order: 0 });
  const [error, setError] = useState('');

  const fetch = () => {
    setLoading(true);
    API.get('/banners/all').then(res => setBanners(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item
      ? { title: item.title, imageUrl: item.imageUrl, link: item.link || '', isActive: item.isActive, order: item.order || 0 }
      : { title: '', imageUrl: '', link: '', isActive: true, order: 0 }
    );
    setError('');
    setOpen(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editItem) {
        await API.put(`/banners/${editItem._id}`, payload);
      } else {
        await API.post('/banners', payload);
      }
      fetch();
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi, vui lòng thử lại');
    }
  };

  const handleDelete = id => {
    if (window.confirm('Xóa banner này?')) {
      API.delete(`/banners/${id}`).then(fetch);
    }
  };

  const handleToggle = (banner) => {
    API.put(`/banners/${banner._id}`, { isActive: !banner.isActive }).then(fetch);
  };

  if (loading) return <CircularProgress sx={{ mt: 8, mx: 'auto', display: 'block' }} />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Quản lý Banner quảng cáo</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>+ Thêm banner</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>Thứ tự</b></TableCell>
              <TableCell><b>Tiêu đề</b></TableCell>
              <TableCell><b>Hình ảnh</b></TableCell>
              <TableCell><b>Link</b></TableCell>
              <TableCell><b>Trạng thái</b></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">Chưa có banner nào</TableCell></TableRow>
            )}
            {banners.map(b => (
              <TableRow key={b._id} hover>
                <TableCell>{b.order}</TableCell>
                <TableCell><b>{b.title}</b></TableCell>
                <TableCell>
                  <img src={b.imageUrl} alt={b.title} style={{ height: 48, maxWidth: 120, objectFit: 'cover', borderRadius: 4 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                </TableCell>
                <TableCell>{b.link || '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={b.isActive ? 'Đang hiện' : 'Đã ẩn'}
                    color={b.isActive ? 'success' : 'default'}
                    size="small"
                    onClick={() => handleToggle(b)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(b)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(b._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editItem ? 'Sửa banner' : 'Thêm banner'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField autoFocus label="Tiêu đề *" name="title" fullWidth margin="dense" value={form.title} onChange={handleChange} required />
            <TextField label="URL hình ảnh *" name="imageUrl" fullWidth margin="dense" value={form.imageUrl} onChange={handleChange} required />
            <TextField label="Link khi click" name="link" fullWidth margin="dense" value={form.link} onChange={handleChange} placeholder="/books" />
            <TextField label="Thứ tự hiển thị" name="order" fullWidth margin="dense" type="number" value={form.order} onChange={handleChange} />
            <FormControlLabel
              control={<Switch name="isActive" checked={form.isActive} onChange={handleChange} />}
              label="Hiển thị banner"
              sx={{ mt: 1 }}
            />
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
