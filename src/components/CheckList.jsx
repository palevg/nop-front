import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Button } from "@mui/material";
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import CheckEdit from "./CheckEdit";
import CheckListItem from "./CheckListItem";

export default function CheckList(props) {
  const { currentUser } = useContext(AuthContext);
  const [editCheck, setEditCheck] = useState(null);
  const [addNewCheck, setAddNewCheck] = useState(false);

  const handleButtonClick = () => {
    setAddNewCheck(true);
    props.setEditMode(true);
    setEditCheck({
      EnterpriseID: props.enterprId,
      CheckSertificateDate: null, CheckSertificateNo: null, CheckType: 0,
      StartCheckDate: null, EndCheckDate: null, CheckActNo: null, Checker: null,
      CheckObjCount: 0, NoViolations: 0, LicUmov: 1, P211: 0, P212: 0, P213: 0, P214: 0, P215: 0,
      P221: 0, P222: 0, P223: 0, P224: 0, P225: 0, P226: 0, P31: 0, P32: 0, P33: 0, P34: 0, P35: 0,
      P44: 0, P451: 0, P452: 0, P453: 0, P456: 0, P461: 0, P462: 0, P463: 0, P464: 0, P471: 0,
      P472: 0, P473: 0, P474: 0, P475: 0, P476: 0, P477: 0, P478: 0, N429: 0, N4210: 0, N4211: 0,
      N4212: 0, N4213: 0, N4214: 0, N4215: 0, N4216: 0, N4217: 0, Content: null,
      CheckRozporDate: null, CheckRozporNo: null, CheckRozporDateAnswer: null
    });

  }

  return editCheck === null
    ? <>
      {props.source.length > 0
        ? <table className="data-table">
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
                setAddNewCheck={setAddNewCheck}
              />
            )}
          </tbody>
        </table>
        : <div className="block-header">Перевірок діяльності юридичної особи не було</div>}
      {currentUser.acc > 1 && <Button
        sx={{ ml: 3, mt: 3 }}
        onClick={handleButtonClick}
        variant="contained"
        startIcon={<AddModeratorIcon />}
      >Додати нову перевірку</Button>}
    </>
    : <CheckEdit
      check={editCheck}
      setEditCheck={setEditCheck}
      isNewCheck={addNewCheck}
      updateList={props.updateList}
      setEditMode={props.setEditMode}
      editor={currentUser.Id}
    />
}