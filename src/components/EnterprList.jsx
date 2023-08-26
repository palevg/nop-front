import React from "react";
import { Link } from "react-router-dom";
import Loader from './UI/Loader/Loader';

export const EnterprList = ({ enterprs, loading, title, titleSize }) => {

  return enterprs.length > 0
    ? <div className="enterpr__font">
      {titleSize
        ? <h1 className="page-header__text">{title}</h1>
        : <h2 className="page-header__text">{title}</h2>
      }
      <div className="enterpr__header">
        <div>Назва</div>
        <div>Код за ЄДРПОУ</div>
      </div>
      {enterprs.map((enterpr, index) =>
        <div className="enterpr__item" key={index}>
          <Link to={`/enterprs/${enterpr.Id}`}>{enterpr.FullName}</Link>
          <div>{enterpr.Ident}</div>
        </div>
      )}
    </div>
    : loading
      ? <div>
        <h1 className="info_message">Зачекайте, йде завантаження даних...</h1>
        <Loader />
      </div>
      : <h1 className="info_message">Записів не знайдено. Змініть пошукові дані!</h1>
}