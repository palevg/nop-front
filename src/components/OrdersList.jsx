import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import 'dayjs/locale/uk';
import { AuthContext } from "../context/authContext";
import { checkDate } from "../utils/checkers";
import { orderState, orderType, licenseType } from "../utils/data";
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions, Tooltip, IconButton } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BlockIcon from '@mui/icons-material/Block';
import { OrderEdit } from "./OrderEdit";
import axios from '../axios';
import { toast } from "react-toastify";

export const OrdersList = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [openDialog, setOpenDialog] = useState(0);
  const [editOrder, setEditOrder] = useState(null);
  const updateEditing = (value) => { setEditOrder(value); }
  const [valueDateLicense, setValueDateLicense] = useState(null);
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

  const handleEdit = row => {
    if (props.heads.length > 0) {
      props.updateEditMode(row);
      setEditOrder(row);
    }
    else toast.warn("Для можливості редагування заяв внесіть дані про хоча б одного керівника цієї юридичної особи!");
  }

  const handleTake = async row => {
    if (row.HumanId !== 0) {
      let possibleTake = true;
      await axios.get("/founders/" + row.EnterpriseId)
        .then(res => {
          const dataRes = res.data;
          if (dataRes.filter(dataRes => dataRes.State === 0).length === 0) possibleTake = false;
        })
        .catch(err => {
          toast.error(err.response.data);
        });
      if (!possibleTake)
        await axios.get("/foundersent/" + row.EnterpriseId)
          .then(res => {
            const dataRes = res.data;
            if (dataRes.filter(dataRes => dataRes.State === 0).length === 0) {
              toast.warn("Для можливості видачі ліцензії внесіть дані про засновників цієї юридичної особи!");
            } else possibleTake = true;
          })
          .catch(err => {
            toast.error(err.response.data);
          });
      if (possibleTake) {
        setChangeOrderState(row);
        setValue('options', '');
        setOpenDialog(5);
      }
    } else toast.warn("Для можливості зміни статусу заяви та видачі ліцензії внесіть всі необхідні дані про цю заяву!");
  }

  const handleTrial = row => {
    if (row.HumanId !== 0) {
      setChangeOrderState(row);
      setValue('options', row.Options);
      setOpenDialog(1);
    }
    else toast.warn("Для можливості зміни статусу заяви внесіть всі необхідні дані про цю заяву!");
  }

  const handleRefuse = row => {
    if (row.HumanId !== 0) {
      setChangeOrderState(row);
      setValue('options', row.Options);
      setOpenDialog(2)
    }
    else toast.warn("Для можливості зміни статусу заяви внесіть всі необхідні дані про цю заяву!");
  }

  const handleChange = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
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

  const handleCancelClick = () => {
    setOpenDialog(0);
  };

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
                value={valueDateLicense}
                onChange={(newValue) => setValueDateLicense(newValue)}
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
              {licenseType.map((option, index) => (
                <MenuItem key={index} value={++index}>{option}</MenuItem>
              ))}
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
            <Button type="button" onClick={handleCancelClick} variant="outlined">СКАСУВАТИ</Button>
            <Button disabled={!isValid} type="submit" sx={{ mr: 2 }} variant="contained">ПІДТВЕРДИТИ</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
    {
      editOrder === null
        ? <div>
          <div className="list-item flex-end list-header">
            <div className="list-item__order-date" style={{ marginLeft: 28 }}>Дата</div>
            <div className="list-item__order-head">Подавач</div>
            <div className="list-item__order-state">Стан</div>
            {currentUser.acc > 1 && <div className="list-item__buttons4" />}
          </div>
          {props.source.map((item, index) =>
            <div className="list-item" key={index}>
              <div className="list-item__visible">
                {item.HumanId !== 0 || !(item.Options === null || item.Options === '')
                  ? <label className="list-item__switch" htmlFor={"showOrderPart" + index} id={"labshowOrderPart" + index} title="Показати розширену інформацію">⊕</label>
                  : <div className="list-item__switch" />
                }
                <div className="list-item__visible-data list-item__center">
                  <div className="list-item__order-date">{checkDate(item.DateZajav, '')}</div>
                  <div className="list-item__order-head"><Link to={`/peoples/${item.HumanId}`}>{item.Name}</Link></div>
                  <div className="list-item__order-state">{orderState[item.State]}</div>
                </div>
                {currentUser.acc > 1 &&
                  <div className="list-item__buttons4">
                    <Tooltip title="Редагувати">
                      <IconButton size="small" color="primary" aria-label="edit" onClick={handleEdit.bind(null, item)}>
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    {item.State === 0 && <Tooltip title="Задовольнити заяву - видати ліцензію">
                      <IconButton size="small" color="primary" aria-label="delete" onClick={handleTake.bind(null, item)}>
                        <VerifiedIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>}
                    {item.State === 0 && <Tooltip title="Залишити заяву без розгляду">
                      <IconButton size="small" color="primary" aria-label="withoutTrial" onClick={handleTrial.bind(null, item)}>
                        <VisibilityOffIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>}
                    {item.State === 0 && <Tooltip title="Відмовити у задоволенні заяви">
                      <IconButton size="small" color="primary" aria-label="refuse" onClick={handleRefuse.bind(null, item)}>
                        <BlockIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>}
                  </div>}
              </div>
              <input className="list-item__checkbox" id={"showOrderPart" + index} type="checkbox" onClick={handleChange} />
              <div className="list-item__invisible">
                <div>Заява щодо {orderType[item.OrderType]} категорії {item.Category}</div>
                {item.NumZajav !== null && <div>Реєстраційний номер: {item.NumZajav}</div>}
                {item.HumanId !== 0 && <div className="list-item__invisible-info">Подавач: <Link to={`/peoples/${item.HumanId}`}>{item.Name}</Link></div>}
                {item.Options === null || item.Options === '' ? <></> : <div>Додаткова інформація: {item.Options}</div>}
              </div>
            </div>
          )}
        </div>
        : <OrderEdit
          order={editOrder}
          heads={props.heads}
          updateEditing={updateEditing}
          updateList={props.updateList}
          updateEditMode={props.updateEditMode}
          editor={currentUser.Id}
        />
    }
  </div >
  )
}