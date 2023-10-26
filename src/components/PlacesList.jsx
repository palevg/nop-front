import { Link } from "react-router-dom";
import { checkDate, checkStatut } from "../utils/checkers";

export const PlacesList = (props) => {

  function setPositionText(place) {
    let placeText;
    if (props.personType === 1) {
      placeText = checkStatut(place.StatutPart) + checkDate(place.EnterDate, " з ");
    }
    if (props.personType === 2) {
      placeText = place.Posada;
      if (place.InCombination) placeText += " (за сумісн.) ";
      placeText += checkDate(place.EnterDate, " з ");
    }
    if (props.personType === 3) {
      placeText = place.Posada + checkDate(place.EnterDate, " з ");
    }
    if (place.State === 1) placeText += checkDate(place.ExitDate, " по ");
    return placeText;
  }

  return (<>
    <h3 className="person-header">{props.personType === 3
      ? "Юридичні особи, де особа є/була у числі персоналу охорони"
      : props.personType === 2
        ? "Юридичні особи, де особа є/була керівником"
        : "Юридичні особи, де особа є/була у складі засновників"
    }</h3>
    <table className="data-table">
      <thead>
        <tr className="data-table__header">
          <th>Назва</th>
          <th>{props.personType === 1
            ? "Частка у Статутному капіталі, з ... по ..."
            : "Посада, дата призначення та звільнення"}
          </th>
        </tr>
      </thead>
      <tbody>
        {props.source.map(place =>
          <tr className="data-table__item" key={place.Id}>
            <td className="data-table__person-name"><Link to={`/enterprs/${place.Enterprise}`}>{place.FullName}</Link></td>
            <td className="data-table__person-state">{setPositionText(place)}</td>
          </tr>)}
      </tbody>
    </table>
  </>)
}