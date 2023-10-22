import { useState } from "react";
import { useForm } from 'react-hook-form';
import PersonService from "../API/PersonService";
import { useFetching } from '../hooks/useFetching';
import { PeoplesList } from "../components/PeoplesList";
import { Dialog, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function Peoples() {
  const [peoples, setPeoples] = useState([]);
  const [openDialog, setOpenDialog] = useState(true);
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
    setOpenDialog(false);
    fetchPeoples();
  }

  const [fetchPeoples, isPeoplesLoading, loadError] = useFetching(async () => {
    const response = await PersonService.getSome(dataToSearch);
    setPeoples(response.data);
  });

  return (
    <div className="list-page">
      <Dialog maxWidth="xs" open={openDialog}>
        <form style={{ width: 300 }} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              sx={{ mb: 2 }}
              label="ПІБ"
              error={Boolean(errors.name?.message)}
              helperText={errors.name?.message}
              {...register('name', { required: 'Вкажіть хоча б частину ПІБ' })}
              fullWidth
            />
            <TextField
              sx={{ mb: 2 }}
              label="Адреса проживання"
              {...register('address')}
              fullWidth />
            <TextField
              label="Ідентифікаційний код"
              {...register('idkod')}
              fullWidth />
          </DialogContent>
          <DialogActions>
            <Button type="submit" disabled={!isValid} variant="contained">ПІДТВЕРДИТИ</Button>
            <Button sx={{ mr: 2 }} onClick={() => setOpenDialog(false)}>СКАСУВАТИ</Button>
          </DialogActions>
        </form>
      </Dialog>
      <div className="buttons-top">
        <div className="buttons-top__search">
          <Button onClick={() => setOpenDialog(true)} variant="outlined">Пошук</Button>
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
  )
}