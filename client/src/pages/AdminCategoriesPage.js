import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = () => {
    setLoading(true);
    API.get('/categories').then(res => setCategories(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpen = (cat = null) => {
    setEditCategory(cat);
    setForm(cat ? { ...cat } : { name: '', description: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editCategory) {
      await API.put(`/categories/${editCategory._id}`, form);
    } else {
      await API.post('/categories', form);
    }
    fetchCategories();
    handleClose();
  };

  const handleDelete = id => {
    API.delete(`/categories/${id}`).then(fetchCategories);
  };

  if (loading) return <CircularProgress sx={{ mt: 8, mx: 'auto', display: 'block' }} />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Quản lý Thể loại (Admin)</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Thêm thể loại</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên thể loại</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat._id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(cat)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(cat._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editCategory ? 'Cập nhật thể loại' : 'Thêm thể loại mới'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Tên thể loại" name="name" value={form.name} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Mô tả" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit" variant="contained">Lưu</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
