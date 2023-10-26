import { useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate, isDateValid } from "../utils/checkers";
import { checkTypes, pointsLicUmOldText, pointsLicUm365Text } from "../utils/data";
import { useForm } from 'react-hook-form';
import { Paper, TextField, MenuItem, Typography, FormControlLabel, Switch, FormControl, InputLabel, Select, OutlinedInput, ListItemText, Checkbox, Box, Divider, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toast } from 'react-toastify';
import axios from '../axios';

const ITEM_HEIGHT = 46;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CheckEdit(props) {
  const [versionLicUm, setVersionLicUm] = useState(props.check.LicUmov);
  const [pointsLicUmText, setPointsLicUmText] = useState(props.check.LicUmov === 0 ? pointsLicUmOldText : pointsLicUm365Text);
  const [valueNoViolations, setValueNoViolations] = useState(props.check.NoViolations);

  const pointsLicUmOldOrder = [props.check.P211, props.check.P212, props.check.P213, props.check.P214, props.check.P215,
  props.check.P221, props.check.P222, props.check.P223, props.check.P224, props.check.P225, props.check.P226,
  props.check.P31, props.check.P32, props.check.P33, props.check.P34, props.check.P35, props.check.P44,
  props.check.P451, props.check.P452, props.check.P453, props.check.P456, props.check.P461, props.check.P462,
  props.check.P463, props.check.P464, props.check.P471, props.check.P472, props.check.P473, props.check.P474,
  props.check.P475, props.check.P476, props.check.P477, props.check.P478];

  const pointsLicUm365Order = [props.check.P211, props.check.P212, props.check.P213, props.check.P214,
  props.check.P221, props.check.P222, props.check.P223, props.check.P215, props.check.P224, props.check.P225,
  props.check.P226, props.check.P452, props.check.P453, props.check.P456, props.check.P461, props.check.P462,
  props.check.P463, props.check.P31, props.check.P32, props.check.P33, props.check.P34, props.check.P35,
  props.check.P44, props.check.P451, props.check.P464, props.check.P471, props.check.P472, props.check.P473,
  props.check.P474, props.check.P475, props.check.P476, props.check.P477, props.check.P478, props.check.N429,
  props.check.N4210, props.check.N4211, props.check.N4212, props.check.N4213, props.check.N4214, props.check.N4215,
  props.check.N4216, props.check.N4217];

  const pointsLicUmOldValues = ["p211", "p212", "p213", "p214", "p215", "p221", "p222", "p223", "p224", "p225",
    "p226", "p31", "p32", "p33", "p34", "p35", "p44", "p451", "p452", "p453", "p456", "p461", "p462", "p463", "p464",
    "p471", "p472", "p473", "p474", "p475", "p476", "p477", "p478"];

  const pointsLicUm365Values = ["p211", "p212", "p213", "p214", "p221", "p222", "p223", "p215", "p224", "p225",
    "p226", "p452", "p453", "p456", "p461", "p462", "p463", "p31", "p32", "p33", "p34", "p35", "p44", "p451",
    "p464", "p471", "p472", "p473", "p474", "p475", "p476", "p477", "p478", "n429", "n4210", "n4211", "n4212",
    "n4213", "n4214", "n4215", "n4216", "n4217"];

  const pointsLicUmOld = pointsLicUmOldText.map((item, index) => {
    const newItem = {}
    newItem.value = pointsLicUmOldValues[index]
    newItem.text = item
    return newItem
  });

  const pointsLicUm365 = pointsLicUm365Text.map((item, index) => {
    const newItem = {}
    newItem.value = pointsLicUm365Values[index]
    newItem.text = item
    return newItem
  });

  const verifyPointsLicUmov = () => {
    const pointsList = [];
    props.check.LicUmov === 0
      ? pointsLicUmOldOrder.forEach((point, index) => { point && pointsList.push(pointsLicUmOldText[index]) })
      : pointsLicUm365Order.forEach((point, index) => { point && pointsList.push(pointsLicUm365Text[index]) })
    return pointsList;
  }

  const [checkedPointsLicUm, setCheckedPointsLicUm] = useState(verifyPointsLicUmov);

  const handlePointsChange = (event) => {
    const { target: { value } } = event;
    setCheckedPointsLicUm(typeof value === 'string' ? value.split(',') : value);
  };

  const { register, getValues, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      checkSertifDate: checkDate(props.check.CheckSertificateDate, ''),
      checkSertifNo: props.check.CheckSertificateNo,
      checkType: props.check.CheckType,
      checkDateStart: checkDate(props.check.StartCheckDate, ''),
      checkDateEnd: checkDate(props.check.EndCheckDate, ''),
      checkActNo: props.check.CheckActNo,
      checker: props.check.Checker,
      checkObjCount: props.check.CheckObjCount,
      content: props.check.Content,
      checkRozporDate: checkDate(props.check.CheckRozporDate, ''),
      checkRozporNo: props.check.CheckRozporNo,
      checkRozporDateAnswer: checkDate(props.check.CheckRozporDateAnswer, '')
    },
    mode: 'onChange'
  });

  const convertPoints = (values) => {
    const pointsLicUmov = versionLicUm === 0 ? pointsLicUmOld : pointsLicUm365;
    checkedPointsLicUm.length > 0
      ? pointsLicUmov.forEach(point =>
        checkedPointsLicUm.indexOf(point.text) === -1 ? values[point.value] = 0 : values[point.value] = 1
      )
      : pointsLicUmov.forEach(point => values[point.value] = 0)
    if (values.licUmov === 0) {
      values.n429 = 0;
      values.n4210 = 0;
      values.n4211 = 0;
      values.n4212 = 0;
      values.n4213 = 0;
      values.n4214 = 0;
      values.n4215 = 0;
      values.n4216 = 0;
      values.n4217 = 0;
    }
  }

  const setValuesToNull = (obj) => {
    if (props.check.CheckSertificateDate === null && !isDateValid(obj.checkSertifDate)) obj.checkSertifDate = null;
    if (obj.checkSertifNo === '') obj.checkSertifNo = null;
    if (props.check.StartCheckDate === null && !isDateValid(obj.checkDateStart)) obj.checkDateStart = null;
    if (props.check.EndCheckDate === null && !isDateValid(obj.checkDateEnd)) obj.checkDateEnd = null;
    if (obj.checkActNo === '') obj.checkActNo = null;
    if (obj.checker === '') obj.checker = null;
    if (obj.checkObjCount === '') obj.checkObjCount = null;
    if (obj.content === '') obj.content = null;
    if (props.check.CheckRozporDate === null && !isDateValid(obj.checkRozporDate)) obj.checkRozporDate = null;
    if (obj.checkRozporNo === '') obj.checkRozporNo = null;
    if (props.check.CheckRozporDateAnswer === null && !isDateValid(obj.checkRozporDateAnswer)) obj.checkRozporDateAnswer = null;
  }

  const isDataChanged = (values) => {
    setValuesToNull(values);
    if (values.checkSertifNo !== null && typeof (values.checkSertifNo) !== "number") values.checkSertifNo = Number(values.checkSertifNo);
    if (typeof (values.checkObjCount) !== "number") values.checkObjCount = Number(values.checkObjCount);
    values.licUmov = versionLicUm;
    values.noViolations = valueNoViolations ? 1 : 0;
    convertPoints(values);
    if (values.checkSertifNo === props.check.CheckSertificateNo && values.checkType === props.check.CheckType &&
      (checkDate(values.checkSertifDate, '') === checkDate(props.check.CheckSertificateDate, '') || values.checkSertifDate === checkDate(props.check.CheckSertificateDate, '')) &&
      (checkDate(values.checkDateStart, '') === checkDate(props.check.StartCheckDate, '') || values.checkDateStart === checkDate(props.check.StartCheckDate, '')) &&
      (checkDate(values.checkDateEnd, '') === checkDate(props.check.EndCheckDate, '') || values.checkDateEnd === checkDate(props.check.EndCheckDate, '')) &&
      values.checkActNo === props.check.CheckActNo && values.checkRozporNo === props.check.CheckRozporNo &&
      values.checkObjCount === props.check.CheckObjCount && values.noViolations === props.check.NoViolations &&
      values.licUmov === props.check.LicUmov && values.content === props.check.Content && values.checker === props.check.Checker &&
      (checkDate(values.checkRozporDate, '') === checkDate(props.check.CheckRozporDate, '') || values.checkRozporDate === checkDate(props.check.CheckRozporDate, '')) &&
      (checkDate(values.checkRozporDateAnswer, '') === checkDate(props.check.CheckRozporDateAnswer, '') || values.checkRozporDateAnswer === checkDate(props.check.CheckRozporDateAnswer, '')) &&
      values.p211 === props.check.P211 && values.p212 === props.check.P212 && values.p213 === props.check.P213 &&
      values.p214 === props.check.P214 && values.p215 === props.check.P215 && values.p221 === props.check.P221 &&
      values.p222 === props.check.P222 && values.p223 === props.check.P223 && values.p224 === props.check.P224 &&
      values.p225 === props.check.P225 && values.p226 === props.check.P226 && values.p31 === props.check.P31 &&
      values.p32 === props.check.P32 && values.p33 === props.check.P33 && values.p34 === props.check.P34 &&
      values.p35 === props.check.P35 && values.p44 === props.check.P44 && values.p451 === props.check.P451 &&
      values.p452 === props.check.P452 && values.p453 === props.check.P453 && values.p456 === props.check.P456 &&
      values.p461 === props.check.P461 && values.p462 === props.check.P462 && values.p463 === props.check.P463 &&
      values.p464 === props.check.P464 && values.p471 === props.check.P471 && values.p472 === props.check.P472 &&
      values.p473 === props.check.P473 && values.p474 === props.check.P474 && values.p475 === props.check.P475 &&
      values.p476 === props.check.P476 && values.p477 === props.check.P477 && values.p478 === props.check.P478) {
      if (versionLicUm === 0) return false
      else {
        if (values.n429 === props.check.N429 && values.n4210 === props.check.N4210 && values.n4211 === props.check.N4211 &&
          values.n4212 === props.check.N4212 && values.n4213 === props.check.N4213 && values.n4214 === props.check.N4214 &&
          values.n4215 === props.check.N4215 && values.n4216 === props.check.N4216 && values.n4217 === props.check.N4217) return false
        else return true
      }
    } else return true
  }

  const onSubmit = async (values) => {
    if (isDataChanged(values)) {
      values.editor = props.editor;
      let linkToPatch = "/check/";
      if (props.isNewCheck) {
        values.enterprId = props.check.EnterpriseID;
        linkToPatch += "new";
      }
      else {
        values.id = props.check.Id;
        linkToPatch += "edit";
      }
      await axios.patch(linkToPatch, values)
        .then(res => {
          toast.success(res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
      await axios.get("/checks/" + props.check.EnterpriseID)
        .then(res => {
          props.updateList(res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
    } else {
      toast.warn("Для інформації: ви не зробили жодних змін у даних про ліцензію.");
    }
    props.setEditCheck(null);
    props.setEditMode(null);
  }

  const handleChangeLicUm = (value) => {
    value === 0 ? setPointsLicUmText(pointsLicUmOldText) : setPointsLicUmText(pointsLicUm365Text)
    setVersionLicUm(value)
    setCheckedPointsLicUm([])
  }

  const handleChangeNoViolations = (value) => {
    setValueNoViolations(value)
    if (value) setCheckedPointsLicUm([])
  }

  const handleCancelClick = () => {
    const values = getValues();
    if (isDataChanged(values)) {
      if (window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?')) {
        props.setEditCheck(null);
        props.setEditMode(null);
      }
    } else {
      props.setEditCheck(null);
      props.setEditMode(null);
    }
  }

  return (<Paper elevation={3} sx={{ maxWidth: "100%", p: 2, ml: "auto", mr: "auto" }}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="subtitle1" gutterBottom>Посвідчення на перевірку:</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 120 }}
          label="дата"
          defaultValue={dayjs(props.check.CheckSertificateDate)}
          {...register('checkSertifDate', {
            required: 'вкажіть дату у форматі ДД.ММ.РРРР',
            pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
          })}
          size="small"
        />
      </LocalizationProvider>
      <TextField
        sx={{ mb: 2, mr: 4, width: 80 }}
        label="номер"
        error={Boolean(errors.checkSertifNo?.message)}
        helperText={errors.checkSertifNo?.message}
        {...register('checkSertifNo', {
          required: "Обов'язкове поле",
          pattern: {
            value: /^[1-9]\d{0,4}$/,
            message: "від 1 до 99999"
          }
        })}
        size="small"
      />
      <TextField
        sx={{ mb: 2, mr: 2, maxWidth: "100%" }}
        select
        label="Тип перевірки"
        defaultValue={props.check.CheckType}
        {...register('checkType')}
        size="small"
      >
        {checkTypes.map((checkType, index) =>
          <MenuItem key={index} value={index}>{checkType}</MenuItem>
        )}
      </TextField>
      <TextField
        sx={{ mb: 2, width: 252 }}
        select
        label="по дотриманню вимог Ліцензійних умов"
        value={versionLicUm}
        onChange={(event) => handleChangeLicUm(event.target.value)}
        size="small"
      >
        <MenuItem value={0}>накази 2004 і 2009 років</MenuItem>
        <MenuItem value={1}>наказ від 15.04.2013 №365</MenuItem>
      </TextField>
      <Typography variant="subtitle1" gutterBottom>Дані перевірки:</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 120 }}
          label="розпочата"
          defaultValue={dayjs(props.check.StartCheckDate)}
          {...register('checkDateStart', {
            required: 'вкажіть дату у форматі ДД.ММ.РРРР',
            pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
          })}
          size="small"
        />
        <DateField
          sx={{ mb: 2, mr: 2, width: 120 }}
          label="завершена"
          defaultValue={dayjs(props.check.EndCheckDate)}
          {...register('checkDateEnd', {
            required: 'вкажіть дату у форматі ДД.ММ.РРРР',
            pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
          })}
          size="small"
        />
      </LocalizationProvider>
      <TextField
        sx={{ mb: 2, mr: 2, width: 80 }}
        label="№ акту"
        error={Boolean(errors.checkActNo?.message)}
        helperText={errors.checkActNo?.message}
        {...register('checkActNo', { required: "Обов'язкове поле" })}
        size="small"
      />
      <TextField
        sx={{ mb: 2, mr: 2, width: 240 }}
        label="Голова комісії"
        error={Boolean(errors.checker?.message)}
        helperText={errors.checker?.message}
        {...register('checker', { required: "Обов'язкове поле" })}
        size="small"
      />
      <TextField
        sx={{ mb: 2, mr: 2, width: 140 }}
        label="Перевірено об'єктів"
        error={Boolean(errors.checkObjCount?.message)}
        helperText={errors.checkObjCount?.message}
        {...register('checkObjCount', {
          required: "Обов'язкове поле",
          pattern: {
            value: /^(?:0|[1-9]\d{0,2}?)$/,
            message: "число від 0 до 999"
          }
        })}
        size="small"
      /><br />
      <FormControlLabel
        control={<Switch checked={Boolean(valueNoViolations)} onChange={(event) => handleChangeNoViolations(event.target.checked)} />}
        label={valueNoViolations ? "Під час перевірки порушень не виявлено" : "Під час перевірки виявлено порушення"}
        sx={{ mb: 2 }}
      />
      {!valueNoViolations && <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 280, maxWidth: "100%" }} size="small">
          <InputLabel id="multiple-checkbox-label">наступних пунктів Ліцензійних умов:</InputLabel>
          <Select
            labelId="multiple-checkbox-label"
            multiple
            value={checkedPointsLicUm}
            onChange={handlePointsChange}
            input={<OutlinedInput label="наступних пунктів Ліцензійних умов:" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {pointsLicUmText.map((point) => (
              <MenuItem key={point} value={point} sx={{ height: 32 }}>
                <Checkbox checked={checkedPointsLicUm.indexOf(point) > -1} size="small" />
                <ListItemText primary={point} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Розпорядження про усунення порушень:</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DateField
            sx={{ mb: 2, mr: 2, width: 120 }}
            label="від"
            defaultValue={dayjs(props.check.CheckRozporDate)}
            {...register('checkRozporDate', {
              pattern: {
                value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/,
                message: 'вкажіть дату у форматі ДД.ММ.РРРР'
              }
            })}
            size="small"
          />
        </LocalizationProvider>
        <TextField
          sx={{ mb: 2, width: 80 }}
          label="номер"
          {...register('checkRozporNo')}
          size="small"
        />
        <Typography variant="subtitle1" gutterBottom>Дата надходження відповіді на розпорядження:</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DateField
            sx={{ width: 120 }}
            defaultValue={dayjs(props.check.CheckRozporDateAnswer)}
            {...register('checkRozporDateAnswer', {
              pattern: {
                value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/,
                message: 'вкажіть дату у форматі ДД.ММ.РРРР'
              }
            })}
            size="small"
          />
        </LocalizationProvider>
      </Box>}
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        label="Додаткова інформація"
        {...register('content')}
        size="small"
      />
      <Divider />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2, mt: 1 }}>Зберегти</Button>
      <Button onClick={handleCancelClick} type="button" size="large" variant="outlined" sx={{ mt: 1 }}>Скасувати</Button>
    </form>
  </Paper>)
}