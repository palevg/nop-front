import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import CheckEdit from "./CheckEdit";
import CheckListItem from "./CheckListItem";

export default function CheckList(props) {
  const { currentUser } = useContext(AuthContext);
  const [editCheck, setEditCheck] = useState(null);

  return editCheck === null
    ? <>
      <table className="data-table">
        <thead>
          <tr className="data-table__header">
            <th />
            <th>Вид перевірки</th>
            <th className="data-table__check-doc">Посвідчення на перевірку</th>
            <th>Голова комісії</th>
            {currentUser.acc > 1 && <th />}
          </tr>
        </thead>
        <tbody>
          {props.source.map(check =>
            <CheckListItem
              key={check.Id}
              check={check}
              setEditCheck={setEditCheck}
              setEditMode={props.setEditMode}
            />
          )}
        </tbody>
      </table>
    </>
    : <CheckEdit
      check={editCheck}
      setEditCheck={setEditCheck}
      updateList={props.updateList}
      setEditMode={props.setEditMode}
      editor={currentUser.Id}
    />
}