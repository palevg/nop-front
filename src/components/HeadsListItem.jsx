import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { checkDate, checkStatut } from "../utils/checkers";
import { IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditNoteIcon from '@mui/icons-material/EditNote';
import WorkOffIcon from '@mui/icons-material/WorkOff';

export default function HeadsListItem(props) {
  const { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const orderMenuOpen = Boolean(anchorEl);

  const handleEdit = row => {
    setAnchorEl(null);
    props.setStatePersonEditing({ person: false, place: false });
    props.setEditMode(row);
    props.setEditPerson(row);
  }

  const handleFire = row => {
    setAnchorEl(null);
    props.setFirePerson(row);
  }

  return (<tr className="data-table__item data-table__item-border">
    <td className="data-table__person-name"><Link to={`/peoples/${props.person.HumanId}`}>{props.person.Name}</Link></td>
    <td className="data-table__person-state">{props.sequr
      ? props.person.Posada
      : props.role
        ? props.active
          ? props.person.InCombination
            ? props.person.Posada + " (за сумісн.) " + checkDate(props.person.DateStartWork, " з ")
            : props.person.Posada + checkDate(props.person.DateStartWork, " з ")
          : props.person.InCombination
            ? props.person.Posada + " (за сумісн.) " + checkDate(props.person.DateStartWork, " з ") + checkDate(props.person.DateOfFire, " по ")
            : props.person.Posada + checkDate(props.person.DateStartWork, " з ") + checkDate(props.person.DateOfFire, " по ")
        : props.active
          ? checkStatut(props.person.StatutPart) + checkDate(props.person.DateEnter, " з ")
          : checkStatut(props.person.StatutPart) + checkDate(props.person.DateEnter, " з ") + checkDate(props.person.DateExit, " по ")}
    </td>
    {currentUser.acc > 1 && <td className="data-table__btn-more">
      <IconButton
        aria-label="more"
        color="primary"
        id={`more-btn${props.person.Id}`}
        title="Більше..."
        aria-controls={orderMenuOpen ? props.person.Id : undefined}
        aria-expanded={orderMenuOpen ? 'true' : undefined}
        aria-haspopup="true"
        size="small"
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={props.person.Id}
        aria-labelledby={`more-btn${props.person.Id}`}
        anchorEl={anchorEl}
        open={orderMenuOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit.bind(null, props.person)}>
          <ListItemIcon>
            <EditNoteIcon fontSize="inherit" />
          </ListItemIcon>Редагувати дані</MenuItem>
        {props.person.State === 0 && <MenuItem onClick={handleFire.bind(null, props.person)}>
          <ListItemIcon>
            <WorkOffIcon fontSize="inherit" />
          </ListItemIcon>{props.role ? "Звільнити з посади" : "Вивести зі складу засновників"}</MenuItem>}
      </Menu>
    </td>}
  </tr>)
}