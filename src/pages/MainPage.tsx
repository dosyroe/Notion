import { Link } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const MainPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'var(--main-bg, #18181A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          bgcolor: 'var(--panel-color, #27292B)',
          color: 'var(--primary-text, #fff)',
          minWidth: 340,
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2}>
          Добро пожаловать в Notion-клон!
        </Typography>
        <Typography variant="body1" mb={4}>
          Для продолжения войдите в аккаунт или зарегистрируйтесь.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center">
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              bgcolor: 'var(--btn-color, #725EFE)',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { bgcolor: '#5a48d6' },
            }}
          >
            Войти
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            sx={{
              borderColor: 'var(--btn-color, #725EFE)',
              color: 'var(--btn-color, #725EFE)',
              fontWeight: 600,
              '&:hover': { borderColor: '#5a48d6', color: '#5a48d6' },
            }}
          >
            Регистрация
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MainPage;