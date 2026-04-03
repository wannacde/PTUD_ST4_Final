import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import API from '../services/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    try {
      await API.post('/auth/register', { username, email, password });
      setSuccess('Đăng ký thành công! Hãy đăng nhập.');
      setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Đăng ký</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          <TextField margin="normal" required fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <TextField margin="normal" required fullWidth label="Nhập lại mật khẩu" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>Đăng ký</Button>
        </Box>
      </Box>
    </Container>
  );
}
