import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API from '../services/api';

export default function AdminDiscountCodesPage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editCode, setEditCode] = useState(null);
  const [form, setForm] = useState({ code: '', discount: '', description: '' });

  const fetchCodes = () => {
    setLoading(true);
    API.get('/discountcodes').then(res => setCodes(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleOpen = (code = null) => {
    setEditCode(code);
    setForm(code ? { ...code } : { code: '', discount: '', description: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editCode) {
      await API.put(`/discountcodes/${editCode._id}`, form);
    } else {
      await API.post('/discountcodes', form);
    }
    fetchCodes();
    handleClose();
  };

  const handleDelete = id => {
    API.delete(`/discountcodes/${id}`).then(fetchCodes);
  };

  if (loading) return <CircularProgress sx={{ mt: 8, mx: 'auto', display: 'block' }} />;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Quản lý Mã giảm giá (Admin)</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Thêm mã giảm giá</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Giảm (%)</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codes.map(code => (
              <TableRow key={code._id}>
                <TableCell>{code.code}</TableCell>
                <TableCell>{code.discount}</TableCell>
                <TableCell>{code.description}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(code)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(code._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editCode ? 'Cập nhật mã' : 'Thêm mã mới'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField margin="dense" label="Mã" name="code" value={form.code} onChange={handleChange} fullWidth required />
            <TextField margin="dense" label="Giảm (%)" name="discount" value={form.discount} onChange={handleChange} fullWidth required type="number" />
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
