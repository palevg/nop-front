import React from "react";
import { checkDate, checkStatut } from "../utils/checkers";

export const EntFoundersList = (props) => {

  return (
    <div>
      {props.source.map((item, index) =>
        <div className="rowFounderE" key={index}>
          <div className="rowFounderE__entr-name">
            <div>{item.Name}</div>
            {item.OKPO !== null && <div className="">Реєстраційний код: {item.OKPO}</div>}
          </div>
          <div className="rowFounderE__one-row">
            <div className="rowFounderE__row-name">Адреса:</div>
            <div>{item.Address}</div>
          </div>
          <div className="rowFounderE__one-row">
            <div className="rowFounderE__row-name">Представник:</div>
            <div>{item.Predstavnik}</div>
          </div>
          {item.StatutPart !== null && <div>Частка у Статутному капіталі: {checkStatut(item.StatutPart)}{checkDate(item.DateEnter, " з ")}
            {props.active
              ? ''
              : checkDate(item.DateExit, " по ")
            }
          </div>}
        </div>
      )}

    </div>
  )
}