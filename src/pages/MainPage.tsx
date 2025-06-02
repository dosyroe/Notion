import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const MainPage = () => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await axiosInstance.delete('http://localhost:5005/api/Auth/logout');
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('AccessToken отсутствует');
        return;
      }
      await axiosInstance.delete('http://localhost:5005/api/Auth/deleteAccount', {
        data: { accessToken, password }
      });
      localStorage.removeItem('accessToken');
      navigate('/register');
    } catch (err) {
      setError('Ошибка при удалении аккаунта. Проверьте пароль.');
      console.error('Ошибка при удалении аккаунта:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--main-bg, #18181A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight={700} color="var(--primary-text, #fff)">
        Добро пожаловать в MainPage!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{
          bgcolor: 'var(--btn-color, #725EFE)',
          '&:hover': { bgcolor: '#5a48d6' },
        }}
      >
        Выйти
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => setDeleteDialogOpen(true)}
        sx={{
          borderColor: 'var(--btn-color, #725EFE)',
          color: 'var(--btn-color, #725EFE)',
          '&:hover': { borderColor: '#5a48d6', color: '#5a48d6' },
        }}
      >
        Удалить аккаунт
      </Button>

      {/* Диалоговое окно для подтверждения удаления аккаунта */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Удаление аккаунта</DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={2}>
            Для удаления аккаунта введите ваш пароль.
          </Typography>
          <TextField
            type="password"
            label="Пароль"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Отмена
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainPage;