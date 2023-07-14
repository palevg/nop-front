import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/authContext";
import EnterprService from '../API/EnterprService';
import Error from './Error';
import MyModal from '../components/UI/MyModal/MyModal';
import { useFetching } from '../hooks/useFetching';
import { EnterprList } from '../components/EnterprList';
import { TextField, MenuItem, Button } from "@mui/material";

const Enterprs = () => {
  const { isAuth } = React.useContext(AuthContext);
  const [enterprs, setEnterprs] = useState([]);
  const [modal, setModal] = useState(true);
  const [queryData, setQueryData] = useState({ name: null });

  const regionNames = ["вся Україна", "АР Крим", "Вінницька обл.", "Волинська обл.", "Дніпропетровська обл.", "Донецька обл.", "Житомирська обл.",
    "Закарпатська обл.", "Запорізька обл.", "Івано-Франківська обл.", "Київська обл.", "м. Київ", "Кіровоградська обл.", "Луганська обл.",
    "Львівська обл.", "Миколаївська обл.", "Одеська обл.", "Полтавська обл.", "Рівненська обл.", "Сумська обл.", "Тернопільська обл.",
    "Харківська обл.", "Херсонська обл.", "Хмельницька обл.", "Черкаська обл.", "Чернігівська обл.", "Чернівецька обл."];
  const licenseState = ["діючі", "анульовані", "строк дії закінчено", "недійсні", "всі"];

  let dataToSearch;
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      region: 0,
      name: '',
      edrpou: '',
      address: '',
      license: 0
    },
    mode: 'onChange'
  });

  const onSubmit = (values) => {
    setEnterprs([]);
    dataToSearch = values;
    setQueryData(dataToSearch);
    setModal(false);
    fetchEnterprs();
  }

  const handleClearFields = () => {
    setValue('region', 0);
    setValue('name', '');
    setValue('edrpou', '');
    setValue('address', '');
    setValue('license', 0);
    document.getElementById("select-region").textContent = regionNames[0];
    document.getElementById("select-licenses").textContent = licenseState[0];
  }

  const [fetchEnterprs, isEnterprLoading, enterprError] = useFetching(async () => {
    const response = await EnterprService.getSome(dataToSearch);
    setEnterprs(response.data);
  });

  return isAuth
    ? <div className="list-page">
      <MyModal visible={modal} setVisible={setModal}>
        <form className="searching-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            className="searching-form__text"
            label="Територія пошуку"
            id="select-region"
            select
            defaultValue={0}
            {...register('region', { required: true })}
            fullWidth
          >
            {regionNames.map((item, index) =>
              <MenuItem key={index} value={index}>{item}</MenuItem>
            )}
          </TextField>
          <TextField
            className="searching-form__text"
            label="Назва юридичної особи"
            {...register('name', { required: false })}
            fullWidth
          />
          <TextField
            className="searching-form__text"
            label="Код ЄДРПОУ"
            {...register('edrpou', { required: false })}
            fullWidth />
          <TextField
            className="searching-form__text"
            label="Місцезнаходження"
            {...register('address', { required: false })}
            fullWidth />
          <TextField
            className="searching-form__text"
            label="Стан ліцензій"
            id="select-licenses"
            select
            defaultValue={0}
            {...register('license', { required: true })}
            fullWidth
          >
            {licenseState.map((item, index) =>
              <MenuItem key={index} value={index}>{item}</MenuItem>
            )}
          </TextField>
          <Button type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Шукати</Button>
          <Button type="reset" size="large" variant="outlined" onClick={handleClearFields}>Очистити</Button>
        </form>
      </MyModal>
      <div className="search-header">
        <Button onClick={() => setModal(true)} variant="outlined">Фільтр</Button>
        <div> ➨ знайдено {enterprs.length}
          {enterprs.length === 1 && ' підприємство'}
          {enterprs.length > 1 && enterprs.length < 5 && ' підприємства'}
          {(enterprs.length === 0 || enterprs.length > 4) && ' підприємств'}
          {enterprs.length > 0 && ': регіон - ' + regionNames[queryData.region]}
          {queryData.name && ', назва містить "' + queryData.name + '"'}
          {queryData.edrpou && ', код ЄДРПОУ містить "' + queryData.edrpou + '"'}
          {queryData.address && ', адреса містить "' + queryData.address + '"'}
          {queryData.license >= 0 && '; стан ліцензій - ' + licenseState[queryData.license]}
        </div>
      </div>
      {enterprError && <h1>Сталась помилка "{enterprError}"</h1>}
      <EnterprList enterprs={enterprs} loading={isEnterprLoading} title="Список підприємств" titleSize={true} />
    </div>
    : <Error />
}

export default Enterprs;