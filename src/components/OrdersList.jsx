import { useContext, useState } from "react";
import { useForm } from 'react-hook-form';
import 'dayjs/locale/uk';
import { AuthContext } from "../context/authContext";
import { licenseTypes } from "../utils/data";
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions } from "@mui/material";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import OrdersListItem from "./OrdersListItem";
import OrderEdit from "./OrderEdit";
import axios from '../axios';
import { toast } from "react-toastify";

export const OrdersList = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(0);
  const [editOrder, setEditOrder] = useState(null);
  const [addNewOrder, setAddNewOrder] = useState(false);
  const [changeOrderState, setChangeOrderState] = useState(null);

  const { register, setValue, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      serLicenze: '',
      numLicenze: '',
      dateLicenze: null,
      typeLicenze: 8,
      options: ''
    },
    mode: 'onChange'
  });

  const handleButtonClick = () => {
    setAddNewOrder(true);
    props.setEditMode(true);
    setEditOrder({
      EnterpriseId: props.enterprId,
      OrderType: 0, HumanId: 0, Category: "A+C",
      DateZajav: null, NumZajav: null, Options: null
    });
  }

  const onSubmit = async (values) => {
    let alertText = '';
    values.state = openDialog;
    values.id = changeOrderState.Id;
    values.editor = currentUser.Id;
    if (openDialog === 5) {
      values.reasonStart = values.options;
      values.options = changeOrderState.Options;
    }
    await axios.patch("/order/close", values)
      .then(res => {
        alertText = res.data;
      })
      .catch(err => {
        toast.error(err.response.data);
      });
    await axios.get("/orders/" + changeOrderState.EnterpriseId)
      .then(res => {
        props.updateList(res.data);
      })
      .catch(err => {
        toast.error(err.response.data);
      });
    if (openDialog === 5) {
      values.enterpriseId = changeOrderState.EnterpriseId;
      values.dateClose = "22.02.2222";
      await axios.post("/license/new", values)
        .then(res => {
          alertText += "\n" + res.data;
        })
        .catch(err => {
          toast.error(err.response.data);
        });
      await axios.get("/licenses/" + changeOrderState.EnterpriseId)
        .then(res => {
          props.updateList2(res.data);
        })
        .catch(err => {
          toast.error(err.response.data);
        });
    }
    setOpenDialog(0);
    toast.success(alertText);
  }

  return (<div>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%' } }}
        maxWidth="sm"
        open={openDialog > 0}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {openDialog === 1 && "Залишення заяви без розгляду"}
            {openDialog === 2 && "Відмовлення у розгляді заяви"}
            {openDialog === 5 && "Вкажіть дані нової ліцензії"}
          </DialogTitle>
          <DialogContent dividers>
            {openDialog === 5 && <TextField
              sx={{ width: 70, mb: 2, mr: 2 }}
              label="Серія"
              error={Boolean(errors.serLicenze?.message)}
              helperText={errors.serLicenze?.message}
              {...register('serLicenze', { required: "Обов'язкове поле" })}
              size="small"
            />}
            {openDialog === 5 && <TextField
              sx={{ width: 100, mb: 2, mr: 2 }}
              label="Номер"
              error={Boolean(errors.numLicenze?.message)}
              helperText={errors.numLicenze?.message}
              {...register('numLicenze', { required: "Обов'язкове поле" })}
              size="small"
            />}
            {openDialog === 5 && <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
              <DateField
                sx={{ mb: 2, width: 120 }}
                label="Дата видачі"
                {...register('dateLicenze', {
                  required: 'вкажіть дату у форматі ДД.ММ.РРРР',
                  pattern: { value: /^(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[012])[.](19|20)\d\d$/ }
                })}
                size="small"
              />
            </LocalizationProvider>}
            {openDialog === 5 && <TextField
              sx={{ mb: 2 }}
              select
              label="Вид діяльності, що ліцензується"
              {...register('typeLicenze', { required: "Обов'язкове поле" })}
              defaultValue={8}
              size="small"
              fullWidth
            >
              {licenseTypes.map(licType =>
                <MenuItem key={licType.Id} value={licType.Id}>{licType.LicName}</MenuItem>
              )}
            </TextField>}
            <TextField
              label={openDialog === 5 ? "Підстава" : "Додаткові дані"}
              error={Boolean(errors.options?.message)}
              helperText={errors.options?.message}
              {...register('options', { required: "Обов'язкове поле" })}
              size="small"
              fullWidth />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setOpenDialog(0)} variant="outlined">СКАСУВАТИ</Button>
            <Button disabled={!isValid} type="submit" sx={{ mr: 2 }} variant="contained">ПІДТВЕРДИТИ</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
    {editOrder === null
      ? <>
        <table className="data-table">
          <thead>
            <tr className="data-table__header">
              <th />
              <th>Дата</th>
              <th className="data-table__order-head">Подавач</th>
              <th>Стан</th>
              {currentUser.acc > 1 && <th />}
            </tr>
          </thead>
          <tbody>
            {props.source.map(order =>
              <OrdersListItem
                key={order.Id}
                order={order}
                heads={props.heads}
                setEditMode={props.setEditMode}
                setEditOrder={setEditOrder}
                setChangeOrderState={setChangeOrderState}
                setValue={setValue}
                setOpenDialog={setOpenDialog}
                setAddNewOrder={setAddNewOrder}
              />
            )}
          </tbody>
        </table>
        {currentUser.acc > 1 && <Button
          sx={{ ml: 3, mt: 3 }}
          onClick={handleButtonClick}
          variant="contained"
          startIcon={<NoteAddIcon />}
        >Додати нову заяву</Button>}
      </>
      : <OrderEdit
        order={editOrder}
        heads={props.heads}
        setEditOrder={setEditOrder}
        isNewOrder={addNewOrder}
        updateList={props.updateList}
        setEditMode={props.setEditMode}
        editor={currentUser.Id}
      />}
  </div >)
}