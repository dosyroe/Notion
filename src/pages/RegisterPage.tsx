import { Link, useNavigate } from 'react-router-dom';
import styles from './auth.module.css';

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import ErrorBanner from './ErrorBanner';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
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
    const newErrors: { email?: string; password?: string; name?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Поле name не заполнено';
    }
    if (!email.trim()) {
      newErrors.email = 'Поле email не заполнено';
    }
    // Простая email-проверка
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newErrors.email = 'Некорректный email';
    }
    if (!password) {
      newErrors.password = 'Поле пароль не заполнено';
    } else if (password.length < 8) {
      newErrors.password = 'В пароле должно быть минимум 8 символов';
    }
    setErrors(newErrors);
    // Собираем все ошибки в массив для баннера
    const errorMessages = Object.values(newErrors).filter(Boolean) as string[];
    if (errorMessages.length > 0) {
      setBanner(errorMessages);
      return;
    }
    try {
      const response = await axiosInstance.post('http://localhost:5005/api/Auth/register', { name, email, password });
      if (response.data?.AccsesToken) {
        localStorage.setItem('AccessToken', response.data.AccessToken);
        navigate('/main'); // Переход на MainPage
      }
    } catch (err: unknown) {
      let message = 'Ошибка регистрации';
      // Define a type for Axios error
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
      setErrors({ ...newErrors, email: message });
    }
  };

  return (
    <>
      <ErrorBanner message={banner.length > 0 ? banner.join(' | ') : ''} />
      <div className={styles['block']}>
        <div className={styles['main-block']}>
        <div className={styles['text']}>
          <p className={styles['welcome']}>Welcome</p>
          <p className={styles['enter']}>Enter your username, email and password to access your account.</p>
        </div>
        <form onSubmit={handleSubmit} className={styles['inputs']} noValidate>
          <div className={styles['input']}>
            <p>Username</p>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={errors.name ? styles['input-error'] : ''}
            />
          </div>
          <div className={styles['input']}>
            <p>Email</p>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={errors.email ? styles['input-error'] : ''}
            />
          </div>
          <div className={styles['input']}>
            <p>Password</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              required
              className={errors.password ? styles['input-error'] : ''}
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
