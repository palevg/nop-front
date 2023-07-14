import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Paper, FormControl, Typography, TextField, IconButton, OutlinedInput, InputLabel, InputAdornment } from "@mui/material";
import "../styles/Login.css";

export const Login = () => {
  let ip;
  const getIP = async () => { await axios.get('https://api.ipify.org/').then(response => ip = response.data) }
  getIP();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { isAuth, login } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async (values) => {
    values.ip = ip;
    login(values);
  };

  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: "login_root" }}>
      <Typography classes={{ root: "login_title" }} variant="h5">
        Вхід у реєстр
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className="login_field"
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
          fullWidth
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
          <OutlinedInput
            className="login_field"
            label="Пароль"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', { required: 'Вкажіть пароль' })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>Увійти</Button>
      </form>
    </Paper>
  );
};