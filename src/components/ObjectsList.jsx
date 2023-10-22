import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import ObjectsListItem from "./ObjectsListItem";

export const ObjectsList = (props) => {
  const { currentUser } = useContext(AuthContext);

  return (<table className="data-table">
    <thead>
      <tr className="data-table__header">
        <th />
        <th className="data-table__obj-type">Тип об'єкта</th>
        <th className="data-table__obj-addr">Адреса</th>
        <th>Станом на</th>
        {currentUser.acc > 1 && <th />}
      </tr>
    </thead>
    <tbody>
      {props.source.map(object =>
        <ObjectsListItem
          key={object.Id}
          object={object}
        />
      )}
    </tbody>
  </table>)
}