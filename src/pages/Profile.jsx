import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/authContext";
import Error from './Error';
import axios from '../axios';
import { Paper, Typography, TextField, FormControlLabel, Switch, Button } from "@mui/material";

const Profile = () => {
  const { isAuth, currentUser, auth } = React.useContext(AuthContext);
  const [changePassword, setChangePassword] = React.useState(false);
  const navigate = useNavigate();

  const accLevel = ['', 'лише читання даних', 'читання і редагування даних', 'повний, у т.ч. адміністрування'];
  const { register, handleSubmit, unregister, getValues, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: isAuth ? currentUser.FullName : '',
      posada: isAuth ? currentUser.Posada : '',
      email: isAuth ? currentUser.Email : '',
      oldPassword: '',
      newPassword: '',
      newPassword2: ''
    },
    mode: 'onChange'
  });

  const showPasswords = () => {
    if (changePassword) {
      setChangePassword(false);
      unregister('oldPassword');
      unregister('newPassword');
      unregister('newPassword2');
    } else {
      setChangePassword(true);
      register('oldPassword');
      register('newPassword');
      register('newPassword2');
    }
  }

  const onSubmit = async (values) => {
    if (values.fullName !== currentUser.FullName || values.posada !== currentUser.Posada || values.email !== currentUser.Email || changePassword) {
      if (changePassword && values.newPassword !== values.newPassword2) return alert('Ви вказали різні дані у полях вводу нового паролю!');
      if (changePassword && values.oldPassword === values.newPassword) return alert('Поточний та новий пароль однакові!');
      values.id = currentUser.Id;
      values.changePassword = changePassword;
      await axios.patch("/auth/profile", values)
        .then(res => {
          alert(res.data);
          auth();
          navigate('/');
        })
        .catch(err => {
          alert(err.response.data);
        });
    } else navigate('/');
  };

  const cancelHandleClick = () => {
    const values = getValues();
    values.fullName === currentUser.FullName && values.posada === currentUser.Posada && values.email === currentUser.Email && !changePassword
      ? navigate('/')
      : window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?') && navigate('/')
  }

  return isAuth
    ? <Paper classes={{ root: "profile_root" }}>
      <Typography classes={{ root: "profile_title" }} variant="h4">Ваші персональні дані</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          sx={{ mb: 3 }}
          id="fullName"
          label="Прізвище, ім'я та по-батькові"
          error={Boolean(errors.minLength?.message)}
          helperText={errors.minLength?.message}
          {...register('fullName', { required: 'Вкажіть ПІБ', minLength: 4 })}
          fullWidth />
        <TextField
          sx={{ mb: 3 }}
          id="posada"
          label="Посада/статус"
          error={Boolean(errors.minLength?.message)}
          helperText={errors.minLength?.message}
          {...register('posada', { required: 'Вкажіть посаду або поточний статус', minLength: 8 })}
          fullWidth />
        <TextField
          sx={{ mb: 3 }}
          id="email"
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', {
            required: 'Вкажіть пошту', pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Невірний формат e-mail"
            }
          })}
          fullWidth />
        <Typography sx={{ mb: 3 }} title={"для зміни рівня доступу звертатися до адміністратора реєстру"}>
          Рівень доступу: <span style={{ fontWeight: "bold" }}>{accLevel[currentUser.acc]}</span>
        </Typography>
        <FormControlLabel
          label="змінити пароль"
          sx={{ display: 'block', mb: 3 }}
          control={<Switch
            checked={changePassword}
            onChange={showPasswords}
            inputProps={{ 'aria-label': 'controlled' }} />}
        />
        {changePassword && <div>
          <TextField
            sx={{ mb: 3 }}
            id="oldPassword"
            type="password"
            // required
            label="Поточний пароль"
            {...register('oldPassword', { required: 'Вкажіть поточний пароль' })}
            fullWidth />
          <TextField
            sx={{ mb: 3 }}
            id="newPassword"
            type="password"
            label="Новий пароль (мінімум - 8 символів)"
            error={Boolean(errors.newPassword?.message)}
            helperText={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'Вкажіть новий пароль', pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{8,}/,
                message: "Повинен містити малі та великі літери, цифри та спец.символи (@#$%^ і т.п.)"
              }
            })}
            fullWidth />
          <TextField
            sx={{ mb: 3 }}
            id="newPassword2"
            type="password"
            label="Новий пароль (ще раз)"
            error={Boolean(errors.newPassword2)}
            helperText={errors.newPassword2?.message}
            {...register('newPassword2', {
              required: 'Вкажіть новий пароль ще раз', pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{8,}/,
                message: "Повинен містити малі та великі літери, цифри та спец.символи (@#$%^ і т.п.)"
              }
            })}
            fullWidth />
        </div>}
        <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Зберегти</Button>
        <Button onClick={cancelHandleClick} type="button" size="large" variant="outlined">Скасувати</Button>
      </form>
    </Paper>
    : <Error />
}

export default Profile;