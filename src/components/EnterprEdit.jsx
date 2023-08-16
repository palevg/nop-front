import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate, isDateValid } from "../utils/checkers";
import { regionNames, taxState, riskState } from "../utils/data";
import { useForm } from 'react-hook-form';
import { Paper, TextField, InputAdornment, Button, MenuItem, Box, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import axios from '../axios';

export const EnterprEdit = (props) => {
  const navigate = useNavigate();
  const [valueDateCreate, setValueDateCreate] = useState(props.enterpr.DateCreate === null ? null : dayjs(props.enterpr.DateCreate));
  const [shevronUrl, setShevronUrl] = useState(props.enterpr.Shevron);
  const inputFileRef = React.useRef(null);

  const { register, handleSubmit, getValues, setValue, formState: { errors, isValid } } = useForm({
    defaultValues: {
      ident: props.enterpr.Ident,
      dateCreate: checkDate(props.enterpr.DateCreate, ''),
      keyName: props.enterpr.KeyName,
      fullName: props.enterpr.FullName,
      region: props.enterpr.Region,
      statutSize: props.enterpr.StatutSize,
      addressDeUre: props.enterpr.AddressDeUre,
      addressDeFacto: props.enterpr.AddressDeFacto,
      phones: props.enterpr.Phones,
      faxes: props.enterpr.Faxes,
      rosRah: props.enterpr.RosRah,
      rosUst: props.enterpr.RosUst,
      rosMFO: props.enterpr.RosMFO,
      afilEnterp: props.enterpr.AfilEnterp,
      podatok: props.enterpr.Podatok,
      stateRisk: props.enterpr.StateRisk,
      addInfo: props.enterpr.AddInfo,
      hideInfo: props.enterpr.HideInfo,
      shevron: props.enterpr.Shevron
    },
    mode: 'onChange'
  });

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      if (event.target.files[0].type.indexOf('image') > -1) {
        formData.append('image', event.target.files[0], new Date().getTime() + event.target.files[0].name.slice(event.target.files[0].name.lastIndexOf('.')));
        const { data } = await axios.post('/upload', formData);
        setShevronUrl(data.url);
      } else window.alert('Ви вибрали невірний тип файлу!');
    } catch (err) {
      console.warn(err);
      window.alert('Помилка при завантаженні файлу!');
    }
  };

  const setValuesToNull = (obj) => {
    if (obj.ident === '') obj.ident = null;
    if (props.enterpr.DateCreate === null && !isDateValid(obj.dateCreate)) obj.dateCreate = null;
    if (obj.keyName === '') obj.keyName = null;
    if (obj.fullName === '') obj.fullName = null;
    if (obj.region === '') obj.region = null;
    if (obj.statutSize === '') obj.statutSize = null;
    if (obj.addressDeUre === '') obj.addressDeUre = null;
    if (obj.addressDeFacto === '') obj.addressDeFacto = null;
    if (obj.phones === '') obj.phones = null;
    if (obj.faxes === '') obj.faxes = null;
    if (obj.rosRah === '') obj.rosRah = null;
    if (obj.rosUst === '') obj.rosUst = null;
    if (obj.rosMFO === '') obj.rosMFO = null;
    if (obj.afilEnterp === '') obj.afilEnterp = null;
    if (obj.addInfo === '') obj.addInfo = null;
    if (obj.hideInfo === '') obj.hideInfo = null;
  }

  const isDataChanged = (values) => {
    setValuesToNull(values);
    if (values.ident === props.enterpr.Ident && values.keyName === props.enterpr.KeyName && values.fullName === props.enterpr.FullName &&
      (checkDate(values.dateCreate, '') === checkDate(props.enterpr.DateCreate, '') || values.dateCreate === checkDate(props.enterpr.DateCreate, '')) &&
      values.region === props.enterpr.Region && values.statutSize === props.enterpr.StatutSize && values.addressDeUre === props.enterpr.AddressDeUre &&
      values.addressDeFacto === props.enterpr.AddressDeFacto && values.phones === props.enterpr.Phones && values.faxes === props.enterpr.Faxes &&
      values.rosRah === props.enterpr.RosRah && values.rosUst === props.enterpr.RosUst && values.rosMFO === props.enterpr.RosMFO &&
      values.afilEnterp === props.enterpr.AfilEnterp && values.addInfo === props.enterpr.AddInfo && values.hideInfo === props.enterpr.HideInfo &&
      values.podatok === props.enterpr.Podatok && values.stateRisk === props.enterpr.StateRisk && values.shevron === shevronUrl) return false
    else return true;
  }

  const checkIdent = async () => {
    const values = getValues();
    values.ident !== '' && await axios.get('/enterprs/with/' + values.ident)
      .then(res => {
        if (res.data.length) {
          if (window.confirm('Юридична особа із таким кодом ЄДРПОУ вже існує:\n' + res.data[0].FullName + ', код ' + res.data[0].Ident +
            ', адреса реєстрації: ' + res.data[0].AddressDeUre + '\nБажаєте перейти на сторінку з інформацією про цю юридичну особу?')) {
            navigate('/enterprs/' + res.data[0].Id);
          } else {
            setValue('ident', null);
          }
        }
      })
      .catch(err => {
        window.alert(err.response.data);
      });
  }

  const onSubmit = async (values) => {
    if (isDataChanged(values)) {
      values.editor = props.editor;
      if (values.shevron !== shevronUrl) values.shevron = shevronUrl;
      if (props.addNew) {
        await axios.post("/enterpr/new", values)
          .then(res => {
            window.alert(res.data.message);
            props.updateEditing(null);
            navigate('/enterprs/' + res.data.newId);
          })
          .catch(err => {
            window.alert(err.response.data);
          });
      } else {
        values.id = props.enterpr.Id;
        await axios.patch("/enterpr/edit", values)
          .then(res => {
            window.alert(res.data);
          })
          .catch(err => {
            window.alert(err.response.data);
          });
        props.updateEditing(null);
        await axios.get("/enterpr/" + props.enterpr.Id)
          .then(res => {
            props.updateInfo(res.data[0]);
          })
          .catch(err => {
            window.alert(err.response.data);
          });
      }
    } else {
      window.alert('Для інформації: ви не зробили жодних змін у даних про юридичну особу.');
      props.updateEditing(null);
    }
  };

  const handleCancelClick = () => {
    const values = getValues();
    isDataChanged(values)
      ? window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?') && props.updateEditing(null)
      : props.updateEditing(null)
  }

  return (<Paper classes={{ root: "fullPage" }} sx={{ m: 2, p: 2 }}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        sx={{ mb: 2 }}
        label="Повна назва юридичної особи"
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName', { required: "Обов'язкове поле" }
        )}
        size="small"
        fullWidth />
      <TextField
        sx={{ mb: 2, mr: 2, width: 240 }}
        label="Назва-ключ *"
        helperText="* для пошуку та сортування"
        {...register('keyName')}
        size="small"
      />
      <TextField
        sx={{ mb: 2, width: 240 }}
        select
        label="Регіон України"
        defaultValue={props.enterpr.Region}
        size="small"
        {...register('region')}
      >
        {regionNames.slice(1).map((option, index) => (
          <MenuItem key={index} value={++index}>{option}</MenuItem>
        ))}
      </TextField><br />
      <TextField
        sx={{ mb: 2, mr: 2, width: 160 }}
        label="Код за ЄДРПОУ"
        disabled={!props.addNew}
        error={Boolean(errors.ident?.message)}
        helperText={errors.ident?.message}
        {...register('ident', {
          onBlur: () => { props.addNew && checkIdent() },
          required: "Обов'язкове поле"
        })}
        autoFocus={props.addNew}
        size="small"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 160 }}
          label="Дата створення"
          value={valueDateCreate}
          onChange={(newValue) => setValueDateCreate(newValue)}
          {...register('dateCreate', {
            required: 'вкажіть дату у форматі ДД.ММ.РРРР',
            pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
          })}
          size="small"
        />
      </LocalizationProvider>
      <TextField
        sx={{ mb: 2, width: 200 }}
        label="Статутний фонд"
        error={Boolean(errors.statutSize?.message)}
        helperText={errors.statutSize?.message}
        InputProps={{
          endAdornment: <InputAdornment position="end">грн.</InputAdornment>
        }}
        {...register('statutSize', {
          required: "Обов'язкове поле",
          pattern: {
            value: /^(?:0\.\d?[1-9]|[1-9]\d*(.\d{1,2})?)$/,
            message: "Значення більше 0, два знаки після крапки (за необхідності)"
          }
        })}
        size="small"
      />
      <TextField
        sx={{ mb: 2 }}
        label="Адреса реєстрації"
        error={Boolean(errors.addressDeUre?.message)}
        helperText={errors.addressDeUre?.message}
        {...register('addressDeUre', { required: "Обов'язкове поле" })}
        size="small"
        fullWidth />
      <TextField
        sx={{ mb: 2 }}
        label="Фактична адреса"
        error={Boolean(errors.addressDeFacto?.message)}
        helperText={errors.addressDeFacto?.message}
        {...register('addressDeFacto', { required: "Обов'язкове поле" })}
        size="small"
        fullWidth />
      <TextField
        sx={{ mb: 2, mr: 2, width: 240 }}
        label="Телефон"
        {...register('phones')}
        size="small"
      />
      <TextField
        sx={{ mb: 2, width: 240 }}
        label="Факс"
        {...register('faxes')}
        size="small"
      /><br />
      <TextField
        sx={{ mb: 2, mr: 2, width: 240 }}
        label="Розрахунковий рахунок або IBAN"
        {...register('rosRah')}
        size="small"
      />
      <TextField
        sx={{ mb: 2, width: 100 }}
        label="МФО"
        {...register('rosMFO')}
        size="small"
      />
      <TextField
        sx={{ mb: 2 }}
        label="Кредитна установа"
        {...register('rosUst')}
        size="small"
        fullWidth />
      <TextField
        sx={{ mb: 2, mr: 2, width: 200 }}
        select
        label="Система оподаткування"
        defaultValue={props.enterpr.Podatok}
        size="small"
        {...register('podatok')}
      >
        {taxState.map((option, index) => (
          <MenuItem key={index} value={index}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        sx={{ mb: 2, width: 160 }}
        select
        label="Ступінь ризику"
        defaultValue={props.enterpr.StateRisk}
        size="small"
        {...register('stateRisk')}
      >
        {riskState.map((option, index) => (
          <MenuItem key={index} value={index}>{option}</MenuItem>
        ))}
      </TextField><br />
      <TextField
        sx={{ mb: 2 }}
        label="Додаткова інформація"
        multiline
        rows={3}
        {...register('addInfo')}
        size="small"
        fullWidth />
      <Box>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Зображення шеврона або знаку належності
        </Typography>
        <div className="person-foto__edit">
          <img className="fullPage__person-foto"
            src={shevronUrl ? `${process.env.REACT_APP_API_URL}/uploads/${shevronUrl}` : `${process.env.REACT_APP_API_URL}/uploads/no_foto.jpg`} alt="Шеврон" />
          <div>
            <input ref={inputFileRef} accept="image/*" type="file" onChange={handleChangeFile} hidden />
            <Button onClick={() => inputFileRef.current.click()} type="button" size="large" variant="contained" sx={{ mb: 2, width: 190, display: 'block' }}>Завантажити фото</Button>
            {shevronUrl && <Button onClick={() => setShevronUrl(null)} type="button" size="large" variant="contained" sx={{ width: 190 }}>Видалити фото</Button>}
          </div>
        </div>
      </Box>
      <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Зберегти</Button>
      <Button onClick={handleCancelClick} type="button" size="large" variant="outlined">Скасувати</Button>
    </form>
  </Paper>)
}