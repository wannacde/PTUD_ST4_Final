import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Alert,
  Paper,
  Grid,
  Stack,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import API from '../services/api';

export default function ProfilePage() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addressOptionsLoading, setAddressOptionsLoading] = useState(false);
  const [addressOptionsError, setAddressOptionsError] = useState('');
  const [user, setUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressMessage, setAddressMessage] = useState('');
  const [editingAddressId, setEditingAddressId] = useState('');
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    isDefault: false
  });

  const [notifications, setNotifications] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    fetchVietnamProvinces();

    setLoadingProfile(true);
    API.get('/auth/me')
      .then(res => {
        setUser(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingProfile(false));

    fetchAddresses();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!addressForm.city) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const selectedProvince = provinces.find((item) => item.name === addressForm.city);
    if (!selectedProvince) return;

    fetchProvinceDistricts(selectedProvince.code);
  }, [addressForm.city, provinces]);

  useEffect(() => {
    if (!addressForm.city || !addressForm.district) {
      setWards([]);
      return;
    }

    const selectedDistrict = districts.find((item) => item.name === addressForm.district);
    if (!selectedDistrict) return;

    fetchDistrictWards(selectedDistrict.code);
  }, [addressForm.district, districts, addressForm.city]);

  const fetchVietnamProvinces = async () => {
    setAddressOptionsLoading(true);
    setAddressOptionsError('');
    try {
      const response = await fetch('https://provinces.open-api.vn/api/p/');
      const data = await response.json();
      setProvinces(data || []);
    } catch {
      setAddressOptionsError('Khong tai duoc danh sach tinh/thanh pho.');
      setProvinces([]);
    } finally {
      setAddressOptionsLoading(false);
    }
  };

  const fetchProvinceDistricts = async (provinceCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await response.json();
      setDistricts(data.districts || []);
    } catch {
      setDistricts([]);
    }
  };

  const fetchDistrictWards = async (districtCode) => {
    try {
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await response.json();
      setWards(data.wards || []);
    } catch {
      setWards([]);
    }
  };

  const fetchAddresses = () => {
    setAddressLoading(true);
    API.get('/address')
      .then(res => setAddresses(res.data || []))
      .catch(() => setAddresses([]))
      .finally(() => setAddressLoading(false));
  };

  const fetchNotifications = () => {
    setNotificationLoading(true);
    API.get('/notifications')
      .then(res => setNotifications(res.data || []))
      .catch(() => setNotifications([]))
      .finally(() => setNotificationLoading(false));
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (avatar) formData.append('avatar', avatar);
    try {
      await API.put('/auth/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfileMessage('Cập nhật thành công!');
    } catch {
      setProfileMessage('Cập nhật thất bại!');
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      isDefault: false
    });
    setEditingAddressId('');
    setDistricts([]);
    setWards([]);
  };

  const handleAddressChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === 'city') {
      setAddressForm((prev) => ({
        ...prev,
        city: value,
        district: '',
        ward: ''
      }));
      return;
    }

    if (name === 'district') {
      setAddressForm((prev) => ({
        ...prev,
        district: value,
        ward: ''
      }));
      return;
    }

    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressMessage('');
    try {
      if (editingAddressId) {
        await API.put(`/address/${editingAddressId}`, addressForm);
      } else {
        await API.post('/address', addressForm);
      }
      setAddressMessage('Lưu địa chỉ thành công!');
      resetAddressForm();
      fetchAddresses();
    } catch (err) {
      setAddressMessage(err.response?.data?.message || 'Lưu địa chỉ thất bại!');
    }
  };

  const handleEditAddress = (item) => {
    setEditingAddressId(item._id);
    setAddressForm({
      fullName: item.fullName || '',
      phone: item.phone || '',
      address: item.address || '',
      city: item.city || '',
      district: item.district || '',
      ward: item.ward || '',
      isDefault: !!item.isDefault
    });
  };

  const handleDeleteAddress = async (id) => {
    try {
      await API.delete(`/address/${id}`);
      setAddressMessage('Xoa dia chi thanh cong!');
      fetchAddresses();
    } catch {
      setAddressMessage('Xoa dia chi that bai!');
    }
  };

  const handleMarkAsRead = async (id) => {
    await API.put(`/notifications/${id}/read`);
    window.dispatchEvent(new Event('notifications-updated'));
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await API.put('/notifications/read-all');
    window.dispatchEvent(new Event('notifications-updated'));
    fetchNotifications();
  };

  const handleDeleteNotification = async (id) => {
    await API.delete(`/notifications/${id}`);
    window.dispatchEvent(new Event('notifications-updated'));
    fetchNotifications();
  };

  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Typography align="center" sx={{ mt: 8 }}>Vui long dang nhap de xem thong tin ca nhan.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>Thong tin ca nhan</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Ho so</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar src={user.avatar ? `http://localhost:5000/uploads/${user.avatar}` : undefined} sx={{ width: 84, height: 84, mb: 2 }} />
              <form onSubmit={handleUpdate} style={{ width: '100%' }}>
                <TextField label="Ten dang nhap" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
                <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button variant="outlined" component="label">
                    Chon anh dai dien
                    <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                  </Button>
                  <Button type="submit" variant="contained" color="primary">Cap nhat</Button>
                </Stack>
              </form>
              {profileMessage && <Alert sx={{ mt: 2, width: '100%' }} severity={profileMessage.includes('thanh cong') ? 'success' : 'error'}>{profileMessage}</Alert>}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6">Thong bao</Typography>
              <Button size="small" startIcon={<DoneAllIcon />} onClick={handleMarkAllAsRead}>Danh dau da doc tat ca</Button>
            </Stack>
            <Divider sx={{ mb: 1.5 }} />

            {notificationLoading ? (
              <CircularProgress size={22} />
            ) : notifications.length === 0 ? (
              <Typography color="text.secondary">Ban chua co thong bao nao.</Typography>
            ) : (
              <List dense disablePadding>
                {notifications.slice(0, 8).map((n) => (
                  <ListItem
                    key={n._id}
                    sx={{
                      bgcolor: n.isRead ? 'transparent' : '#f5f9ff',
                      borderRadius: 1,
                      mb: 1,
                      alignItems: 'flex-start'
                    }}
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        {!n.isRead && (
                          <IconButton edge="end" onClick={() => handleMarkAsRead(n._id)}>
                            <MarkEmailReadIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton edge="end" color="error" onClick={() => handleDeleteNotification(n._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight={n.isRead ? 500 : 700}>{n.title}</Typography>
                          <Chip size="small" label={n.isRead ? 'Da doc' : 'Moi'} color={n.isRead ? 'default' : 'primary'} />
                        </Stack>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>{n.message}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(n.createdAt).toLocaleString('vi-VN')}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Dia chi giao hang</Typography>
            {addressOptionsError && <Alert severity="warning" sx={{ mb: 2 }}>{addressOptionsError}</Alert>}
            <Grid container spacing={2} component="form" onSubmit={handleSaveAddress}>
              <Grid item xs={12} md={6}>
                <TextField name="fullName" label="Ho ten" value={addressForm.fullName} onChange={handleAddressChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="phone" label="So dien thoai" value={addressForm.phone} onChange={handleAddressChange} fullWidth required />
              </Grid>
              <Grid item xs={12}>
                <TextField name="address" label="So nha, ten duong" value={addressForm.address} onChange={handleAddressChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required disabled={addressOptionsLoading}>
                  <InputLabel id="address-city-label">Tinh/Thanh pho</InputLabel>
                  <Select
                    labelId="address-city-label"
                    label="Tinh/Thanh pho"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                  >
                    {provinces.map((province) => (
                      <MenuItem key={province.code} value={province.name}>{province.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required disabled={!addressForm.city || addressOptionsLoading}>
                  <InputLabel id="address-district-label">Quan/Huyen</InputLabel>
                  <Select
                    labelId="address-district-label"
                    label="Quan/Huyen"
                    name="district"
                    value={addressForm.district}
                    onChange={handleAddressChange}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district.code} value={district.name}>{district.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth disabled={!addressForm.district || addressOptionsLoading}>
                  <InputLabel id="address-ward-label">Phuong/Xa</InputLabel>
                  <Select
                    labelId="address-ward-label"
                    label="Phuong/Xa"
                    name="ward"
                    value={addressForm.ward}
                    onChange={handleAddressChange}
                  >
                    <MenuItem value="">Khong chon</MenuItem>
                    {wards.map((ward) => (
                      <MenuItem key={ward.code} value={ward.name}>{ward.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} />}
                  label="Dat lam dia chi mac dinh"
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1}>
                  <Button type="submit" variant="contained">{editingAddressId ? 'Luu cap nhat' : 'Them dia chi'}</Button>
                  {editingAddressId && <Button onClick={resetAddressForm}>Huy sua</Button>}
                </Stack>
              </Grid>
            </Grid>

            {addressMessage && (
              <Alert sx={{ mt: 2 }} severity={addressMessage.toLowerCase().includes('thanh cong') ? 'success' : 'error'}>
                {addressMessage}
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />
            {addressLoading ? (
              <CircularProgress size={22} />
            ) : addresses.length === 0 ? (
              <Typography color="text.secondary">Chua co dia chi nao.</Typography>
            ) : (
              <List disablePadding>
                {addresses.map((addr) => (
                  <ListItem
                    key={addr._id}
                    sx={{ border: '1px solid #eee', borderRadius: 1, mb: 1 }}
                    secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        <IconButton color="primary" onClick={() => handleEditAddress(addr)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteAddress(addr._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography fontWeight={600}>{addr.fullName} - {addr.phone}</Typography>
                          {addr.isDefault && <Chip size="small" color="success" label="Mac dinh" />}
                        </Stack>
                      }
                      secondary={`${addr.address}, ${addr.ward ? `${addr.ward}, ` : ''}${addr.district}, ${addr.city}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
