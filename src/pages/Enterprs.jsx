import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/authContext";
import EnterprService from '../API/EnterprService';
import Error from './Error';
import MyModal from '../components/UI/MyModal/MyModal';
import { useFetching } from '../hooks/useFetching';
import { EnterprList } from '../components/EnterprList';
import { EnterprEdit } from "../components/EnterprEdit";
import { regionNames, licensesState, ordersState } from "../utils/data";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, MenuItem, Button } from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

const Enterprs = () => {
  const { isAuth, currentUser } = React.useContext(AuthContext);
  const [enterprs, setEnterprs] = useState([]);
  const [editEnterpr, setEditEnterpr] = useState(null);
  const updateEditing = (value) => { setEditEnterpr(value); }
  const [modal, setModal] = useState(true);
  const [searchArea, setSearchArea] = useState("0");
  const [queryData, setQueryData] = useState({ name: null });

  let dataToSearch;
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      region: 0,
      name: '',
      edrpou: '',
      address: '',
      license: 0,
      order: 0
    },
    mode: 'onChange'
  });

  const onSubmit = (values) => {
    values.area = searchArea;
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
    document.getElementById("select-region").textContent = regionNames[0];
  }

  const [fetchEnterprs, isEnterprLoading, enterprError] = useFetching(async () => {
    const response = await EnterprService.getSome(dataToSearch);
    setEnterprs(response.data);
  });

  return isAuth
    ? editEnterpr ? <EnterprEdit addNew={true} enterpr={null} updateEditing={updateEditing} /> : <div className="list-page">
      <MyModal visible={modal} setVisible={setModal}>
        <form className="searching-form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel id="radio-buttons-area">Шукати у розділі</FormLabel>
            <RadioGroup
              sx={{ mb: 2 }}
              row
              aria-labelledby="radio-buttons-area"
              value={searchArea}
              onChange={(event) => { setSearchArea(event.target.value) }}
            >
              <FormControlLabel value="0" control={<Radio />} label="ліцензії" />
              <FormControlLabel value="1" control={<Radio />} label="заяви" />
            </RadioGroup>
          </FormControl>
          {searchArea === "0" && <TextField
            sx={{ mb: 2 }}
            label="Стан ліцензій"
            select
            defaultValue={0}
            {...register('license')}
            fullWidth
          >
            {licensesState.map((item, index) =>
              <MenuItem key={index} value={index}>{item}</MenuItem>
            )}
          </TextField>}
          {searchArea === "1" && <TextField
            sx={{ mb: 2 }}
            label="Стан заяв"
            select
            defaultValue={0}
            {...register('order')}
            fullWidth
          >
            {ordersState.map((item, index) =>
              <MenuItem key={index} value={index}>{item}</MenuItem>
            )}
          </TextField>}
          <TextField
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
            label="Назва юридичної особи"
            {...register('name')}
            fullWidth
          />
          <TextField
            sx={{ mb: 2 }}
            label="Код за ЄДРПОУ"
            {...register('edrpou')}
            fullWidth />
          <TextField
            sx={{ mb: 2 }}
            label="Місцезнаходження"
            {...register('address')}
            fullWidth />
          <Button type="submit" size="large" variant="contained" sx={{ mr: 2 }}>Шукати</Button>
          <Button type="reset" size="large" variant="outlined" onClick={handleClearFields}>Очистити</Button>
        </form>
      </MyModal>
      <div className="buttons-top">
        <div className="buttons-top__search">
          <Button onClick={() => setModal(true)} variant="outlined">Фільтр</Button>
          <div> ➨ знайдено {enterprs.length}
            {enterprs.length === 1 && ' юридична особа'}
            {enterprs.length > 1 && enterprs.length < 5 && ' юридичні особи'}
            {(enterprs.length === 0 || enterprs.length > 4) && ' юридичних осіб'}
            {enterprs.length > 0 && ': регіон - ' + regionNames[queryData.region]}
            {queryData.name && ', назва містить "' + queryData.name + '"'}
            {queryData.edrpou && ', код ЄДРПОУ містить "' + queryData.edrpou + '"'}
            {queryData.address && ', адреса містить "' + queryData.address + '"'}
            {searchArea === "0" && '; стан ліцензій - ' + licensesState[queryData.license]}
            {searchArea === "1" && '; стан заяв - ' + ordersState[queryData.order]}
          </div>
        </div>
        {currentUser.acc > 1 && <div className="buttons-top__new">
          <Button onClick={() => setEditEnterpr(true)} variant="contained" startIcon={<AddBusinessIcon />}>Додати нову юридичну особу</Button>
        </div>}
      </div>
      {enterprError && <h1>Сталась помилка "{enterprError}"</h1>}
      <EnterprList enterprs={enterprs} loading={isEnterprLoading} title="Юридичні особи" titleSize={true} />
    </div>
    : <Error />
}

export default Enterprs;