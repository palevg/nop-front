import React, { useState } from "react";
import 'dayjs/locale/uk';
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { checkDate, checkStatut } from "../utils/checkers";
import axios from '../axios';
import { PersonEdit } from "./PersonEdit";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, IconButton } from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';


export const HeadsList = (props) => {
  const personType = props.sequr ? 3 : props.role ? 2 : 1;
  const { currentUser } = React.useContext(AuthContext);
  const [editPerson, setEditPerson] = useState(null);
  const updateEditing = (value) => { setEditPerson(value); }
  const [openDialog, setOpenDialog] = useState(false);
  const [firePerson, setFirePerson] = useState(null);
  const [dateExit, setDateExit] = useState(null);

  const handleEdit = row => {
    props.updateEditMode(row);
    setEditPerson(row);
  }

  const handleFire = row => {
    setFirePerson(row);
    setOpenDialog(true);
  }

  const handleCancel = () => {
    setOpenDialog(false);
    setDateExit(null);
  };

  const handleDialogClose = async () => {
    const fireDateISO = new Date(dateExit).toISOString().substring(0, 10);
    if (fireDateISO < (props.role ? firePerson.DateStartWork : firePerson.DateEnter)) {
      alert(props.role ? "Звільнити особу раніше, ніж вона розпочала працювати, неможливо!" :
        "Вивести особу зі складу засновників раніше, ніж вона стала співзасновником, неможливо!");
    } else {
      handleCancel();
      const values = {};
      values.role = props.role;
      values.date = fireDateISO;
      values.id = firePerson.Id;
      values.editor = currentUser.Id;
      await axios.patch("/peoples/exit", values)
        .then(res => {
          alert(res.data);
        })
        .catch(err => {
          alert(err.response.data);
        });
      await axios.get((props.role ? "/heads/" : "/founders/") + firePerson.Enterprise)
        .then(res => {
          props.updateList(res.data);
        })
        .catch(err => {
          alert(err.response.data);
        });
    }
  };

  return (
    <div>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <Dialog
          sx={{ '& .MuiDialog-paper': { width: '80%' } }}
          maxWidth="xs"
          open={openDialog}
        >
          <DialogTitle>
            Вкажіть дату {props.role ? "звільнення з посади" : "виведення зі складу засновників"}
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
      </Box>
      {editPerson === null
        ? <div>
          <div className="rowInfo list-header">
            <div className="rowInfo__humanName">Прізвище, ім'я та по-батькові</div>
            <div className="rowInfo__humanState">{
              props.sequr
                ? "Посада"
                : props.role
                  ? props.active
                    ? "Посада, дата призначення"
                    : "Посада, дата призначення та звільнення"
                  : props.active
                    ? "Частка у Статутному капіталі, з дати"
                    : "Частка у Статутному капіталі, з ... по ..."
            }</div>
          </div>
          {props.source.map((item, index) =>
            <div className="rowInfo editable" key={index} >
              <div className="rowInfo__humanName"><Link to={`/peoples/${item.HumanId}`}>{item.Name}</Link></div>
              <div className="rowInfo__humanState">{
                props.sequr
                  ? item.Posada
                  : props.role
                    ? props.active
                      ? item.InCombination
                        ? item.Posada + " (за сумісн.) " + checkDate(item.DateStartWork, " з ")
                        : item.Posada + checkDate(item.DateStartWork, " з ")
                      : item.InCombination
                        ? item.Posada + " (за сумісн.) " + checkDate(item.DateStartWork, " з ") + checkDate(item.DateOfFire, " по ")
                        : item.Posada + checkDate(item.DateStartWork, " з ") + checkDate(item.DateOfFire, " по ")
                    : props.active
                      ? checkStatut(item.StatutPart) + checkDate(item.DateEnter, " з ")
                      : checkStatut(item.StatutPart) + checkDate(item.DateEnter, " з ") + checkDate(item.DateExit, " по ")
              }</div>
              {currentUser.acc > 1 && props.buttons &&
                <div className="rowInfo__buttons">
                  <Tooltip title="Редагувати дані">
                    <IconButton size="small" color="primary" aria-label="edit" onClick={handleEdit.bind(null, item)}>
                      <EditNoteIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={props.role ? "Звільнити з посади" : "Вивести зі складу засновників"}>
                    <IconButton size="small" color="primary" aria-label="delete" onClick={handleFire.bind(null, item)}>
                      <WorkOffIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </div>}
            </div>
          )}
        </div>
        : <PersonEdit
          person={editPerson}
          personType={personType}
          simpleEdit={false}
          updateEditing={updateEditing}
          updateList={props.updateList}
          updateEditMode={props.updateEditMode}
          isNewPerson={{ person: false, place: false }}
          editor={currentUser.Id}
        />
      }
    </div>
  )
}