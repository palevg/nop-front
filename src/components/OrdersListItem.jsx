import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { checkDate } from "../utils/checkers";
import { orderStates, orderTypes } from "../utils/data";
import { IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BlockIcon from '@mui/icons-material/Block';
import axios from '../axios';
import { toast } from "react-toastify";

export default function OrdersListItem({ order, heads, setEditMode, setEditOrder, setChangeOrderState, setValue, setOpenDialog, setAddNewOrder }) {
  const { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const orderMenuOpen = Boolean(anchorEl);

  const handleChange = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
  }

  const handleEdit = row => {
    setAnchorEl(null);
    if (heads.length > 0) {
      setAddNewOrder(false);
      setEditMode(row);
      setEditOrder(row);
    }
    else toast.warn("Для можливості редагування заяв внесіть дані про хоча б одного керівника цієї юридичної особи!");
  }

  const handleTake = async row => {
    setAnchorEl(null);
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
    setAnchorEl(null);
    if (row.HumanId !== 0) {
      setChangeOrderState(row);
      setValue('options', row.Options);
      setOpenDialog(1);
    }
    else toast.warn("Для можливості зміни статусу заяви внесіть всі необхідні дані про цю заяву!");
  }

  const handleRefuse = row => {
    setAnchorEl(null);
    if (row.HumanId !== 0) {
      setChangeOrderState(row);
      setValue('options', row.Options);
      setOpenDialog(2)
    }
    else toast.warn("Для можливості зміни статусу заяви внесіть всі необхідні дані про цю заяву!");
  }

  return (<>
    <tr className="data-table__item">
      <td className="data-table__switch">
        <label htmlFor={"showOrderPart" + order.Id} id={"labshowOrderPart" + order.Id} title="Показати розширену інформацію">⊕</label>
        <input className="data-table__checkbox" id={"showOrderPart" + order.Id} type="checkbox" onClick={handleChange} />
      </td>
      <td className="data-table__order-date">{checkDate(order.DateZajav, '')}</td>
      <td className="data-table__order-head"><Link to={`/peoples/${order.HumanId}`}>{order.Name}</Link></td>
      <td className="data-table__order-state">{orderStates[order.State]}</td>
      {currentUser.acc > 1 && <td className="data-table__btn-more">
        <IconButton
          aria-label="more"
          color="primary"
          id="more-button"
          title="Операції із заявою"
          aria-controls={orderMenuOpen ? order.Id : undefined}
          aria-expanded={orderMenuOpen ? 'true' : undefined}
          aria-haspopup="true"
          size="small"
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={order.Id}
          aria-labelledby="more-button"
          anchorEl={anchorEl}
          open={orderMenuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleEdit.bind(null, order)}>
            <ListItemIcon>
              <EditIcon fontSize="inherit" />
            </ListItemIcon>Редагувати</MenuItem>
          {order.State === 0 && <MenuItem onClick={handleTake.bind(null, order)}>
            <ListItemIcon>
              <VerifiedIcon fontSize="inherit" />
            </ListItemIcon>Задовольнити заяву - видати ліцензію</MenuItem>}
          {order.State === 0 && <MenuItem onClick={handleTrial.bind(null, order)}>
            <ListItemIcon>
              <VisibilityOffIcon fontSize="inherit" />
            </ListItemIcon>Залишити заяву без розгляду</MenuItem>}
          {order.State === 0 && <MenuItem onClick={handleRefuse.bind(null, order)}>
            <ListItemIcon>
              <BlockIcon fontSize="inherit" />
            </ListItemIcon>Відмовити у задоволенні заяви</MenuItem>}
        </Menu>
      </td>}
    </tr>
    <tr className="data-table__more-info">
      <td colSpan={currentUser.acc > 1 ? 5 : 4}>
        <div>Заява щодо {orderTypes[order.OrderType]} категорії {order.Category}</div>
        {order.NumZajav !== null && <div>Реєстраційний номер: {order.NumZajav}</div>}
        {order.HumanId !== 0 && <div className="data-table__small-screen">Подавач: <Link to={`/peoples/${order.HumanId}`}>{order.Name}</Link></div>}
        {order.Options === null || order.Options === '' ? <></> : <div>Додаткова інформація: {order.Options}</div>}
      </td>
    </tr>
  </>)
}