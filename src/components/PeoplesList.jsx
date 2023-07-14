import React from "react";
import { Link } from "react-router-dom";
import Loader from '../components/UI/Loader/Loader';
import { checkDate } from "../utils/checkers";

export const PeoplesList = ({ peoples, loading }) => {

  return peoples.length > 0
    ? <div>
      <h1 className="page-header__text">Список фізичних осіб</h1>
      <table className="peoples-table">
        <thead>
          <tr>
            <th className="person-item__name">Прізвище, ім'я та по-батькові</th>
            <th className="person-item__birth">Дата народж.</th>
            <th className="person-item__id">Ідентиф. код</th>
            <th className="person-item__adr">Місце проживання</th>
          </tr>
        </thead>
        <tbody>
          {peoples.map((person, index) =>
            <tr key={index}>
              <td className="person-item__name"><Link to={`/peoples/${person.Id}`}>{person.Name}</Link></td>
              <td className="person-item__birth">{checkDate(person.Birth, '')}</td>
              <td className="person-item__id">{person.Indnum}</td>
              <td className="person-item__adr">{person.LivePlace}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    : loading
      ? <div>
        <h1 className="info_message">Зачекайте, йде завантаження даних...</h1>
        <Loader />
      </div>
      : <h1 className="info_message">Осіб не знайдено. Змініть пошукові дані!</h1>
}