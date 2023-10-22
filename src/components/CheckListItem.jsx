import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { checkDate } from "../utils/checkers";
import { checkTypes, pointsLicUmOldText, pointsLicUm365Text } from "../utils/data";
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const checkPointsLU = (pointLicUm, pointText) => {
  let resText = '';
  pointLicUm.forEach((item, index) => {
    if (item) {
      if (resText !== '') resText += ', ';
      resText += pointText[index];
    }
  });
  return resText;
}

export default function CheckListItem({ check, setEditCheck, setEditMode }) {
  const { currentUser } = useContext(AuthContext);

  const handleChange = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
  }

  const handleEdit = row => {
    setEditMode(row);
    setEditCheck(row);
  }

  return (<>
    <tr className="data-table__item" key={check.Id}>
      <td className="data-table__switch">
        <label htmlFor={"showCheckPart" + check.Id} id={"labshowCheckPart" + check.Id} title="Показати розширену інформацію">⊕</label>
        <input className="data-table__checkbox" id={"showCheckPart" + check.Id} type="checkbox" onClick={handleChange} />
      </td>
      <td className="data-table__check-type">{checkTypes[check.CheckType]}</td>
      <td className="data-table__check-doc">{checkDate(check.CheckSertificateDate, "від ")} № {check.CheckSertificateNo}</td>
      <td className="data-table__checker">{check.Checker}</td>
      {currentUser.acc > 1 && <td className="data-table__btn-more">
        <Tooltip title="Редагувати">
          <IconButton size="small" color="primary" aria-label="edit" onClick={handleEdit.bind(null, check)}>
            <EditIcon fontSize="inherit" />
          </IconButton>
        </Tooltip></td>}
    </tr>
    <tr className="data-table__more-info">
      <td colSpan={currentUser.acc > 1 ? 5 : 4}>
        <div className="data-table__small-screen">Посвідчення на перевірку {checkDate(check.CheckSertificateDate, "від ")} № {check.CheckSertificateNo}</div>
        <div>Перевірка проведена{check.StartCheckDate === check.EndCheckDate
          ? checkDate(check.StartCheckDate, " ")
          : checkDate(check.StartCheckDate, " з ") + checkDate(check.EndCheckDate, " по ")
        }, акт №{check.CheckActNo}</div>
        <div>Перевірялось дотримання вимог Ліцензійних умов ({check.LicUmov === 0
          ? check.CheckSertificateDate < "2009-12-01"
            ? "спільний наказ Держкомпідприємництва та МВС України від 14.12.2004 №145/1501"
            : "наказ МВС України від 01.12.2009 №505"
          : "наказ МВС України від 15.04.2013 №365"
        })</div>
        {check.CheckObjCount
          ? <div>Кількість об'єктів із фізичними постами охорони, де також здійснено перевірку: {check.CheckObjCount}</div>
          : <></>
        }
        <div>{check.NoViolations
          ? "Під час перевірки порушень не виявлено."
          : "Під час перевірки виявлено порушення пунктів Ліцензійних умов: " + (check.LicUmov === 0
            ? checkPointsLU([check.P211, check.P212, check.P213, check.P214, check.P215, check.P221, check.P222, check.P223,
            check.P224, check.P225, check.P226, check.P31, check.P32, check.P33, check.P34, check.P35, check.P44,
            check.P451, check.P452, check.P453, check.P456, check.P461, check.P462, check.P463, check.P464, check.P471,
            check.P472, check.P473, check.P474, check.P475, check.P476, check.P477, check.P478], pointsLicUmOldText)
            : checkPointsLU([check.P211, check.P212, check.P213, check.P214, check.P221, check.P222, check.P223, check.P215,
            check.P224, check.P225, check.P226, check.P452, check.P453, check.P456, check.P461, check.P462, check.P463,
            check.P31, check.P32, check.P33, check.P34, check.P35, check.P44, check.P451, check.P464, check.P471,
            check.P472, check.P473, check.P474, check.P475, check.P476, check.P477, check.P478, check.N429, check.N4210,
            check.N4211, check.N4212, check.N4213, check.N4214, check.N4215, check.N4216, check.N4217], pointsLicUm365Text))
        }</div>
        {checkDate(check.CheckRozporDate, "") && <div>Видано розпорядження про усунення порушень{checkDate(check.CheckRozporDate, " від ")} №{check.CheckRozporNo}</div>}
        {checkDate(check.CheckRozporDateAnswer, "") && <div>Дата надходження відповіді на розпорядження: {checkDate(check.CheckRozporDateAnswer, "")}</div>}
        {check.Content !== null && <div>Додаткова інформація: {check.Content}</div>}
      </td>
    </tr>
  </>)
}