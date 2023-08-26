import React from "react";
import { Link } from "react-router-dom";
import { checkDate, checkStatut } from "../utils/checkers";

export const PlacesList = (props) => {

  return (
    <div>
      <h3 className="person-header">{props.role
        ? "Підприємства, де особа є/була керівником"
        : props.sequr
          ? "Підприємства, де особа є/була у числі персоналу охорони"
          : "Підприємства, де особа є/була у складі засновників"
      }</h3>
      <div className="list-item flex-end list-header">
        <div className="list-item__humanName">Підприємство</div>
        <div className="list-item__humanState">{
          props.sequr
            ? "Посада"
            : props.role
              ? "Посада, дата призначення та звільнення"
              : "Частка у Статутному капіталі, з ... по ..."
        }</div>
      </div>
      {props.source.map((item, index) =>
        <div className="list-item flex-end" key={index}>
          <div className="list-item__humanName"><Link to={`/enterprs/${item.Enterprise}`}>{item.FullName}</Link></div>
          <div className="list-item__humanState">{
            props.sequr
              ? item.Posada
              : props.role
                ? item.DateOfFire === null || ''
                  ? item.InCombination
                    ? (item.Posada + " (за сумісн.) " + checkDate(item.DateStartWork, " з "))
                    : (item.Posada + checkDate(item.DateStartWork, " з "))
                  : item.InCombination
                    ? (item.Posada + " (за сумісн.) " + checkDate(item.DateStartWork, " з ") + checkDate(item.DateOfFire, " по "))
                    : (item.Posada + checkDate(item.DateStartWork, " з ") + checkDate(item.DateOfFire, " по "))
                : item.DateOfFire === null || ''
                  ? checkStatut(item.StatutPart) + checkDate(item.DateEnter, " з ")
                  : checkStatut(item.StatutPart) + checkDate(item.DateEnter, " з ") + checkDate(item.DateExit, " по ")
          }</div>
        </div>
      )}
    </div>
  )
}