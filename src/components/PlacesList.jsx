import { Link } from "react-router-dom";
import { checkDate, checkStatut } from "../utils/checkers";

export const PlacesList = (props) => {

  return (<>
    <h3 className="person-header">{props.role
      ? "Підприємства, де особа є/була керівником"
      : props.sequr
        ? "Підприємства, де особа є/була у числі персоналу охорони"
        : "Підприємства, де особа є/була у складі засновників"
    }</h3>
    <table className="data-table">
      <thead>
        <tr className="data-table__header">
          <th>Підприємство</th>
          <th>{props.sequr
            ? "Посада"
            : props.role
              ? "Посада, дата призначення та звільнення"
              : "Частка у Статутному капіталі, з ... по ..."}
          </th>
        </tr>
      </thead>
      <tbody>
        {props.source.map(place =>
          <tr className="data-table__item" key={place.Id}>
            <td className="data-table__person-name"><Link to={`/enterprs/${place.Enterprise}`}>{place.FullName}</Link></td>
            <td className="data-table__person-state">{
              props.sequr
                ? place.Posada
                : props.role
                  ? place.DateOfFire === null || ''
                    ? place.InCombination
                      ? (place.Posada + " (за сумісн.) " + checkDate(place.DateStartWork, " з "))
                      : (place.Posada + checkDate(place.DateStartWork, " з "))
                    : place.InCombination
                      ? (place.Posada + " (за сумісн.) " + checkDate(place.DateStartWork, " з ") + checkDate(place.DateOfFire, " по "))
                      : (place.Posada + checkDate(place.DateStartWork, " з ") + checkDate(place.DateOfFire, " по "))
                  : place.DateOfFire === null || ''
                    ? checkStatut(place.StatutPart) + checkDate(place.DateEnter, " з ")
                    : checkStatut(place.StatutPart) + checkDate(place.DateEnter, " з ") + checkDate(place.DateExit, " по ")}
            </td>
          </tr>)}
      </tbody>
    </table>
  </>)
}