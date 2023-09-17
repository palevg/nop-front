import { useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate, isDateValid } from "../utils/checkers";
import { orderType, orderCategory } from "../utils/data";
import { useForm } from 'react-hook-form';
import { Paper, TextField, MenuItem, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toast } from 'react-toastify';
import axios from '../axios';

export const OrderEdit = (props) => {
  const [valueDateZajav, setValueDateZajav] = useState(dayjs(props.order.DateZajav));

  const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      numZajav: props.order.NumZajav,
      dateZajav: checkDate(props.order.DateZajav, ''),
      orderType: props.order.OrderType,
      category: props.order.Category,
      humanId: props.order.HumanId,
      options: props.order.Options
    },
    mode: 'onChange'
  });

  const setValuesToNull = (obj) => {
    if (obj.numZajav === '') obj.numZajav = null;
    if (props.order.DateZajav === null && !isDateValid(obj.dateZajav)) obj.dateZajav = null;
    if (obj.options === '') obj.options = null;
  }

  const isDataChanged = (values) => {
    setValuesToNull(values);
    if (values.orderType === props.order.OrderType && values.category === props.order.Category && values.numZajav === props.order.NumZajav &&
      (checkDate(values.dateZajav, '') === checkDate(props.order.DateZajav, '') || values.dateZajav === checkDate(props.order.DateZajav, '')) &&
      values.humanId === props.order.HumanId && values.options === props.order.Options) return false
    else return true;
  }

  const onSubmit = async (values) => {
    if (values.humanId === 0) values.humanId = props.heads[0].HumanId;
    if (isDataChanged(values)) {
      values.editor = props.editor;
      values.id = props.order.Id;
      await axios.patch("/order/edit", values)
        .then(res => {
          toast.success(res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
      await axios.get("/orders/" + props.order.EnterpriseId)
        .then(res => {
          props.updateList(res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
    } else {
      toast.warn("Для інформації: ви не зробили жодних змін у даних про заяву.");
    }
    props.updateEditing(null);
  }

  const handleCancelClick = () => {
    const values = getValues();
    isDataChanged(values)
      ? window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?') && props.updateEditing(null)
      : props.updateEditing(null)
  }

  return (<Paper elevation={3} sx={{ maxWidth: 880, p: 3, ml: "auto", mr: "auto", mb: 3 }}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        sx={{ mb: 2, mr: 2, minWidth: 160, maxWidth: "100%" }}
        select
        label="Заява щодо"
        defaultValue={props.order.OrderType}
        size="small"
        {...register('orderType', { required: "Обов'язкове поле" })}
      >
        {orderType.map((option, index) => (
          <MenuItem key={index} value={index}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        sx={{ mb: 2, mr: 2, width: 80 }}
        select
        label="категорії"
        defaultValue={props.order.Category}
        size="small"
        {...register('category', { required: "Обов'язкове поле" })}
      >
        {orderCategory.map((option, index) => (
          <MenuItem key={index} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 120 }}
          label="Дата заяви"
          value={valueDateZajav}
          onChange={(newValue) => setValueDateZajav(newValue)}
          {...register('dateZajav', {
            required: 'вкажіть дату у форматі ДД.ММ.РРРР',
            pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
          })}
          size="small"
        />
      </LocalizationProvider>
      <TextField
        sx={{ mb: 2, width: 140 }}
        label="Реєстраційний №"
        error={Boolean(errors.numZajav?.message)}
        helperText={errors.numZajav?.message}
        {...register('numZajav', { required: "Обов'язкове поле" }
        )}
        size="small"
      /><br />
      <TextField
        sx={{ mb: 2, minWidth: 160, maxWidth: "100%" }}
        select
        label="Подавач"
        defaultValue={props.order.HumanId === 0 ? props.heads[0].HumanId : props.order.HumanId}
        size="small"
        {...register('humanId', { required: "Обов'язкове поле" })}
      >
        {props.heads.map((option, index) => (
          <MenuItem key={index} value={option.HumanId}>{option.Name}</MenuItem>
        ))}
      </TextField>
      <TextField
        sx={{ mb: 2 }}
        label="Додаткові дані"
        {...register('options')}
        size="small"
        fullWidth />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2, mb: 2 }}>Зберегти</Button>
      <Button onClick={handleCancelClick} type="button" size="large" variant="outlined" sx={{ mb: 2 }}>Скасувати</Button>
    </form>
  </Paper>)
}