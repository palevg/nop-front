import { useState, useEffect } from "react";
import Loader from './UI/Loader/Loader';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import axios from '../axios';

export const EnterprsAfil = (props) => {
  const [enterprNames, setEnterprNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [listAfilEnterprs] = useState(props.afil.map(item => item.Id));
  const [listAfilEnterprsBase] = useState(props.afil.map(item => item.Id));

  const getEnterprList = async () => {
    const { data } = await axios.get('/enterprlist/' + props.id);
    setEnterprNames(data);
    setFilteredNames(data);
  }

  const handleChangeName = (value) => {
    setSearchValue(value);
    setFilteredNames(enterprNames.filter(item => item.FullName.toLowerCase().includes(value)));
  }

  const changeList = (item) => {
    const changedCheckBox = document.getElementById("cb" + item);
    if (changedCheckBox.checked) {
      listAfilEnterprs.push(item);
    } else {
      listAfilEnterprs.splice(listAfilEnterprs.indexOf(item), 1);
    }
  }

  const handleSubmit = async () => {
    props.setOpenDialog(false);
    const isEqual = listAfilEnterprs.length === listAfilEnterprsBase.length &&
      listAfilEnterprs.every((value) => listAfilEnterprsBase.filter(item => item === value).length === 1);
    if (!isEqual) {
      await axios.post("/enterprs/listafil", { list: listAfilEnterprs.join(",") })
        .then(res => {
          props.updateList(res.data);
        })
        .catch(err => {
          window.alert(err.response.data);
        });
    }
  }

  useEffect(() => {
    getEnterprList();
  }, []);

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '90%' } }}
        maxWidth="md"
        open={props.open}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Виберіть афільовані юридичні особи зі списку
        </DialogTitle>
        <DialogContent dividers>
          {enterprNames.length > 0
            ? <div>
              <TextField
                sx={{ mb: 2 }}
                label="Пошук у назві юридичної особи (будь-які символи окрім великих літер)"
                value={searchValue}
                onChange={(event) => handleChangeName(event.target.value.replace(/[A-ZА-ЯІЇЄ']/g, ""))}
                size="small"
                fullWidth />
              <div className="enterprs-list-wrap">
                <div className="enterprs-list-wrap__content">
                  {filteredNames.map(item =>
                    <div className="enterprs-list-wrap__item" key={item.Id}>
                      <input type="checkbox" id={"cb" + item.Id} onClick={() => changeList(item.Id)}
                        defaultChecked={listAfilEnterprs.filter(listAfilEnterprs => listAfilEnterprs === item.Id).length > 0}
                      />
                      <label htmlFor={"cb" + item.Id}>{item.FullName + " (код " + item.Ident + ")"}</label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            : <div>
              <h1 className="info_message">Зачекайте, йде завантаження даних...</h1>
              <Loader />
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setOpenDialog(false)} variant="outlined">СКАСУВАТИ</Button>
          <Button onClick={handleSubmit} sx={{ mr: 2 }} variant="contained">ПІДТВЕРДИТИ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}