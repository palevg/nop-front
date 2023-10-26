import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate, isDateValid } from "../utils/checkers";
import { orderTypes, orderCategories } from "../utils/data";
import { useForm } from 'react-hook-form';
import { Paper, TextField, MenuItem, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toast } from 'react-toastify';
import axios from '../axios';

export default function OrderEdit(props) {
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
      let linkToPatch = "/order/";
      if (props.isNewOrder) {
        values.enterprId = props.order.EnterpriseId;
        linkToPatch += "new";
      }
      else {
        values.id = props.order.Id;
        linkToPatch += "edit";
      }
      await axios.patch(linkToPatch, values)
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
    props.setEditOrder(null);
    props.setEditMode(null);
  }

  const handleCancelClick = () => {
    const values = getValues();
    if (isDataChanged(values)) {
      if (window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?')) {
        props.setEditOrder(null);
        props.setEditMode(null);
      }
    } else {
      props.setEditOrder(null);
      props.setEditMode(null);
    }
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
        {orderTypes.map((orderType, index) =>
          <MenuItem key={index} value={index}>{orderType}</MenuItem>
        )}
      </TextField>
      <TextField
        sx={{ mb: 2, mr: 2, width: 80 }}
        select
        label="категорії"
        defaultValue={props.order.Category}
        size="small"
        {...register('category', { required: "Обов'язкове поле" })}
      >
        {orderCategories.map((orderCategory, index) =>
          <MenuItem key={index} value={orderCategory}>{orderCategory}</MenuItem>
        )}
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 120 }}
          label="Дата заяви"
          defaultValue={dayjs(props.order.DateZajav)}
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
        {props.heads.map(person =>
          <MenuItem key={person.Id} value={person.HumanId}>{person.Name}</MenuItem>
        )}
      </TextField>
      <TextField
        sx={{ mb: 2 }}
        label="Додаткові дані"
        {...register('options')}
        size="small"
        fullWidth />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Зберегти</Button>
      <Button onClick={handleCancelClick} type="button" size="large" variant="outlined">Скасувати</Button>
    </form>
  </Paper>)
}