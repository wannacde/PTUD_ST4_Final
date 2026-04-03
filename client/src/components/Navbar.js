import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Badge, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import API from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminAnchor, setAdminAnchor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAnchorEl(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#1976d2' }}>
      <Toolbar>
        <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
          <MenuBookIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 'bold', mr: 3 }}
          onClick={() => navigate('/')}
        >
          BookStore
        </Typography>

        <Button
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ fontWeight: isActive('/') ? 'bold' : 'normal', textDecoration: isActive('/') ? 'underline' : 'none' }}
        >
          Trang chủ
        </Button>

        {user && (
          <>
            <IconButton color="inherit" onClick={() => navigate('/cart')} sx={{ ml: 1 }}>
              <Badge color="error" variant="dot">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/wishlist')} sx={{ ml: 0.5 }}>
              <FavoriteIcon />
            </IconButton>
            <Button
              color="inherit"
              onClick={() => navigate('/orders')}
              sx={{ fontWeight: isActive('/orders') ? 'bold' : 'normal' }}
            >
              Đơn hàng
            </Button>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {user && user.role === 'admin' && (
          <>
            <Chip
              label="ADMIN"
              color="warning"
              size="small"
              sx={{ mr: 1, fontWeight: 'bold' }}
            />
            <Button
              color="inherit"
              onClick={(e) => setAdminAnchor(e.currentTarget)}
              sx={{ fontWeight: 'bold' }}
            >
              Quản lý
            </Button>
            <Menu anchorEl={adminAnchor} open={Boolean(adminAnchor)} onClose={() => setAdminAnchor(null)}>
              <MenuItem onClick={() => { navigate('/admin/books'); setAdminAnchor(null); }}>Quản lý Sách</MenuItem>
              <MenuItem onClick={() => { navigate('/admin/categories'); setAdminAnchor(null); }}>Quản lý Thể loại</MenuItem>
              <MenuItem onClick={() => { navigate('/admin/orders'); setAdminAnchor(null); }}>Quản lý Đơn hàng</MenuItem>
              <MenuItem onClick={() => { navigate('/admin/users'); setAdminAnchor(null); }}>Quản lý Người dùng</MenuItem>
              <MenuItem onClick={() => { navigate('/admin/discountcodes'); setAdminAnchor(null); }}>Quản lý Mã giảm giá</MenuItem>
            </Menu>
          </>
        )}

        {user ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar
                src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : undefined}
                sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#1976d2', fontWeight: 'bold', fontSize: 14 }}
              >
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>
                <Typography variant="body2" fontWeight="bold">{user.username}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>Thông tin cá nhân</MenuItem>
              <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" variant="outlined" sx={{ mr: 1, borderColor: '#fff' }} onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
            <Button color="inherit" variant="contained" sx={{ bgcolor: '#fff', color: '#1976d2', '&:hover': { bgcolor: '#e3f2fd' } }} onClick={() => navigate('/register')}>
              Đăng ký
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
