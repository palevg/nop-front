import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { checkDate } from "../utils/checkers";
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default function ObjectsListItem({ object }) {
  const { currentUser } = useContext(AuthContext);

  const handleChange = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
  }

  return (<>
    <tr className="data-table__item">
      <td className="data-table__switch">
        {(object.Name || object.Director || object.Phone) !== null &&
          <label htmlFor={"showObjPart" + object.Id} id={"labshowObjPart" + object.Id} title="Показати розширену інформацію">⊕</label>}
        <input className="data-table__checkbox" id={"showObjPart" + object.Id} type="checkbox" onClick={handleChange} />
      </td>
      <td className="data-table__obj-type">{object.ObjectType}</td>
      <td className="data-table__obj-addr">{object.Address}</td>
      <td className="data-table__obj-date">{checkDate(object.DateInfo, "")}</td>
      {currentUser.acc > 1 && <td className="data-table__btn-more">
        <Tooltip title="Редагувати">
          <IconButton size="small" color="primary" aria-label="edit">
            <EditIcon fontSize="inherit" />
          </IconButton>
        </Tooltip></td>}
    </tr>
    <tr className="data-table__more-info">
      <td colSpan={currentUser.acc > 1 ? 5 : 4}>
        <div className="data-table__small-screen">Адреса: {object.Address}</div>
        {(object.Name || object.Director || object.Phone) !== null && <>
          {object.Name && <div>Замовник: {object.Name}</div>}
          {(object.Director || object.Phone) !== null && <>
            {object.Director
              ? <div>Керівник: {object.Director}
                {object.Phone && `, тел.${object.Phone}`}
              </div>
              : object.Phone && `Тел.${object.Phone}`}
          </>}
        </>}
      </td>
    </tr>
  </>)
}