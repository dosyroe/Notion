import { Link, useNavigate } from 'react-router-dom';
import styles from './auth.module.css';

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ErrorBanner from './ErrorBanner';

const RegisterPage = () => {
  const [Name, setName] = useState('');
  const [Login, setLogin] = useState('');
  const [Password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ Login?: string; Password?: string; Name?: string }>({});
  const [banner, setBanner] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (banner.length > 0) {
      const timer = setTimeout(() => setBanner([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [banner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { Login?: string; Password?: string; Name?: string } = {};
    if (!Name.trim()) {
      newErrors.Name = 'Поле Name не заполнено';
    }
    if (!Login.trim()) {
      newErrors.Login = 'Поле Login не заполнено';
    }
    // Простая Login-проверка
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(Login)) {
      newErrors.Login = 'Некорректный Login';
    }
    if (!Password) {
      newErrors.Password = 'Поле пароль не заполнено';
    } else if (Password.length < 8) {
      newErrors.Password = 'В пароле должно быть минимум 8 символов';
    }
    setErrors(newErrors);
    // Собираем все ошибки в массив для баннера
    const errorMessages = Object.values(newErrors).filter(Boolean) as string[];
    if (errorMessages.length > 0) {
      setBanner(errorMessages);
      return;
    }
    try {
      const response = await axiosInstance.post('http://localhost:5005/api/Auth/register', { Name, Login, Password });
      if (response.data?.AccessToken) {
        localStorage.setItem('AccessToken', response.data.AccessToken);
        navigate('/main');
      }
    } catch (err: unknown) {
      let message = 'Ошибка регистрации';
      interface AxiosError {
        isAxiosError?: boolean;
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      }
      const axiosError = err as AxiosError;
      if (axiosError.isAxiosError) {
        message = axiosError.response?.data?.message || axiosError.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setBanner([message]);
      setErrors({ ...newErrors, Login: message });
    }
  };

  return (
    <>
      <ErrorBanner message={banner.length > 0 ? banner.join(' | ') : ''} />
      <div className={styles['block']}>
        <div className={styles['main-block']}>
        <div className={styles['text']}>
          <p className={styles['welcome']}>Welcome</p>
          <p className={styles['enter']}>Enter your userName, Login and Password to access your account.</p>
        </div>
        <form onSubmit={handleSubmit} className={styles['inputs']} noValidate>
          <div className={styles['input']}>
            <p>UserName</p>
            <input
              type="text"
              placeholder="UserName"
              value={Name}
              onChange={e => setName(e.target.value)}
              required
              className={errors.Name ? styles['input-error'] : ''}
            />
          </div>
          <div className={styles['input']}>
            <p>Login</p>
            <input
              type="text"
              placeholder="Login"
              value={Login}
              onChange={e => setLogin(e.target.value)}
              required
              className={errors.Login ? styles['input-error'] : ''}
            />
          </div>
          <div className={styles['input']}>
            <p>Password</p>
            <input
              type="Password"
              placeholder="Password"
              value={Password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              required
              className={errors.Password ? styles['input-error'] : ''}
            />
          </div>
          <div className={styles['remember-forgot']}>
            <div className={styles['remember']}>
              <input type="checkbox" />
              <p>Remember Me</p>
            </div>
            <div className={styles['forgot']}>
              <p>Forgot Your Password?</p>
            </div>
          </div>
          <button type="submit">Log In</button>
        </form>
        <div className={styles['text2']}>
          <p>Do you have an account?</p>
          <Link to="/login">Login Now.</Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default RegisterPage;
