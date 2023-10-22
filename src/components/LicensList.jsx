import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import axios from '../axios';
import { toast } from "react-toastify";
import { LicenseEdit } from "./LicenseEdit";
import LicensListItem from "./LicensListItem";

export const LicensesList = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(0);
  const [editLicense, setEditLicense] = useState(null);
  const [changeLicenseState, setChangeLicenseState] = useState(null);
  const [reasonClose, setReasonClose] = useState('');

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

  return (<>
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
        <table className="data-table">
          <thead>
            <tr className="data-table__header">
              <th />
              <th>Катег.</th>
              <th>Серія і номер</th>
              <th className="data-table__lic-date">Діє з</th>
              <th className="data-table__lic-date">по</th>
              <th>Стан</th>
              {currentUser.acc > 1 && <th />}
            </tr>
          </thead>
          <tbody>
            {props.source.map(license =>
              <LicensListItem
                key={license.Id}
                license={license}
                setEditMode={props.setEditMode}
                setEditLicense={setEditLicense}
                setChangeLicenseState={setChangeLicenseState}
                setReasonClose={setReasonClose}
                setOpenDialog={setOpenDialog}
              />
            )}
          </tbody>
        </table>
      </>
      : <LicenseEdit
        license={editLicense}
        setEditLicense={setEditLicense}
        updateList={props.updateList}
        setEditMode={props.setEditMode}
        editor={currentUser.Id}
      />
    }
  </>)
}