import { useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate, isDateValid } from "../utils/checkers";
import { licenseTypes, licenseStates } from "../utils/data";
import { useForm } from 'react-hook-form';
import { Paper, TextField, MenuItem, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toast } from 'react-toastify';
import axios from '../axios';

export const LicenseEdit = (props) => {
  const [endless, setEndless] = useState(checkDate(props.license.DateClose, '') === '22.02.2222' ? 1 : 0);
  const [valueDateStartLic, setValueDateStartLic] = useState(dayjs(props.license.DateLicenz));
  const [valueDateCloseLic, setValueDateCloseLic] = useState(dayjs(props.license.DateClose));
  const [valueStateLic, setValueStateLic] = useState(props.license.State);

  const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      typeLicenze: props.license.TypeLicenze,
      serLicenze: props.license.SerLicenze,
      numLicenze: props.license.NumLicenze,
      dateLicenz: checkDate(props.license.DateLicenz, ''),
      dateClose: checkDate(props.license.DateClose, ''),
      reasonStart: props.license.ReasonStart,
      reasonClose: props.license.ReasonClose
    },
    mode: 'onChange'
  });

  const setValuesToNull = (obj) => {
    if (obj.serLicenze === '') obj.serLicenze = null;
    if (obj.numLicenze === '') obj.numLicenze = null;
    if (props.license.DateLicenz === null && !isDateValid(obj.dateLicenz)) obj.dateLicenz = null;
    if (props.license.DateClose === null && !isDateValid(obj.dateClose)) obj.dateClose = null;
    if (obj.reasonStart === '') obj.reasonStart = null;
    if (obj.reasonClose === '') obj.reasonClose = null;
  }

  const isDataChanged = (values) => {
    setValuesToNull(values);
    if (values.typeLicenze === props.license.TypeLicenze && values.serLicenze === props.license.SerLicenze &&
      values.numLicenze === props.license.NumLicenze && valueStateLic === props.license.State &&
      (checkDate(values.dateLicenz, '') === checkDate(props.license.DateLicenz, '') || values.dateLicenz === checkDate(props.license.DateLicenz, '')) &&
      (checkDate(values.dateClose, '') === checkDate(props.license.DateClose, '') || values.dateClose === checkDate(props.license.DateClose, '')) &&
      values.reasonStart === props.license.ReasonStart && values.reasonClose === props.license.ReasonClose) return false
    else return true;
  }

  const onSubmit = async (values) => {
    if (endless === 1 && checkDate(values.dateClose, '') !== '22.02.2222') values.dateClose = '22.02.2222';
    if (isDataChanged(values)) {
      values.editor = props.editor;
      values.id = props.license.Id;
      values.state = valueStateLic;
      await axios.patch("/license/edit", values)
        .then(res => {
          toast.success(res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
      await axios.get("/licenses/" + props.license.EnterpriseId)
        .then(res => {
          props.updateList(res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
    } else {
      toast.warn("Для інформації: ви не зробили жодних змін у даних про ліцензію.");
    }
    props.setEditLicense(null);
    props.setEditMode(null);
  }

  const handleCancelClick = () => {
    const values = getValues();
    if (endless === 1 && checkDate(values.dateClose, '') !== '22.02.2222') values.dateClose = '22.02.2222';
    if (isDataChanged(values)) {
      if (window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?')) {
        props.setEditLicense(null);
        props.setEditMode(null);
      }
    } else {
      props.setEditLicense(null);
      props.setEditMode(null);
    }
  }

  return (<Paper elevation={3} sx={{ maxWidth: "100%", p: 2, ml: "auto", mr: "auto" }}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        select
        label="Вид діяльності, що ліцензується"
        defaultValue={props.license.TypeLicenze}
        {...register('typeLicenze', { required: "Обов'язкове поле" })}
        size="small"
      >
        {licenseTypes.map(licType =>
          <MenuItem key={licType.Id} value={licType.Id}>{licType.LicName}</MenuItem>
        )}
      </TextField>
      <TextField
        sx={{ mb: 2, mr: 2, width: 80 }}
        label="Серія"
        {...register('serLicenze')}
        size="small"
      />
      <TextField
        sx={{ mb: 2, mr: 2, width: 130 }}
        label="№ ліцензії"
        error={Boolean(errors.numLicenze?.message)}
        helperText={errors.numLicenze?.message}
        {...register('numLicenze', { required: "Обов'язкове поле" })}
        size="small"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 120 }}
          label="Дата видачі"
          value={valueDateStartLic}
          onChange={(newValue) => setValueDateStartLic(newValue)}
          {...register('dateLicenz', {
            required: 'вкажіть дату у форматі ДД.ММ.РРРР',
            pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
          })}
          size="small"
        />
      </LocalizationProvider>
      <TextField
        sx={{ mb: 2, mr: 2, width: 150 }}
        select
        label="Ліцензія діє"
        value={endless}
        onChange={(event) => setEndless(event.target.value)}
        size="small"
      >
        <MenuItem value={0}>по дату</MenuItem>
        <MenuItem value={1}>безтерміново</MenuItem>
      </TextField>
      {endless === 0 && <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 120 }}
          label="закінчення дії"
          value={valueDateCloseLic}
          onChange={(newValue) => setValueDateCloseLic(newValue)}
          {...register('dateClose', {
            required: 'вкажіть дату у форматі ДД.ММ.РРРР',
            pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
          })}
          size="small"
        />
      </LocalizationProvider>
      }
      <TextField
        sx={{ mb: 2, width: 150 }}
        select
        label="Стан ліцензії"
        size="small"
        value={valueStateLic}
        onChange={(event) => setValueStateLic(event.target.value)}
      >
        {licenseStates.map((licState, index) =>
          <MenuItem key={index} value={index}>{licState}</MenuItem>
        )}
      </TextField>
      <TextField
        sx={{ mb: 2 }}
        label="Підстава видачі"
        {...register('reasonStart')}
        size="small"
        fullWidth />
      {valueStateLic !== 0 && <TextField
        sx={{ mb: 2 }}
        label="Підстава передчасного припинення дії"
        {...register('reasonClose')}
        size="small"
        fullWidth />}
      <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2, mt: 1 }}>Зберегти</Button>
      <Button onClick={handleCancelClick} type="button" size="large" variant="outlined" sx={{ mt: 1 }}>Скасувати</Button>
    </form>
  </Paper>)
}