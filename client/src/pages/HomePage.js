import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Card, CardMedia, CardContent, Typography, CardActions,
  Button, CircularProgress, Box, TextField, InputAdornment, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/books')
      .then(res => setBooks(res.data))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = books.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: '#1976d2', color: '#fff', py: 6, textAlign: 'center' }}>
        <Container>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Chào mừng đến BookStore
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Khám phá hàng ngàn cuốn sách hay với giá tốt nhất
          </Typography>
          <TextField
            placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: '#fff', borderRadius: 2, width: { xs: '100%', sm: '60%' },
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Danh sách sách {filtered.length > 0 && `(${filtered.length})`}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : filtered.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#fafafa' }}>
            <MenuBookIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {books.length === 0
                ? 'Chưa có sách nào trong hệ thống'
                : 'Không tìm thấy sách phù hợp'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {books.length === 0
                ? 'Admin có thể thêm sách mới từ trang quản lý.'
                : 'Thử tìm kiếm với từ khóa khác.'}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filtered.map(book => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                <Card sx={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                }}>
                  {book.image ? (
                    <CardMedia
                      component="img"
                      height="220"
                      image={`http://localhost:5000/uploads/${book.image}`}
                      alt={book.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ height: 220, bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MenuBookIcon sx={{ fontSize: 60, color: '#90caf9' }} />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>{book.title}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{book.author}</Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {book.price?.toLocaleString()} đ
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button fullWidth variant="contained" onClick={() => navigate(`/books/${book._id}`)}>
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
