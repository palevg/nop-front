import { useState } from "react";
import axios from '../axios';
import { checkDate } from "../utils/checkers";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toast } from 'react-toastify';

export default function PersonFire(props) {
  const [dateExit, setDateExit] = useState(null);

  const handleCancel = () => {
    props.setFirePerson(null);
    setDateExit(null);
  };

  const handleDialogClose = async () => {
    const fireDateISO = checkDate(new Date(dateExit), "").split(".").reverse().join("-");
    if (fireDateISO > checkDate(new Date(), "").split(".").reverse().join("-")) {
      toast.warn("Ви вказали дату, яка ще не настала!")
    } else {
      if (fireDateISO < props.firePerson.EnterDate) {
        toast.warn(props.personType === 1
          ? "Вивести особу зі складу засновників раніше, ніж вона стала співзасновником, неможливо!"
          : "Звільнити особу раніше, ніж вона розпочала працювати, неможливо!");
      } else {
        handleCancel();
        const values = {};
        values.personType = props.personType;
        values.date = fireDateISO;
        values.id = props.firePerson.Id;
        values.editor = props.editor;
        await axios.patch("/peoples/exit", values)
          .then(res => {
            toast.success(res.data);
          })
          .catch(err => {
            toast.error(err.response.data);
          });
        await axios.get((props.personType === 1
          ? "/founders/"
          : props.personType === 2
            ? "/heads/"
            : "/employees/") + props.firePerson.Enterprise)
          .then(res => {
            props.updateList(res.data);
          })
          .catch(err => {
            toast.error(err.response.data);
          });
      }
    }
  };

  return (<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%' } }}
      maxWidth="xs"
      open={Boolean(props.firePerson)}
    >
      <DialogTitle>
        Вкажіть дату {props.personType === 1 ? "виведення зі складу засновників" : "звільнення з посади"}
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DateField
            sx={{ width: 150, ml: 15 }}
            value={dateExit}
            onChange={(newValue) => setDateExit(newValue)}
            size="small"
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} variant="outlined">СКАСУВАТИ</Button>
        <Button onClick={handleDialogClose} disabled={isNaN(dateExit) || Boolean(dateExit === null)} variant="contained">ПІДТВЕРДИТИ</Button>
      </DialogActions>
    </Dialog>
  </Box>)
}