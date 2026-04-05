import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../services/api';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', price: '', description: '', category: '', publisher: '', stock: '', image: null });

  const fetchBooks = () => {
    setLoading(true);
    API.get('/books').then(res => setBooks(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  useEffect(() => {
    API.get('/categories').then(res => setCategories(res.data || [])).catch(() => setCategories([]));
    API.get('/publishers').then(res => setPublishers(res.data || [])).catch(() => setPublishers([]));
  }, []);

  const handleOpen = (book = null) => {
    setEditBook(book);
    setForm(book
      ? {
        title: book.title || '',
        author: book.author || '',
        price: book.price || '',
        description: book.description || '',
        category: book.category || '',
        publisher: book.publisher || '',
        stock: book.stock || '',
        image: null
      }
      : { title: '', author: '', price: '', description: '', category: '', publisher: '', stock: '', image: null }
    );
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => v && data.append(k, v));
    if (editBook) {
      await API.put(`/books/${editBook._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      await API.post('/books', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    fetchBooks();
    handleClose();
  };

  const handleDelete = id => {
    API.delete(`/books/${id}`).then(fetchBooks);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Quản lý Sách (Admin)</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Thêm sách</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thể loại</TableCell>
              <TableCell>NXB</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map(book => (
              <TableRow key={book._id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.price.toLocaleString()} đ</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.publisher || '—'}</TableCell>
                <TableCell>{book.stock}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(book)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(book._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editBook ? 'Cập nhật sách' : 'Thêm sách mới'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Tiêu đề" name="title" value={form.title} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Tác giả" name="author" value={form.author} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Giá" name="price" value={form.price} onChange={handleChange} fullWidth required type="number" />
            <FormControl margin="dense" fullWidth>
              <InputLabel id="book-category-label">Thể loại</InputLabel>
              <Select
                labelId="book-category-label"
                label="Thể loại"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <MenuItem value=""><em>Không chọn</em></MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c.name}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl margin="dense" fullWidth>
              <InputLabel id="book-publisher-label">Nhà xuất bản</InputLabel>
              <Select
                labelId="book-publisher-label"
                label="Nhà xuất bản"
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
              >
                <MenuItem value=""><em>Không chọn</em></MenuItem>
                {publishers.map((p) => (
                  <MenuItem key={p._id} value={p.name}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField margin="dense" label="Số lượng" name="stock" value={form.stock} onChange={handleChange} fullWidth type="number" />
            <TextField margin="dense" label="Mô tả" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} />
            <Button variant="contained" component="label" sx={{ mt: 1 }}>
              Chọn ảnh
              <input type="file" name="image" hidden accept="image/*" onChange={handleChange} />
            </Button>
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
