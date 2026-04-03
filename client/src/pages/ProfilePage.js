import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Avatar, Button, TextField, Alert } from '@mui/material';
import API from '../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/auth/me')
      .then(res => {
        setUser(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
      })
      .catch(() => setUser(null));
  }, []);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (avatar) formData.append('avatar', avatar);
    try {
      await API.put('/auth/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Cập nhật thành công!');
    } catch {
      setMessage('Cập nhật thất bại!');
    }
  };

  if (!user) return <Typography align="center" sx={{ mt: 8 }}>Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Thông tin cá nhân</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : undefined} sx={{ width: 80, height: 80, mb: 2 }} />
        <form onSubmit={handleUpdate} style={{ width: '100%' }}>
          <TextField label="Tên đăng nhập" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Chọn ảnh đại diện
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Cập nhật</Button>
        </form>
        {message && <Alert sx={{ mt: 2 }} severity={message.includes('thành công') ? 'success' : 'error'}>{message}</Alert>}
      </Box>
    </Container>
  );
}
