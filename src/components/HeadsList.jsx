import React from "react";
import { Link } from "react-router-dom";
import { Tooltip, IconButton } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import { AuthContext } from "../context/authContext";
import { checkDate, checkStatut } from "../utils/checkers";
import { PersonEdit } from "./PersonEdit";

export const HeadsList = (props) => {
  const personType = props.sequr ? 3 : props.role ? 2 : 1;
  const { currentUser } = React.useContext(AuthContext);
  const [editPerson, setEditPerson] = React.useState(null);
  const updateEditing = (value) => { setEditPerson(value); }

  const handleEdit = row => {
    setEditPerson(row);
  }

  const handleFire = row => {
    console.log('звільняємо ', row.HumanId, ' ', row.Name);
  }

  return (
    <div>
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
      {editPerson !== null && <PersonEdit
        person={editPerson}
        personType={personType}
        updateEditing={updateEditing}
        updateList={props.updateList}
        isNewPerson={false}
        editor={currentUser.Id} />
      }
    </div>
  )
}