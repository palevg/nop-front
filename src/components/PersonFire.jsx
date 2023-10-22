import { useState } from "react";
import axios from '../axios';
import { checkDate } from "../utils/checkers";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toast } from 'react-toastify';

export default function PersonFire({ firePerson, setFirePerson, role, updateList, editor }) {
  const [dateExit, setDateExit] = useState(null);

  const handleCancel = () => {
    setFirePerson(null);
    setDateExit(null);
  };

  const handleDialogClose = async () => {
    const fireDateISO = checkDate(new Date(dateExit), "").split(".").reverse().join("-");
    if (fireDateISO > checkDate(new Date(), "").split(".").reverse().join("-")) {
      toast.warn("Ви вказали дату, яка ще не настала!")
    } else {
      if (fireDateISO < (role ? firePerson.DateStartWork : firePerson.DateEnter)) {
        toast.warn(role ? "Звільнити особу раніше, ніж вона розпочала працювати, неможливо!" :
          "Вивести особу зі складу засновників раніше, ніж вона стала співзасновником, неможливо!");
      } else {
        handleCancel();
        const values = {};
        values.role = role;
        values.date = fireDateISO;
        values.id = firePerson.Id;
        values.editor = editor;
        await axios.patch("/peoples/exit", values)
          .then(res => {
            toast.success(res.data);
          })
          .catch(err => {
            toast.error(err.response.data);
          });
        await axios.get((role ? "/heads/" : "/founders/") + firePerson.Enterprise)
          .then(res => {
            updateList(res.data);
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
      open={Boolean(firePerson)}
    >
      <DialogTitle>
        Вкажіть дату {role ? "звільнення з посади" : "виведення зі складу засновників"}
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