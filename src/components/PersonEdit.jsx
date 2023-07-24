import React, { useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate } from "../utils/checkers";
import { useForm } from 'react-hook-form';
import { Paper, TextField, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, Radio, FormControlLabel, Checkbox, Alert, AlertTitle } from "@mui/material";
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
  const [sameInfoList, setSameInfoList] = useState([]);
  const [sameInfoShort, setSameInfoShort] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const radioGroupRef = React.useRef(null);
  const [dialogValue, setDialogValue] = React.useState('0');

  const workPlacesList = [{ name: 'Генеральний директор' }, { name: 'Голова правління' }, { name: 'Директор' },
  { name: 'Виконавчий директор' }, { name: 'Заступник генер. директора' }, { name: 'Заступник директора' },
  { name: 'Заст.директора з охорон. діяльності' }, { name: 'Фахівець з організації охорони' },
  { name: 'Головний спеціаліст' }, { name: 'Головний бухгалтер' }, { name: 'Бухгалтер' }, { name: 'Підприємець' }];

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
      } else alert('Ви вибрали невірний тип файлу!');
    } catch (err) {
      console.warn(err);
      alert('Помилка при завантаженні файлу!');
    }
  };

  const isDataChanged = () => {
    const values = getValues();
    if (props.personType === 2 && posada !== null && posada.name !== undefined) values.posada = posada.name;
    if (values.osvita === '') values.osvita = null;
    let dataNotChanged = false;
    if ((checkDate(values.dateEnter, '') === checkDate(props.person.DateEnter, '') || values.dateEnter === checkDate(props.person.DateEnter, '')) &&
      values.statutPart === props.person.StatutPart && props.personType === 1) dataNotChanged = true;
    if ((checkDate(values.dateStartWork, '') === checkDate(props.person.DateStartWork, '') || values.dateStartWork === checkDate(props.person.DateStartWork, '')) &&
      values.posada === props.person.Posada && values.inCombination === Boolean(props.person.InCombination) &&
      values.sequrBoss === Boolean(props.person.SequrBoss) && props.personType === 2) dataNotChanged = true;
    if (dataNotChanged && values.fullName === props.person.Name && values.indnum === props.person.Indnum &&
      (checkDate(values.birthDate, '') === checkDate(props.person.Birth, '') || values.birthDate === checkDate(props.person.Birth, '')) &&
      values.birthPlace === props.person.BirthPlace && values.livePlace === props.person.LivePlace && values.pasport === props.person.Pasport &&
      (checkDate(values.paspDate, '') === checkDate(props.person.PaspDate, '') || values.paspDate === checkDate(props.person.PaspDate, '')) &&
      values.paspPlace === props.person.PaspPlace && values.osvita === props.person.Osvita && values.foto === fotoUrl)
      return false
    else return true;
  }

  const checkName = async () => {
    const values = getValues();
    values.fullName !== '' && await axios.get('/peoples/with/' + values.fullName)
      .then(res => {
        if (res.data.length) {
          setSameInfoList(res.data);
          let sn = [];
          res.data.map((item, index) => {
            sn.push({
              id: item.Id, text: item.Name +
                (item.Indnum !== null ? ', ідент.код ' + item.Indnum : '') +
                (item.Birth !== null ? ', дата народж. ' + item.Birth.split("-").reverse().join(".") : '') +
                (item.BirthPlace !== null ? ', місце народж.: ' + item.BirthPlace : '')
            })
          });
          sn.push({ id: 0, text: 'записати нову особу з таким же ПІБ' });
          setSameInfoShort(sn);
          setOpenDialog(true);
        }
      })
      .catch(err => {
        alert(err.response.data);
      });
  }

  const handleDialogEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleDialogChange = (event) => {
    setDialogValue(event.target.value);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    if (dialogValue !== '0') {
      const person = sameInfoList.filter(sameInfoList => sameInfoList.Id === Number(dialogValue));
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
      props.isNewPerson.person = false;
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
      props.isNewPerson.person = true;
    }
  };

  const onSubmit = async (values) => {
    if (isDataChanged()) {
      values.editor = props.editor;
      values.enterpr = props.person.Enterprise;
      if (values.foto !== fotoUrl) values.foto = fotoUrl;

      let linkToPatch, linkToReload;
      if (props.personType === 1) {
        props.isNewPerson.person ? linkToPatch = "/peoples/newfounder" : linkToPatch = "/peoples/editfounder";
        linkToReload = "/founders/";
      }
      if (props.personType === 2) {
        props.isNewPerson.person ? linkToPatch = "/peoples/newhead" : linkToPatch = "/peoples/edithead";
        linkToReload = "/heads/";
        if (posada.name !== undefined && values.posada !== posada.name) values.posada = posada.name;
        values.inCombination === true ? values.inCombination = 1 : values.inCombination = 0;
        values.sequrBoss === true ? values.sequrBoss = 1 : values.sequrBoss = 0;
      }
      if (props.isNewPerson.person) {
        await axios.post(linkToPatch, values)
          .then(res => {
            alert(res.data);
          })
          .catch(err => {
            alert(err.response.data);
          });
      } else {
        values.humanId = props.person.HumanId;
        if (props.isNewPerson.place) {
          linkToPatch += 'newplace'
        } else {
          values.id = props.person.Id;
        }
        await axios.patch(linkToPatch, values)
          .then(res => {
            alert(res.data);
          })
          .catch(err => {
            alert(err.response.data);
          });
      }
      await axios.get(linkToReload + props.person.Enterprise)
        .then(res => {
          props.updateList(res.data);
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

  return (<div>
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 535 } }}
        maxWidth="sm"
        TransitionProps={{ onEntering: handleDialogEntering }}
        open={openDialog}
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
            aria-label="ringtone"
            name="ringtone"
            value={dialogValue}
            onChange={handleDialogChange}
          >
            {sameInfoShort.map((option) => (
              <FormControlLabel
                value={option.id}
                key={option.id}
                control={<Radio />}
                label={option.text}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDialogClose}>ПІДТВЕРДИТИ</Button>
        </DialogActions>
      </Dialog>
    </Box>
    <Paper classes={{ root: "profile_root" }}>
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
                value={dateStartWork}
                onChange={(newValue) => setDateStartWork(newValue)}
                {...register('dateStartWork')}
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
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', {
            onBlur: () => { props.isNewPerson.place && checkName() },
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
          InputLabelProps={{ shrink: values.birthPlace ? true : undefined }}
          {...register('birthPlace', { required: 'Вкажіть місце народження' })}
          size="small"
          fullWidth />
        <TextField
          sx={{ mb: 2 }}
          label="Місце проживання"
          InputLabelProps={{ shrink: values.livePlace ? true : undefined }}
          {...register('livePlace', { required: 'Вкажіть місце проживання' })}
          size="small"
          fullWidth />
        <TextField
          sx={{ mb: 2, mr: 2, width: 160 }}
          label="Паспорт: серія і №"
          InputLabelProps={{ shrink: values.pasport ? true : undefined }}
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
          InputLabelProps={{ shrink: values.paspPlace ? true : undefined }}
          {...register('paspPlace', { required: 'Вкажіть орган видачі паспорта' })}
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