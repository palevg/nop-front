import { useContext, useState } from "react";
import { checkDate } from "../utils/checkers";
import { licenseState } from "../utils/data";
import { AuthContext } from "../context/authContext";
import { Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import axios from '../axios';
import { toast } from "react-toastify";
import { LicenseEdit } from "./LicenseEdit";

export const LicensesList = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(0);
  const [editLicense, setEditLicense] = useState(null);
  const updateEditing = (value) => { setEditLicense(value); }
  const [changeLicenseState, setChangeLicenseState] = useState(null);
  const [reasonClose, setReasonClose] = useState('');

  const handleEditLicense = row => {
    setEditLicense(row);
    props.updateEditMode(row);
  }

  const handleChangeState = (row, newState) => {
    setChangeLicenseState(row);
    if (row.ReasonClose !== null && row.ReasonClose !== '') setReasonClose(row.ReasonClose);
    setOpenDialog(newState);
  }

  const handleShowHide = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
  }

  const onSubmit = async () => {
    const values = {}
    openDialog === 4 ? values.state = 0 : values.state = openDialog;
    values.reasonClose = reasonClose;
    values.editor = currentUser.Id;
    values.id = changeLicenseState.Id;
    await axios.patch("/license/state", values)
      .then(res => {
        toast.success(res.data);
      })
      .catch(err => {
        toast.error(err.response.data);
      });
    await axios.get("/licenses/" + changeLicenseState.EnterpriseId)
      .then(res => {
        props.updateList(res.data);
      })
      .catch(err => {
        toast.error(err.response.data);
      });
    setOpenDialog(0);
  }

  return (<div>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%' } }}
        maxWidth="sm"
        open={openDialog > 0}
      >
        <DialogTitle>
          {openDialog === 1 && `Анулювати ліцензію ${changeLicenseState.SerLicenze} ${changeLicenseState.NumLicenze}`}
          {openDialog === 2 && `Призупинити дію ліцензії ${changeLicenseState.SerLicenze} ${changeLicenseState.NumLicenze}`}
          {openDialog === 3 && `Визнати ліцензію ${changeLicenseState.SerLicenze} ${changeLicenseState.NumLicenze} недійсною`}
          {openDialog === 4 && `Відновити дію призупиненої ліцензії ${changeLicenseState.SerLicenze} ${changeLicenseState.NumLicenze}`}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Підстава (у т.ч. назва НПА органу ліцензування, його дата і номер)"
            helperText={openDialog === 1 ? "Наприклад: по заяві - наказ МВС від 01.02.2001 №101" : openDialog === 3 ? "Наприклад: непереоформлення у строк - наказ МВС від 01.02.2001 №101" : "Наприклад: у зв'язку з ... - наказ МВС від 01.02.2001 №101"}
            value={reasonClose}
            onChange={(event) => setReasonClose(event.target.value)}
            inputProps={{ type: "search" }}
            size="small"
            autoFocus
            fullWidth />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setOpenDialog(0)} variant="outlined">СКАСУВАТИ</Button>
          <Button disabled={reasonClose === ''} onClick={onSubmit} sx={{ mr: 2 }} variant="contained">ПІДТВЕРДИТИ</Button>
        </DialogActions>
      </Dialog>
    </Box>
    {editLicense === null
      ? <>
        <div className="list-item flex-end list-header">
          <div className="list-item__lic-kateg" style={{ marginLeft: 28 }}>Катег.</div>
          <div className="list-item__lic-number">Серія і номер</div>
          <div className="list-item__lic-date">Діє з</div>
          <div className="list-item__lic-date">по</div>
          <div className="list-item__lic-state">Стан</div>
          {currentUser.acc > 1 && <div className="list-item__buttons4" />}
        </div>
        {props.source.map((item, index) =>
          <div className="list-item" key={index}>
            <div className="list-item__visible">
              <label className="list-item__switch" htmlFor={"showLicensePart" + index} id={"labshowLicensePart" + index} title="Показати розширену інформацію">⊕</label>
              <div className="list-item__visible-data list-item__center">
                <div className="list-item__lic-kateg">{item.Category}</div>
                <div className="list-item__lic-number">{item.SerLicenze} {item.NumLicenze}</div>
                <div className="list-item__lic-date">{checkDate(item.DateLicenz, '')}</div>
                <div className="list-item__lic-date">
                  {(new Date(item.DateClose) > new Date("2222-02-20"))
                    ? "безтерміново"
                    : checkDate(item.DateClose, '')
                  }
                </div>
                <div className="list-item__lic-state">
                  {item.State === 0
                    ? (new Date(item.DateClose) > new Date())
                      ? licenseState[item.State]
                      : "термін дії закінчився"
                    : licenseState[item.State]
                  }
                </div>
              </div>
              {currentUser.acc > 1 &&
                <div className="list-item__buttons4">
                  <Tooltip title="Редагувати">
                    <IconButton size="small" color="primary" aria-label="edit" onClick={handleEditLicense.bind(null, item)}>
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  {item.State === 0 && (new Date(item.DateClose) >= new Date()) && <Tooltip title="Призупинити дію">
                    <IconButton size="small" color="primary" aria-label="edit" onClick={handleChangeState.bind(null, item, 2)}>
                      <PauseCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>}
                  {item.State === 0 && (new Date(item.DateClose) >= new Date()) && <Tooltip title="Визнати недійсною">
                    <IconButton size="small" color="primary" aria-label="edit" onClick={handleChangeState.bind(null, item, 3)}>
                      <BlockIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>}
                  {item.State === 0 && (new Date(item.DateClose) >= new Date()) && <Tooltip title="Анулювати">
                    <IconButton size="small" color="primary" aria-label="edit" onClick={handleChangeState.bind(null, item, 1)}>
                      <CancelIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>}
                  {item.State === 2 && (new Date(item.DateClose) >= new Date()) && <Tooltip title="Відновити дію">
                    <IconButton size="small" color="primary" aria-label="edit" onClick={handleChangeState.bind(null, item, 4)}>
                      <PlayCircleOutlineIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>}
                </div>}
            </div>
            <input className="list-item__checkbox" id={"showLicensePart" + index} type="checkbox" onClick={handleShowHide} />
            <div className="list-item__invisible">
              <div>Вид діяльності, що ліцензується: {item.LicName}</div>
              <div className="list-item__invisible-info">
                Термін дії: з {checkDate(item.DateLicenz, '')}{(new Date(item.DateClose) > new Date("2222-02-20"))
                  ? " (безтерміново)"
                  : " по " + checkDate(item.DateClose, '')
                }
              </div>
              {item.ReasonStart !== null && item.ReasonStart !== '' && <div>Підстава видачі: {item.ReasonStart}</div>}
              {item.ReasonClose !== null && item.ReasonClose !== '' && <div>Підстава передчасного припинення дії: {item.ReasonClose}</div>}
            </div>
          </div>
        )}
      </>
      : <LicenseEdit
        license={editLicense}
        updateEditing={updateEditing}
        updateList={props.updateList}
        updateEditMode={props.updateEditMode}
        editor={currentUser.Id}
      />
    }
  </div>
  )
}