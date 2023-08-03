import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { AuthContext } from "../context/authContext";
import PersonService from "../API/PersonService";
import Error from './Error';
import MyModal from '../components/UI/MyModal/MyModal';
import { useFetching } from '../hooks/useFetching';
import { PeoplesList } from "../components/PeoplesList";
import { TextField, Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Peoples = () => {
  const { isAuth } = React.useContext(AuthContext);
  const [peoples, setPeoples] = useState([]);
  const [modal, setModal] = useState(true);
  const [queryData, setQueryData] = useState({ name: null });
  let dataToSearch;
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      name: '',
      address: '',
      idkod: ''
    },
    mode: 'onChange'
  });

  const onSubmit = (values) => {
    dataToSearch = values;
    setQueryData(dataToSearch);
    setModal(false);
    fetchPeoples();
  }

  const [fetchPeoples, isPeoplesLoading, loadError] = useFetching(async () => {
    const response = await PersonService.getSome(dataToSearch);
    setPeoples(response.data);
  });

  return isAuth
    ? <div className="list-page">
      <MyModal visible={modal} setVisible={setModal}>
        <form className="searching-form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            sx={{ mb: 2 }}
            label="ПІБ"
            {...register('name', { required: 'Вкажіть хоча б частину ПІБ' })}
            fullWidth
          />
          <TextField
            sx={{ mb: 2 }}
            label="Адреса проживання"
            {...register('address')}
            fullWidth />
          <TextField
            sx={{ mb: 2 }}
            label="Ідентифікаційний код"
            {...register('idkod')}
            fullWidth />
          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>Шукати</Button>
        </form>
      </MyModal>
      <div className="buttons-top">
        <div className="buttons-top__search">
          <Button onClick={() => setModal(true)} variant="outlined">Пошук</Button>
          {queryData.name &&
            <div> ➨ знайдено {peoples.length} осіб, де ПІБ містить "{queryData.name}"
              {queryData.address && ', адреса містить "' + queryData.address + '"'}
              {queryData.idkod && ', ідент.код містить "' + queryData.idkod + '"'}
            </div>}
        </div>
        <div className="buttons-top__new">
          <Button variant="contained" startIcon={<PersonAddIcon />}>Додати нову фізичну особу</Button>
        </div>
      </div>
      {loadError && <h1>Сталась помилка "{loadError}"</h1>}
      <PeoplesList peoples={peoples} loading={isPeoplesLoading} />
    </div>
    : <Error />
}

export default Peoples;