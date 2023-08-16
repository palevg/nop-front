import React from "react";
import { checkDate } from "../utils/checkers";
import { checkType, pointsLicUmText } from "../utils/data";

const checkPointsLU = (pointLicUm, pointText) => {
  let resText = '';
  pointLicUm.map((item, index) => {
    if (item) {
      if (resText !== '') resText += ', ';
      resText += pointText[index];
    }
  });
  return resText;
}

export const CheckList = (props) => {

  const handleChange = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
  }

  return (
    <div>
      <div className="rowInfo check-header">
        <div className="list-item__switch" />
        <div className="rowInfo__check-type">Вид перевірки</div>
        <div className="rowInfo__check-doc">Посвідчення на перевірку</div>
        <div className="rowInfo__checker">Голова комісії</div>
      </div>
      {props.source.map((item, index) =>
        <div className="list-item" key={index}>
          <div className="list-item__visible">
            <label className="list-item__switch" htmlFor={"showCheckPart" + index} id={"labshowCheckPart" + index} title="Показати розширену інформацію">⊕</label>
            <div className="list-item__visible-data">
              <div className="rowInfo__check-type">{checkType[item.CheckType]}</div>
              <div className="rowInfo__check-doc">{checkDate(item.CheckSertificateDate, "від ")} № {item.CheckSertificateNo}</div>
              <div className="rowInfo__checker">{item.Checker}</div>
            </div>
          </div>
          <input className="list-item__checkbox" id={"showCheckPart" + index} type="checkbox" onClick={handleChange} />
          <div className="list-item__invisible">
            <div>Перевірка проведена{item.StartCheckDate === item.EndCheckDate
              ? checkDate(item.StartCheckDate, " ")
              : checkDate(item.StartCheckDate, " з ") + checkDate(item.EndCheckDate, " по ")
            }, акт №{item.CheckActNo}</div>
            <div>Перевірялось дотримання вимог Ліцензійних умов ({item.LicUmov === 0
              ? item.CheckSertificateDate < "2009-12-01"
                ? "спільний наказ Держкомпідприємництва та МВС України від 14.12.2004 №145/1501"
                : "наказ МВС України від 01.12.2009 №505"
              : "наказ МВС України від 15.04.2013 №365"
            })</div>
            {item.CheckObjCount
              ? <div>Кількість об'єктів із фізичними постами охорони, де також здійснено перевірку: {item.CheckObjCount}</div>
              : <></>
            }
            <div>{item.NoViolations
              ? "Під час перевірки порушень не виявлено."
              : "Під час перевірки виявлено порушення пунктів Ліцензійних умов: " + checkPointsLU([item.P211, item.P212, item.P213, item.P214, item.P215,
              item.P221, item.P222, item.P223, item.P224, item.P225, item.P226, item.P31, item.P32, item.P33, item.P34, item.P35, item.N429, item.N4210,
              item.N4211, item.N4212, item.N4213, item.N4214, item.N4215, item.N4216, item.N4217, item.P44, item.P451, item.P452, item.P453, item.P456,
              item.P461, item.P462, item.P463, item.P464, item.P471, item.P472, item.P473, item.P474, item.P475, item.P476, item.P477, item.P478], pointsLicUmText)
            }</div>
            {checkDate(item.CheckRozporDate, "") && <div>Видано розпорядження про усунення порушень{checkDate(item.CheckRozporDate, " від ")} №{item.CheckRozporNo}</div>}
            {checkDate(item.CheckRozporDateAnswer, "") && <div>Дата надходження відповіді на розпорядження: {checkDate(item.CheckRozporDateAnswer, "")}</div>}
            {item.Content !== null && <div>Додаткова інформація: {item.Content}</div>}
          </div>
        </div>
      )}
    </div>
  )
}