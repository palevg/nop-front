import { useState, useRef } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate, isDateValid } from "../utils/checkers";
import { workPlacesList } from "../utils/data";
import { useForm } from 'react-hook-form';
import { Paper, TextField, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, Radio, FormControlLabel, Checkbox, Alert, AlertTitle } from "@mui/material";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toast } from 'react-toastify';
import axios from '../axios';

const filter = createFilterOptions();
const sameNamesList = [];
const sameNamesCompactList = [];
const titleText = " особи зазвичай не змінюється, тож дані захищені від випадкового редагування.\nЯкщо ж дійсно є потреба це відредагувати - зробіть подвійний клік.";

export const PersonEdit = (props) => {
  const [newPerson, setNewPerson] = useState(props.isNewPerson.person);
  const [valueBirth, setValueBirth] = useState(newPerson ? null : dayjs(props.person.Birth));
  const [valuePasp, setValuePasp] = useState(newPerson ? null : dayjs(props.person.PaspDate));
  const [posada, setPosada] = useState(props.person.Posada);
  const [fotoUrl, setFotoUrl] = useState(props.person.PhotoFile);
  const [disableFields, setDisableFields] = useState(!newPerson);
  const [openSameNamesDialog, setOpenSameNamesDialog] = useState(false);
  const [dialogSameNamesValue, setDialogSameNamesValue] = useState("0");
  const inputFileRef = useRef(null);
  const radioGroupRef = useRef(null);

  const { register, handleSubmit, getValues, setValue, formState: { errors, isValid } } = useForm({
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
      dateStartWork: checkDate(props.person.DateStartWork, ''),
      inCombination: Boolean(props.person.InCombination),
      sequrBoss: Boolean(props.person.SequrBoss)
    },
    mode: 'onChange'
  });
  const values = getValues();

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      if (event.target.files[0].type.indexOf('image') > -1) {
        formData.append('image', event.target.files[0], new Date().getTime() + event.target.files[0].name.slice(event.target.files[0].name.lastIndexOf('.')));
        const { data } = await axios.post('/upload', formData);
        setFotoUrl(data.url);
      } else toast.error("Ви вибрали невірний тип файлу!");
    } catch (err) {
      console.warn(err);
      toast.error("Помилка при завантаженні файлу!");
    }
  };

  const setValuesToNull = (obj) => {
    if (obj.indnum === '') obj.indnum = null;
    if (props.person.Birth === null && !isDateValid(obj.birthDate)) obj.birthDate = null;
    if (obj.birthPlace === '') obj.birthPlace = null;
    if (obj.livePlace === '') obj.livePlace = null;
    if (obj.pasport === '') obj.pasport = null;
    if (props.person.PaspDate === null && !isDateValid(obj.paspDate)) obj.paspDate = null;
    if (obj.paspPlace === '') obj.paspPlace = null;
    if (obj.osvita === '') obj.osvita = null;
    if (obj.statutPart === '') obj.statutPart = null;
    if (props.person.DateEnter === null && !isDateValid(obj.dateEnter)) obj.dateEnter = null;
    if (obj.posada === '') obj.posada = null;
    if (props.person.DateStartWork === null && !isDateValid(obj.dateStartWork)) obj.dateStartWork = null;
  }

  const isDataChanged = (values) => {
    if (props.personType === 2 && posada !== null && posada.name !== undefined) values.posada = posada.name;
    setValuesToNull(values);
    let dataNotChanged = 0;
    if (props.personType === 0) dataNotChanged = 1;
    if ((checkDate(values.dateEnter, '') === checkDate(props.person.DateEnter, '') || values.dateEnter === checkDate(props.person.DateEnter, '')) &&
      values.statutPart === props.person.StatutPart && props.personType === 1) dataNotChanged = 1;
    if ((checkDate(values.dateStartWork, '') === checkDate(props.person.DateStartWork, '') || values.dateStartWork === checkDate(props.person.DateStartWork, '')) &&
      values.posada === props.person.Posada && values.inCombination === Boolean(props.person.InCombination) &&
      values.sequrBoss === Boolean(props.person.SequrBoss) && props.personType === 2) dataNotChanged = 1;
    if (values.fullName === props.person.Name && values.indnum === props.person.Indnum &&
      (checkDate(values.birthDate, '') === checkDate(props.person.Birth, '') || values.birthDate === checkDate(props.person.Birth, '')) &&
      values.birthPlace === props.person.BirthPlace && values.livePlace === props.person.LivePlace && values.pasport === props.person.Pasport &&
      (checkDate(values.paspDate, '') === checkDate(props.person.PaspDate, '') || values.paspDate === checkDate(props.person.PaspDate, '')) &&
      values.paspPlace === props.person.PaspPlace && values.osvita === props.person.Osvita && values.foto === fotoUrl) {
      if (dataNotChanged === 1) return 0;
      if (dataNotChanged === 0) return 2;
    }
    else {
      if (dataNotChanged === 1) return 3;
      if (dataNotChanged === 0) return 1;
    };
  }

  const checkName = async () => {
    const values = getValues();
    values.fullName !== '' && await axios.get('/peoples/with/' + values.fullName)
      .then(res => {
        if (res.data.length) {
          if (sameNamesList.length > 0) sameNamesList.length = 0;
          if (sameNamesCompactList.length > 0) sameNamesCompactList.length = 0;
          res.data.forEach(person => {
            sameNamesList.push(person);
            sameNamesCompactList.push({
              id: person.Id, text: person.Name +
                (person.Indnum !== null ? ', ідент.код ' + person.Indnum : '') +
                (person.Birth !== null ? ', дата народж. ' + person.Birth.split("-").reverse().join(".") : '') +
                (person.BirthPlace !== null ? ', місце народж.: ' + person.BirthPlace : '')
            });
          });
          sameNamesList.filter(person => person.Id === Number(dialogSameNamesValue)).length === 0 && setDialogSameNamesValue("0");
          sameNamesCompactList.push({ id: 0, text: 'записати нову особу з таким же ПІБ' });
          setOpenSameNamesDialog(true);
        }
      })
      .catch(err => {
        toast.error(err.response.data);
      });
  }

  const handleDialogEntering = () => {
    if (radioGroupRef.current !== null) {
      radioGroupRef.current.focus();
    }
  };

  const handleDialogClose = () => {
    setOpenSameNamesDialog(false);
    if (dialogSameNamesValue !== '0') {
      const person = sameNamesList.filter(sameNamesList => sameNamesList.Id === Number(dialogSameNamesValue));
      setFotoUrl(person[0].PhotoFile);
      setValue('foto', person[0].PhotoFile);
      setValue('indnum', person[0].Indnum);
      setValueBirth(person[0].Birth === null ? null : dayjs(person[0].Birth));
      setValue('birthDate', person[0].Birth === null ? null : person[0].Birth.split("-").reverse().join("."));
      setValue('birthPlace', person[0].BirthPlace);
      setValue('livePlace', person[0].LivePlace);
      setValue('pasport', person[0].Pasport);
      setValue('paspDate', person[0].PaspDate === null ? null : person[0].PaspDate.split("-").reverse().join("."));
      setValuePasp(person[0].PaspDate === null ? null : dayjs(person[0].PaspDate));
      setValue('paspPlace', person[0].PaspPlace);
      setValue('osvita', person[0].Osvita);
      props.person.HumanId = person[0].Id;
      setNewPerson(false);
    } else {
      setFotoUrl(null);
      setValue('foto', null);
      setValue('indnum', null);
      setValueBirth(null);
      setValue('birthDate', null);
      setValue('birthPlace', null);
      setValue('livePlace', null);
      setValue('pasport', null);
      setValue('paspDate', null);
      setValuePasp(null);
      setValue('paspPlace', null);
      setValue('osvita', null);
      setNewPerson(true);
    }
  };

  const changeEnabling = () => {
    if (!newPerson) {
      if (disableFields && window.confirm('Вам дійсно потрібно відредагувати цю інформацію?')) setDisableFields(false);
    }
  }

  const onSubmit = async (values) => {
    const changingLevel = isDataChanged(values);
    if (changingLevel > 0) {
      values.editor = props.editor;
      values.enterpr = props.person.Enterprise;
      if (values.foto !== fotoUrl) values.foto = fotoUrl;
      let linkToPatch = "/peoples/", linkToReload;
      if (props.personType === 0) {
        linkToPatch += "editperson";
        linkToReload = "/peoples/";
      }
      if (props.personType === 1) {
        values.personType = 1;
        linkToReload = "/founders/";
      }
      if (props.personType === 2) {
        if (posada.name !== undefined && values.posada !== posada.name) values.posada = posada.name;
        values.inCombination === true ? values.inCombination = 1 : values.inCombination = 0;
        values.sequrBoss === true ? values.sequrBoss = 1 : values.sequrBoss = 0;
        values.personType = 2;
        linkToReload = "/heads/";
      }
      if (newPerson) {
        linkToPatch += "new";
        await axios.post(linkToPatch, values)
          .then(res => {
            toast.success(res.data);
          })
          .catch(err => {
            toast.error(err.response.data);
          });
      } else {
        if (props.personType > 0) linkToPatch += "edit";
        changingLevel === 2 ? values.updatePerson = false : values.updatePerson = true;
        changingLevel === 3 ? values.updatePlace = false : values.updatePlace = true;
        props.personType === 0 ? values.humanId = props.person.Id : values.humanId = props.person.HumanId;
        if (props.isNewPerson.place) {
          linkToPatch += 'newplace'
        } else {
          values.id = props.person.Id;
        }
        await axios.patch(linkToPatch, values)
          .then(res => {
            toast.success(res.data);
          })
          .catch(err => {
            toast.error(err.response.data);
          });
      }
      await axios.get(linkToReload + (props.personType === 0 ? props.person.Id : props.person.Enterprise))
        .then(res => {
          props.updateList(props.personType === 0 ? res.data[0] : res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
    } else toast.info("Ви не зробили жодних змін у даних про особу.");
    props.setEditPerson(null);
    if (!props.simpleEdit) props.setEditMode(null);
  };

  const handleCancelClick = () => {
    const values = getValues();
    if (isDataChanged(values) > 0) {
      if (window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?')) {
        props.setEditPerson(null);
        if (!props.simpleEdit) props.setEditMode(null);
      }
    } else {
      props.setEditPerson(null);
      if (!props.simpleEdit) props.setEditMode(null);
    }
  }

  return (<div>
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
        maxWidth="sm"
        // maxWidth values ['xs', 'sm', 'md', false]
        TransitionProps={{ onEntering: handleDialogEntering }}
        open={openSameNamesDialog}
      >
        <DialogTitle>
          <Alert severity="warning">
            <AlertTitle>Увага!</AlertTitle>
            У реєстрі вже є інформація про особу з таким же ПІБ!
          </Alert>
          Зробіть вибір для продовження введення інформації:
        </DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            ref={radioGroupRef}
            value={dialogSameNamesValue}
            onChange={e => setDialogSameNamesValue(e.target.value)}
          >
            {sameNamesCompactList.map(item =>
              <FormControlLabel
                value={item.id}
                key={item.id}
                control={<Radio />}
                label={item.text}
              />
            )}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>ПІДТВЕРДИТИ</Button>
        </DialogActions>
      </Dialog>
    </Box>
    <Paper elevation={3} sx={{ maxWidth: 700, p: 3, ml: "auto", mr: "auto", mb: 3 }}>
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
              // value={dateEnter}
              // onChange={(newValue) => setDateEnter(newValue)}
              defaultValue={newPerson ? null : dayjs(props.person.DateEnter)}
              {...register('dateEnter', {
                required: 'вкажіть дату у форматі ДД.ММ.РРРР',
                pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
              })}
              size="small"
            />
          </LocalizationProvider>
          <TextField
            sx={{ mb: 2, width: 180 }}
            label="% у Статутному капіталі"
            error={Boolean(errors.statutPart?.message)}
            helperText={errors.statutPart?.message}
            {...register('statutPart', {
              required: "Обов'язкове поле",
              pattern: {
                value: /^(?:0?\.\d*[1-9]+|100|[1-9]\d?(\.\d*[1-9]+)?)$/,
                message: "Значення від 0.хх до 100"
              }
            })}
            size="small"
          />
        </div>}
        {props.personType === 2 && <div>
          <div className="person-posada__edit">
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
              renderInput={(params) => <TextField {...params} {...register('posada', { required: 'Вкажіть посаду' })} label="Посада" />}
              size="small"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
              <DateField
                sx={{ width: 160 }}
                label="На посаді з"
                // value={dateStartWork}
                // onChange={(newValue) => setDateStartWork(newValue)}
                defaultValue={newPerson ? null : dayjs(props.person.DateStartWork)}
                {...register('dateStartWork', {
                  required: 'вкажіть дату у форматі ДД.ММ.РРРР',
                  pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
                })}
                size="small"
              />
            </LocalizationProvider>
          </div>
          <div className="person-posada__edit" style={{ marginBottom: "20px" }}>
            <FormControlLabel label="за сумісництвом" control={
              <Checkbox
                defaultChecked={values.inCombination}
                {...register('inCombination')}
                size="small"
              />
            } />
            <FormControlLabel label="відповідає за напрямок охоронної діяльності" control={
              <Checkbox
                defaultChecked={values.sequrBoss}
                {...register('sequrBoss')}
                size="small"
              />
            } />
          </div>
        </div>}
        <TextField
          sx={{ mb: 2 }}
          label="Прізвище, ім'я та по-батькові"
          disabled={disableFields}
          onDoubleClick={() => { changeEnabling() }}
          title={props.isNewPerson.person ? "" : "ПІБ" + titleText}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', {
            onBlur: () => { props.isNewPerson.place && checkName() },
            required: "Обов'язкове поле",
            pattern: {
              value: /^(?=.{8,50}$)[А-ЯІЇЄ][а-яіїє']+(-[А-ЯІЇЄ][а-яіїє']+)? [А-ЯІЇЄ][а-яіїє']+(-[А-ЯІЇЄ][а-яіїє']+)? [А-ЯІЇЄ][а-яіїє']+( [А-їІЇЄ'\s\-]+)?$/,
              message: "Лише букви кирилиці, апостроф та дефіс (від 8 до 50 символів); ПІБ починаються з великої літери"
            }
          }
          )}
          size="small"
          fullWidth />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DateField
            sx={{ mb: 2, mr: 2, width: 160 }}
            label="Дата народження"
            disabled={disableFields}
            onDoubleClick={() => { changeEnabling() }}
            title={props.isNewPerson.person ? "" : "Дата народження" + titleText}
            value={valueBirth}
            onChange={(newValue) => setValueBirth(newValue)}
            {...register('birthDate', {
              required: 'вкажіть дату у форматі ДД.ММ.РРРР',
              pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
            })}
            size="small"
          />
        </LocalizationProvider>
        <TextField
          sx={{ mb: 2, width: 160 }}
          label="Ідентифікаційний код"
          disabled={disableFields}
          onDoubleClick={() => { changeEnabling() }}
          title={props.isNewPerson.person ? "" : "Ідентифікаційний код" + titleText}
          InputLabelProps={{ shrink: values.indnum ? true : undefined }}
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
          disabled={disableFields}
          onDoubleClick={() => { changeEnabling() }}
          title={props.isNewPerson.person ? "" : "Місце народження" + titleText}
          InputLabelProps={{ shrink: values.birthPlace ? true : undefined }}
          error={Boolean(errors.birthPlace?.message)}
          helperText={errors.birthPlace?.message}
          {...register('birthPlace', { required: "Обов'язкове поле" })}
          size="small"
          fullWidth />
        <TextField
          sx={{ mb: 2 }}
          label="Місце проживання"
          InputLabelProps={{ shrink: values.livePlace ? true : undefined }}
          error={Boolean(errors.livePlace?.message)}
          helperText={errors.livePlace?.message}
          {...register('livePlace', { required: "Обов'язкове поле" })}
          size="small"
          fullWidth />
        <TextField
          sx={{ mb: 2, mr: 2, width: 160 }}
          label="Паспорт: серія і №"
          InputLabelProps={{ shrink: values.pasport ? true : undefined }}
          error={Boolean(errors.pasport?.message)}
          helperText={errors.pasport?.message}
          {...register('pasport', { required: "Обов'язкове поле" })}
          size="small"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DateField
            sx={{ mb: 2, width: 160 }}
            label="дата видачі"
            value={valuePasp}
            onChange={(newValue) => setValuePasp(newValue)}
            defaultValue={newPerson ? null : dayjs(props.person.PaspDate)}
            {...register('paspDate', {
              required: 'вкажіть дату у форматі ДД.ММ.РРРР',
              pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
            })}
            size="small"
          />
        </LocalizationProvider>
        <TextField
          sx={{ mb: 2 }}
          label="яким органом видано"
          InputLabelProps={{ shrink: values.paspPlace ? true : undefined }}
          error={Boolean(errors.paspPlace?.message)}
          helperText={errors.paspPlace?.message}
          {...register('paspPlace', { required: "Обов'язкове поле" })}
          size="small"
          fullWidth />
        <TextField
          sx={{ mb: 2 }}
          label="Освіта та/або служба"
          InputLabelProps={{ shrink: values.osvita ? true : undefined }}
          multiline
          rows={2}
          {...register('osvita')}
          size="small"
          fullWidth />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Зберегти</Button>
        <Button onClick={handleCancelClick} type="button" size="large" variant="outlined">Скасувати</Button>
      </form>
    </Paper>
  </div>)
}