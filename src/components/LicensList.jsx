import React from "react";
import { checkDate } from "../utils/checkers";
import { licenseState } from "../utils/data";
import { AuthContext } from "../context/authContext";
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export const LicensesList = (props) => {
  const { currentUser } = React.useContext(AuthContext);

  return (
    <div>
      <div className="list-item flex-end list-header">
        <div className="list-item__lic-kateg">Катег.</div>
        <div className="list-item__lic-number">Серія і номер</div>
        <div className="list-item__lic-date">Діє з</div>
        <div className="list-item__lic-date">по</div>
        <div className="list-item__lic-state">Стан</div>
      </div>
      {props.source.map((item, index) =>
        <div className="list-item flex-end list-item__center" key={index}>
          <div className="list-item__lic-kateg" title={item.LicName}>{item.Category}</div>
          <div className="list-item__lic-number">{item.SerLicenze} {item.NumLicenze}</div>
          <div className="list-item__lic-date" title={item.ReasonStart}>{checkDate(item.DateLicenz, '')}</div>
          <div className="list-item__lic-date" title={item.ReasonStart}>
            {(new Date(item.DateClose) > new Date("2222-02-20"))
              ? "безтерміново"
              : checkDate(item.DateClose, '')
            }
          </div>
          <div className="list-item__lic-state" title={item.ReasonClose}>
            {item.State === 0
              ? (new Date(item.DateClose) > new Date())
                ? licenseState[item.State]
                : "термін дії закінчився"
              : licenseState[item.State]
            }
          </div>
          {currentUser.acc > 1 &&
            <div className="list-item__buttons2">
              <Tooltip title="Редагувати">
                <IconButton size="small" color="primary" aria-label="edit">
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>}
        </div>
      )}
    </div>
  )
}