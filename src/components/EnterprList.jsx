import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from './UI/Loader/Loader';

export const EnterprList = ({ enterprs, loading, title, titleSize }) => {
  const [currentRow, setCurrentRow] = useState({ field: 1, direction: 0 });

  const rowSorting = (sortRow) => {
    const fieldName = ["", "KeyName", "Ident"];
    if (sortRow === currentRow.field && currentRow.direction === 1) {
      setCurrentRow({ field: sortRow, direction: 2 });
      enterprs.sort((a, b) => a[fieldName[sortRow]].localeCompare(b[fieldName[sortRow]], "uk")).reverse();
    } else {
      setCurrentRow({ field: sortRow, direction: 1 });
      enterprs.sort((a, b) => a[fieldName[sortRow]].localeCompare(b[fieldName[sortRow]], "uk"));
    }
  }

  useEffect(() => {
    rowSorting(currentRow.field);
  }, [enterprs]);

  return enterprs.length > 0
    ? <div className="enterpr__font">
      {titleSize
        ? <h1 className="page-header__text">{title}</h1>
        : <h2 className="page-header__text">{title}</h2>
      }
      <div className="enterpr__header">
        <div className="enterpr__header-row" onClick={() => rowSorting(1)}>
          Назва
          <span>{currentRow.field === 1 && (currentRow.direction === 1 ? "▼" : "▲")}</span>
        </div>
        <div className="enterpr__header-row" onClick={() => rowSorting(2)}>
          Код за ЄДРПОУ
          <span>{currentRow.field === 2 && (currentRow.direction === 1 ? "▼" : "▲")}</span>
        </div>
      </div>
      {enterprs.map(enterpr =>
        <div className="enterpr__item" key={enterpr.Id}>
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