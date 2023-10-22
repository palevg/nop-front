import { useContext, useState } from "react";
import { checkDate } from "../utils/checkers";
import { licenseStates } from "../utils/data";
import { AuthContext } from "../context/authContext";
import { IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function LicensListItem({ license, setEditMode, setEditLicense, setChangeLicenseState, setReasonClose, setOpenDialog }) {
  const { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const licMenuOpen = Boolean(anchorEl);

  const handleEditLicense = row => {
    setAnchorEl(null);
    setEditLicense(row);
    setEditMode(row);
  }

  const handleChangeState = (row, newState) => {
    setAnchorEl(null);
    setChangeLicenseState(row);
    if (row.ReasonClose !== null && row.ReasonClose !== '') setReasonClose(row.ReasonClose);
    setOpenDialog(newState);
  }

  const handleShowHide = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
  }

  return (<>
    <tr className="data-table__item">
      <td className="data-table__switch">
        <label
          htmlFor={`showLicensePart${license.Id}`}
          id={`labshowLicensePart${license.Id}`}
          title="Показати розширену інформацію"
          style={{ cursor: "pointer" }}>⊕</label>
        <input className="data-table__checkbox" id={`showLicensePart${license.Id}`} type="checkbox" onClick={handleShowHide} />
      </td>
      <td className="data-table__lic-kateg">{license.Category}</td>
      <td className="data-table__lic-number">{license.SerLicenze} {license.NumLicenze}</td>
      <td className="data-table__lic-date">{checkDate(license.DateLicenz, '')}</td>
      <td className="data-table__lic-date">
        {(new Date(license.DateClose) > new Date("2222-02-20"))
          ? "безтерміново"
          : checkDate(license.DateClose, '')
        }
      </td>
      <td className="data-table__lic-state">
        {license.State === 0
          ? (new Date(license.DateClose) > new Date())
            ? licenseStates[license.State]
            : "термін дії закінчився"
          : licenseStates[license.State]
        }
      </td>
      {currentUser.acc > 1 && <td className="data-table__btn-more">
        <IconButton
          aria-label="more"
          color="primary"
          id="more-button"
          title="Операції з ліцензією"
          aria-controls={licMenuOpen ? 'licenses-menu' : undefined}
          aria-expanded={licMenuOpen ? 'true' : undefined}
          aria-haspopup="true"
          size="small"
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="licenses-menu"
          aria-labelledby="more-button"
          anchorEl={anchorEl}
          open={licMenuOpen}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleEditLicense.bind(null, license)}>
            <ListItemIcon>
              <EditIcon fontSize="inherit" />
            </ListItemIcon>Редагувати</MenuItem>
          {license.State === 0 && (new Date(license.DateClose) >= new Date()) &&
            <MenuItem onClick={handleChangeState.bind(null, license, 2)}><ListItemIcon>
              <PauseCircleOutlineIcon fontSize="inherit" />
            </ListItemIcon>Призупинити дію</MenuItem>}
          {license.State === 0 && (new Date(license.DateClose) >= new Date()) &&
            <MenuItem onClick={handleChangeState.bind(null, license, 3)}><ListItemIcon>
              <BlockIcon fontSize="inherit" />
            </ListItemIcon>Визнати недійсною</MenuItem>}
          {license.State === 0 && (new Date(license.DateClose) >= new Date()) &&
            <MenuItem onClick={handleChangeState.bind(null, license, 1)}><ListItemIcon>
              <CancelIcon fontSize="inherit" />
            </ListItemIcon>Анулювати</MenuItem>}
          {license.State === 2 && (new Date(license.DateClose) >= new Date()) &&
            <MenuItem onClick={handleChangeState.bind(null, license, 4)}><ListItemIcon>
              <PlayCircleOutlineIcon fontSize="inherit" />
            </ListItemIcon>Відновити дію</MenuItem>}
        </Menu>
      </td>}
    </tr>
    <tr className="data-table__more-info">
      <td colSpan={currentUser.acc > 1 ? 7 : 6}>
        <div>Вид діяльності, що ліцензується: {license.LicName}</div>
        <div className="data-table__small-screen">
          Термін дії: з {checkDate(license.DateLicenz, '')}{(new Date(license.DateClose) > new Date("2222-02-20"))
            ? " (безтерміново)"
            : " по " + checkDate(license.DateClose, '')
          }
        </div>
        {license.ReasonStart !== null && license.ReasonStart !== '' && <div>Підстава видачі: {license.ReasonStart}</div>}
        {license.ReasonClose !== null && license.ReasonClose !== '' && <div>Підстава передчасного припинення дії: {license.ReasonClose}</div>}
      </td>
    </tr>
  </>)
}