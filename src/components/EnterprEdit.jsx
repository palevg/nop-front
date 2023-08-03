import React, { useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import { checkDate } from "../utils/checkers";
import { taxState, riskState } from "../utils/data";
import { useForm } from 'react-hook-form';
import { Paper, TextField, InputAdornment, Button, MenuItem } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import axios from '../axios';

export const EnterprEdit = (props) => {
  // const [openDialog, setOpenDialog] = useState(false);

  const [valueDateCreate, setValueDateCreate] = useState(props.addNew ? null : dayjs(props.enterpr.DateCreate));
  // const [valuePasp, setValuePasp] = useState(dayjs(props.person.PaspDate));
  // const [dateEnter, setDateEnter] = useState(dayjs(props.person.DateEnter));
  // const [dateStartWork, setDateStartWork] = useState(dayjs(props.person.DateStartWork));
  // const [posada, setPosada] = useState(props.person.Posada);
  // const [fotoUrl, setFotoUrl] = useState(props.person.PhotoFile);
  // const inputFileRef = React.useRef(null);
  // const [enableFields, setEnableFields] = useState(!props.isNewPerson.person);
  // const [sameInfoList, setSameInfoList] = useState([]);
  // const [sameInfoShort, setSameInfoShort] = useState([]);

  // const radioGroupRef = React.useRef(null);
  // const [dialogValue, setDialogValue] = React.useState('0');

  const { register, handleSubmit, getValues, setValue, formState: { errors, isValid } } = useForm({
    defaultValues: {
      fullName: props.addNew ? null : props.enterpr.FullName,
      keyName: props.addNew ? null : props.enterpr.KeyName,
      ident: props.addNew ? null : props.enterpr.Ident,
      dateCreate: props.addNew ? null : checkDate(props.enterpr.DateCreate, ''),
      statutSize: props.addNew ? null : props.enterpr.StatutSize,
      addressDeUre: props.addNew ? null : props.enterpr.AddressDeUre,
      addressDeFacto: props.addNew ? null : props.enterpr.AddressDeFacto,
      phones: props.addNew ? null : props.enterpr.Phones,
      faxes: props.addNew ? null : props.enterpr.Faxes,
      rosRah: props.addNew ? null : props.enterpr.RosRah,
      rosUst: props.addNew ? null : props.enterpr.RosUst,
      rosMFO: props.addNew ? null : props.enterpr.RosMFO,
      podatok: props.addNew ? null : props.enterpr.Podatok,
      stateRisk: props.addNew ? null : props.enterpr.StateRisk,
      addInfo: props.addNew ? null : props.enterpr.AddInfo
    },
    mode: 'onChange'
  });

  // const handleChangeFile = async (event) => {
  //   try {
  //     const formData = new FormData();
  //     if (event.target.files[0].type.indexOf('image') > -1) {
  //       formData.append('image', event.target.files[0], new Date().getTime() + event.target.files[0].name.slice(event.target.files[0].name.lastIndexOf('.')));
  //       const { data } = await axios.post('/upload', formData);
  //       setFotoUrl(data.url);
  //     } else alert('Ви вибрали невірний тип файлу!');
  //   } catch (err) {
  //     console.warn(err);
  //     alert('Помилка при завантаженні файлу!');
  //   }
  // };

  // const setValuesToNull = (obj) => {
  //   if (obj.indnum === '') obj.indnum = null;
  //   if (props.person.Birth === null && isNaN(obj.birthDate)) obj.birthDate = null;
  //   if (obj.birthPlace === '') obj.birthPlace = null;
  //   if (obj.livePlace === '') obj.livePlace = null;
  //   if (obj.pasport === '') obj.pasport = null;
  //   if (props.person.PaspDate === null && isNaN(obj.paspDate)) obj.paspDate = null;
  //   if (obj.paspPlace === '') obj.paspPlace = null;
  //   if (obj.osvita === '') obj.osvita = null;
  //   if (obj.statutPart === '') obj.statutPart = null;
  //   if (props.person.DateEnter === null && isNaN(obj.dateEnter)) obj.dateEnter = null;
  //   if (obj.posada === '') obj.posada = null;
  //   if (props.person.DateStartWork === null && isNaN(obj.dateStartWork)) obj.dateStartWork = null;
  // }

  // const isDataChanged = (values) => {
  //   if (props.personType === 2 && posada !== null && posada.name !== undefined) values.posada = posada.name;
  //   setValuesToNull(values);
  //   let dataNotChanged = 0;
  //   if (props.personType === 0) dataNotChanged = 1;
  //   if ((checkDate(values.dateEnter, '') === checkDate(props.person.DateEnter, '') || values.dateEnter === checkDate(props.person.DateEnter, '')) &&
  //     values.statutPart === props.person.StatutPart && props.personType === 1) dataNotChanged = 1;
  //   if ((checkDate(values.dateStartWork, '') === checkDate(props.person.DateStartWork, '') || values.dateStartWork === checkDate(props.person.DateStartWork, '')) &&
  //     values.posada === props.person.Posada && values.inCombination === Boolean(props.person.InCombination) &&
  //     values.sequrBoss === Boolean(props.person.SequrBoss) && props.personType === 2) dataNotChanged = 1;
  //   if (values.fullName === props.person.Name && values.indnum === props.person.Indnum &&
  //     (checkDate(values.birthDate, '') === checkDate(props.person.Birth, '') || values.birthDate === checkDate(props.person.Birth, '')) &&
  //     values.birthPlace === props.person.BirthPlace && values.livePlace === props.person.LivePlace && values.pasport === props.person.Pasport &&
  //     (checkDate(values.paspDate, '') === checkDate(props.person.PaspDate, '') || values.paspDate === checkDate(props.person.PaspDate, '')) &&
  //     values.paspPlace === props.person.PaspPlace && values.osvita === props.person.Osvita && values.foto === fotoUrl) {
  //     if (dataNotChanged === 1) return 0;
  //     if (dataNotChanged === 0) return 2;
  //   }
  //   else return 1;
  // }

  // const checkName = async () => {
  //   const values = getValues();
  //   values.fullName !== '' && await axios.get('/peoples/with/' + values.fullName)
  //     .then(res => {
  //       if (res.data.length) {
  //         setSameInfoList(res.data);
  //         let sn = [];
  //         res.data.map((item, index) => {
  //           sn.push({
  //             id: item.Id, text: item.Name +
  //               (item.Indnum !== null ? ', ідент.код ' + item.Indnum : '') +
  //               (item.Birth !== null ? ', дата народж. ' + item.Birth.split("-").reverse().join(".") : '') +
  //               (item.BirthPlace !== null ? ', місце народж.: ' + item.BirthPlace : '')
  //           })
  //         });
  //         sn.push({ id: 0, text: 'записати нову особу з таким же ПІБ' });
  //         setSameInfoShort(sn);
  //         setOpenDialog(true);
  //       }
  //     })
  //     .catch(err => {
  //       alert(err.response.data);
  //     });
  // }

  // const handleDialogEntering = () => {
  //   if (radioGroupRef.current != null) {
  //     radioGroupRef.current.focus();
  //   }
  // };

  // const handleDialogChange = (event) => {
  //   setDialogValue(event.target.value);
  // };

  // const handleDialogClose = () => {
  //   setOpenDialog(false);
  //   if (dialogValue !== '0') {
  //     const person = sameInfoList.filter(sameInfoList => sameInfoList.Id === Number(dialogValue));
  //     setFotoUrl(person[0].PhotoFile);
  //     setValue('foto', person[0].PhotoFile);
  //     setValue('indnum', person[0].Indnum);
  //     setValueBirth(person[0].Birth === null ? null : dayjs(person[0].Birth));
  //     setValue('birthDate', person[0].Birth === null ? null : person[0].Birth.split("-").reverse().join("."));
  //     setValue('birthPlace', person[0].BirthPlace);
  //     setValue('livePlace', person[0].LivePlace);
  //     setValue('pasport', person[0].Pasport);
  //     setValue('paspDate', person[0].PaspDate === null ? null : person[0].PaspDate.split("-").reverse().join("."));
  //     setValuePasp(person[0].PaspDate === null ? null : dayjs(person[0].PaspDate));
  //     setValue('paspPlace', person[0].PaspPlace);
  //     setValue('osvita', person[0].Osvita);
  //     props.person.HumanId = person[0].Id;
  //     props.isNewPerson.person = false;
  //   } else {
  //     setFotoUrl(null);
  //     setValue('foto', null);
  //     setValue('indnum', null);
  //     setValueBirth(null);
  //     setValue('birthDate', null);
  //     setValue('birthPlace', null);
  //     setValue('livePlace', null);
  //     setValue('pasport', null);
  //     setValue('paspDate', null);
  //     setValuePasp(null);
  //     setValue('paspPlace', null);
  //     setValue('osvita', null);
  //     props.isNewPerson.person = true;
  //   }
  // };

  const onSubmit = async (values) => {
    console.log(values);
    // const changingLevel = isDataChanged(values);
    // if (changingLevel > 0) {
    //   values.editor = props.editor;
    //   values.enterpr = props.person.Enterprise;
    //   if (values.foto !== fotoUrl) values.foto = fotoUrl;
    //   let linkToPatch = "/peoples/", linkToReload;
    //   if (props.personType === 0) {
    //     linkToPatch += "editperson";
    //     linkToReload = "/peoples/";
    //   }
    //   if (props.personType === 1) {
    //     values.personType = 1;
    //     linkToReload = "/founders/";
    //   }
    //   if (props.personType === 2) {
    //     if (posada.name !== undefined && values.posada !== posada.name) values.posada = posada.name;
    //     values.inCombination === true ? values.inCombination = 1 : values.inCombination = 0;
    //     values.sequrBoss === true ? values.sequrBoss = 1 : values.sequrBoss = 0;
    //     values.personType = 2;
    //     linkToReload = "/heads/";
    //   }
    //   if (props.isNewPerson.person) {
    //     linkToPatch += "new";
    //     await axios.post(linkToPatch, values)
    //       .then(res => {
    //         alert(res.data);
    //       })
    //       .catch(err => {
    //         alert(err.response.data);
    //       });
    //   } else {
    //     if (props.personType > 0) linkToPatch += "edit";
    //     changingLevel === 2 ? values.updatePerson = false : values.updatePerson = true;
    //     props.personType === 0 ? values.humanId = props.person.Id : values.humanId = props.person.HumanId;
    //     if (props.isNewPerson.place) {
    //       linkToPatch += 'newplace'
    //     } else {
    //       values.id = props.person.Id;
    //     }
    //     await axios.patch(linkToPatch, values)
    //       .then(res => {
    //         alert(res.data);
    //       })
    //       .catch(err => {
    //         alert(err.response.data);
    //       });
    //   }
    //   await axios.get(linkToReload + (props.personType === 0 ? props.person.Id : props.person.Enterprise))
    //     .then(res => {
    //       props.updateList(props.personType === 0 ? res.data[0] : res.data);
    //     })
    //     .catch(err => {
    //       alert(err.response.data);
    //     });
    // } else window.alert('Для інформації: ви не зробили жодних змін у даних про особу.');
    props.updateEditing(null);
  };

  const handleCancelClick = () => {
    props.updateEditing(null);
    // const values = getValues();
    // isDataChanged(values) > 0
    //   ? window.confirm('Увага, дані було змінено! Якщо не зберегти - зміни будуть втрачені. Впевнені, що хочете продовжити?') && props.updateEditing(null)
    //   : props.updateEditing(null)
  }

  return (<Paper classes={{ root: "fullPage" }} sx={{ m: 2, p: 2 }}>
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="person-foto__edit">
          <img className="fullPage__person-foto"
            src={fotoUrl ? `${process.env.REACT_APP_API_URL}/uploads/${fotoUrl}` : `${process.env.REACT_APP_API_URL}/uploads/no_foto.jpg`} alt="Фото особи" />
          <div>
            <input ref={inputFileRef} accept="image/*" type="file" onChange={handleChangeFile} hidden />
            <Button onClick={() => inputFileRef.current.click()} type="button" size="large" variant="contained" sx={{ mb: 2, width: 190, display: 'block' }}>Завантажити фото</Button>
            {fotoUrl && <Button onClick={() => setFotoUrl(null)} type="button" size="large" variant="contained" sx={{ width: 190 }}>Видалити фото</Button>}
          </div>
        </div> */}


      <TextField
        sx={{ mb: 2 }}
        label="Повна назва юридичної особи"
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {...register('fullName', {
          // onBlur: () => { props.isNewPerson.place && checkName() },
          required: "Обов'язкове поле"
        }
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
        sx={{ mb: 2, mr: 2, width: 160 }}
        label="Код за ЄДРПОУ"
        // disabled={enableFields}
        // InputLabelProps={{ shrink: values.indnum ? true : undefined }}
        error={Boolean(errors.ident?.message)}
        helperText={errors.ident?.message}
        {...register('ident', { required: "Обов'язкове поле" })}
        size="small"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
        <DateField
          sx={{ mb: 2, mr: 2, width: 160 }}
          label="Дата створення"
          // disabled={enableFields}
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
        defaultValue={props.addNew ? "2" : props.enterpr.Podatok}
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
        defaultValue={props.addNew ? "3" : props.enterpr.StateRisk}
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
        // InputLabelProps={{ shrink: values.osvita ? true : undefined }}
        multiline
        rows={3}
        {...register('addInfo')}
        size="small"
        fullWidth />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Зберегти</Button>
      <Button onClick={handleCancelClick} type="button" size="large" variant="outlined">Скасувати</Button>
    </form>
  </Paper>)
}