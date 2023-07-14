import React from "react";
import { checkDate } from "../utils/checkers";

export const ObjectsList = (props) => {

  return (
    <div>
      <div className="rowInfo list-header">
        <div className="rowInfo__humanName">Тип об'єкта</div>
        <div className="rowInfo__humanState">Адреса</div>
        <div className="list-item__date">Станом на</div>
      </div>
      {props.source.map((item, index) =>
        <div className="list-item" key={index}>
          <div className="list-item__visible">
            {(item.Name || item.Director || item.Phone) != null
              ? <label className="list-item__switch" htmlFor={"showObjPart" + index} title="Розширена інформація">⇕</label>
              : <div className="list-item__switch" />
            }
            <div className="list-item__visible-data">
              <div className="list-item__obj-type">{item.ObjectType}</div>
              <div className="list-item__address">{item.Address}</div>
              <div className="list-item__date-info">{checkDate(item.DateWrite, "")}</div>
            </div>
          </div>
          <input className="list-item__checkbox" id={"showObjPart" + index} type="checkbox" />
          {(item.Name || item.Director || item.Phone) != null
            ? <div className="list-item__invisible">
              <div>Замовник: {item.Name}</div>
              <div>Керівник: {item.Director}
              {item.Phone != null
                ? ", тел." + item.Phone
                : ''
              }</div>
            </div>
            : <></>
          }
        </div>
      )}
    </div>
  )
}