import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth"; // Импорт fetchRegister
import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    try {
      const data = await dispatch(fetchRegister(values)); // Используйте fetchRegister

      if (data.payload && data.payload.token) {
        window.localStorage.setItem('token', data.payload.token);
        // Вы можете также перенаправить пользователя на главную страницу или показать сообщение об успехе
      } else {
        alert('Не удалось зарегистрироваться');
      }
    } catch (error) {
      console.error('Ошибка регистрации', error);
      alert('Ошибка регистрации');
    }
  };

  if (isAuth) {
    // Перенаправление на главную страницу, если пользователь уже авторизован
    return <Navigate to="/" replace />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          fullWidth
          {...register('fullName', { required: 'Укажите полное имя' })}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          {...register('email', {
            required: 'Укажите почту',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Некорректный адрес электронной почты'
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type="password"
          fullWidth
          {...register('password', {
            required: 'Укажите пароль',
            minLength: {
              value: 6,
              message: 'Пароль должен содержать минимум 6 символов'
            }
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          size="large"
          variant="contained"
          fullWidth
          disabled={!isValid}
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};