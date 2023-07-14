import React, { useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate } from "../utils/checkers";
import { useForm } from 'react-hook-form';
import { Paper, TextField, Button } from "@mui/material";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import axios from '../axios';

const filter = createFilterOptions();

export const PersonEdit = (props) => {
  const [valueBirth, setValueBirth] = useState(dayjs(props.person.Birth));
  const [valuePasp, setValuePasp] = useState(dayjs(props.person.PaspDate));
  const [dateEnter, setDateEnter] = useState(dayjs(props.person.DateEnter));
  const [dateStartWork, setDateStartWork] = useState(dayjs(props.person.DateStartWork));
  const [posada, setPosada] = useState(props.person.Posada);
  const [fotoUrl, setFotoUrl] = useState(props.person.PhotoFile);
  const inputFileRef = React.useRef(null);

  const workPlacesList = [{ name: 'Генеральний директор' }, { name: 'Голова правління' }, { name: 'Директор' },
  { name: 'Виконавчий директор' }, { name: 'Заступник генер. директора' }, { name: 'Заступник директора' },
  { name: 'Заст.директора з охорон. діяльності' }, { name: 'Фахівець з організації охорони' },
  { name: 'Головний спеціаліст' }, { name: 'Головний бухгалтер' }, { name: 'Бухгалтер' }, { name: 'Підприємець' }];

  const { register, handleSubmit, getValues, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: props.person.Name,
      indnum: props.person.Indnum,
      birthDate: checkDate(props.person.Birth, ''),
      birthPlace: props.person.BirthPlace,
      livePlace: props.person.LivePlace,
      pasport: props.person.Pasport,
      paspDate: checkDate(props.person.PaspDate, ''),
      paspPlace: props.person.PaspPlace,
      osvita: props.person.Osvita,
      foto: props.person.PhotoFile,
      statutPart: props.person.StatutPart,
      dateEnter: checkDate(props.person.DateEnter, ''),
      posada: props.person.Posada,
      dateStartWork: checkDate(props.person.DateStartWork, '')
    },
    mode: 'onChange'
  });

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      if (event.target.files[0].type.indexOf('image') > -1) {
        formData.append('image', event.target.files[0], new Date().getTime() + event.target.files[0].name.slice(event.target.files[0].name.lastIndexOf('.')));
        const { data } = await axios.post('/upload', formData);
        setFotoUrl(data.url);
      } else alert('Ви вибрали невірний тип файлу!');
    } catch (err) {
      console.warn(err);
      alert('Помилка при завантаженні файлу!');
    }
  };

  const isDataChanged = () => {
    const values = getValues();
    if (posada !== undefined && posada.name !== undefined) values.posada = posada.name;
    if (values.osvita === '') values.osvita = null;
    let dataNotChanged = false;
    if ((checkDate(values.dateEnter, '') === checkDate(props.person.DateEnter, '') || values.dateEnter === checkDate(props.person.DateEnter, '')) &&
      values.statutPart === props.person.StatutPart && props.personType === 1) dataNotChanged = true;
    if ((checkDate(values.dateStartWork, '') === checkDate(props.person.DateStartWork, '') || values.dateStartWork === checkDate(props.person.DateStartWork, '')) &&
      values.posada === props.person.Posada && props.personType === 2) dataNotChanged = true;
    if (dataNotChanged && values.fullName === props.person.Name && values.indnum === props.person.Indnum &&
      (checkDate(values.birthDate, '') === checkDate(props.person.Birth, '') || values.birthDate === checkDate(props.person.Birth, '')) &&
      values.birthPlace === props.person.BirthPlace && values.livePlace === props.person.LivePlace && values.pasport === props.person.Pasport &&
      (checkDate(values.paspDate, '') === checkDate(props.person.PaspDate, '') || values.paspDate === checkDate(props.person.PaspDate, '')) &&
      values.paspPlace === props.person.PaspPlace && values.osvita === props.person.Osvita && values.foto === fotoUrl)
      return false
    else return true;
  }

  const onSubmit = async (values) => {
    if (props.isNewPerson) {
      alert('Save new person!');
      props.updateEditing(null);
    } else
      if (isDataChanged()) {
        values.id = props.person.Id;
        values.humanId = props.person.HumanId;
        values.editor = props.editor.Id;
        if (values.foto !== fotoUrl) values.foto = fotoUrl;

        let linkToPatch;
        if (props.personType === 1) linkToPatch = "/peoples/founder";
        if (props.personType === 2) {
          linkToPatch = "/peoples/head";
          if (posada.name !== undefined && values.posada !== posada.name) values.posada = posada.name;
        }
        await axios.patch(linkToPatch, values)
          .then(res => {
            alert(res.data);
          })
          .catch(err => {
            alert(err.response.data);
          });
        props.updateEditing(null);
      } else {
        window.alert('Для інформації: ви не зробили жодних змін у даних про особу.');
        props.updateEditing(null);
      }
  };

  const handleCancelClick = () => {
    isDataChanged()
      ? window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?') && props.updateEditing(null)
      : props.updateEditing(null)
  }

  return (<Paper classes={{ root: "profile_root" }}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="person-foto__edit">
        <img className="fullPage__person-foto"
          src={fotoUrl ? `${process.env.REACT_APP_API_URL}/uploads/${fotoUrl}` : `${process.env.REACT_APP_API_URL}/uploads/no_foto.jpg`} alt="Фото особи" />
        <div>
          <input ref={inputFileRef} accept="image/*" type="file" onChange={handleChangeFile} hidden />
          <Button onClick={() => inputFileRef.current.click()} type="button" size="large" variant="contained" sx={{ mb: 2, width: 190, display: 'block' }}>Завантажити фото</Button>
          {fotoUrl && <Button onClick={() => setFotoUrl(null)} type="button" size="large" variant="contained" sx={{ width: 190 }}>Видалити фото</Button>}
        </div>
      </div>
      {props.personType === 1 && <div className="person-posada__edit">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DateField
            sx={{ width: 160 }}
            label="У складі засновників з"
            value={dateEnter}
            onChange={(newValue) => setDateEnter(newValue)}
            {...register('dateEnter')}
            size="small"
          />
        </LocalizationProvider>
        <TextField
          sx={{ mb: 2, width: 180 }}
          label="% у Статутному капіталі"
          error={Boolean(errors.statutPart?.message)}
          helperText={errors.statutPart?.message}
          {...register('statutPart', {
            pattern: {
              value: /^(?:100(?:\.0*)?|[1-9]?\d(?:\.\d*)?|\.\d+)$/,
              message: "Значення від 0 до 100"
            }
          })}
          size="small"
        />
      </div>}
      {props.personType === 2 && <div className="person-posada__edit">
        <Autocomplete
          sx={{ width: '100%' }}
          freeSolo
          value={posada}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') setPosada({ name: newValue })
            else if (newValue && newValue.inputValue) setPosada({ name: newValue.inputValue })
            else setPosada(newValue);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some((option) => inputValue === option.name);
            if (inputValue !== '' && !isExisting)
              filtered.push({ inputValue, name: `Додати "${inputValue}"` });
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={workPlacesList}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            if (option.inputValue) return option.inputValue;
            return option.name;
          }}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          renderInput={(params) => <TextField {...params} label="Посада" />}
          size="small"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DateField
            sx={{ width: 160 }}
            label="На посаді з"
            value={dateStartWork}
            onChange={(newValue) => setDateStartWork(newValue)}
            {...register('dateStartWork')}
            size="small"
          />
        </LocalizationProvider>
      </div>}
      <TextField
        sx={{ mb: 2 }}
        label="Прізвище, ім'я та по-батькові"
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName', {
          pattern: {
            value: /^[А-їІЇЄ'\s\-]{8,50}$/,
            message: "Лише букви кирилиці, апостроф та дефіс (мінімум 8 символів)"
          }
        }
        )}
        size="small"
        fullWidth />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 160 }}
          label="Дата народження"
          value={valueBirth}
          onChange={(newValue) => setValueBirth(newValue)}
          {...register('birthDate', { required: 'Вкажіть дату' })}
          size="small"
        />
      </LocalizationProvider>
      <TextField
        sx={{ mb: 2, width: 160 }}
        label="Ідентифікаційний код"
        error={Boolean(errors.indnum?.message)}
        helperText={errors.indnum?.message}
        {...register('indnum', {
          pattern: {
            value: /^[\d]{0,10}$/,
            message: "10 цифр максимум"
          }
        })}
        size="small"
      />
      <TextField
        sx={{ mb: 2 }}
        label="Місце народження"
        {...register('birthPlace', { required: 'Вкажіть місце народження' })}
        size="small"
        fullWidth />
      <TextField
        sx={{ mb: 2 }}
        label="Місце проживання"
        {...register('livePlace', { required: 'Вкажіть місце проживання' })}
        size="small"
        fullWidth />
      <TextField
        sx={{ mb: 2, mr: 2, width: 160 }}
        label="Паспорт: серія і №"
        {...register('pasport', { required: 'Вкажіть серію і № паспорта' })}
        size="small"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, width: 160 }}
          label="дата видачі"
          value={valuePasp}
          onChange={(newValue) => setValuePasp(newValue)}
          {...register('paspDate', { required: 'Вкажіть дату' })}
          size="small"
        />
      </LocalizationProvider>
      <TextField
        sx={{ mb: 2 }}
        label="яким органом видано"
        {...register('paspPlace', { required: 'Вкажіть орган видачі паспорта' })}
        size="small"
        fullWidth />
      <TextField
        sx={{ mb: 2 }}
        label="Освіта та/або служба"
        multiline
        rows={2}
        {...register('osvita')}
        size="small"
        fullWidth />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Зберегти</Button>
      <Button onClick={handleCancelClick} type="button" size="large" variant="outlined">Скасувати</Button>
    </form>
  </Paper>)
}