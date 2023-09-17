import { checkDate } from "../utils/checkers";

export const ObjectsList = (props) => {

  const handleChange = (event) => {
    const obj = document.getElementById("lab" + event.target.id);
    obj.textContent = event.target.checked ? "⊝" : "⊕";
    obj.title = event.target.checked ? "Сховати розширену інформацію" : "Показати розширену інформацію";
  }

  return (
    <div>
      <div className="list-item flex-end list-header">
        <div className="list-item__humanName">Тип об'єкта</div>
        <div className="list-item__humanState">Адреса</div>
        <div className="list-item__obj-date-header">Станом на</div>
      </div>
      {props.source.map((item, index) =>
        <div className="list-item" key={index}>
          <div className="list-item__visible">
            {(item.Name || item.Director || item.Phone) != null
              ? <label className="list-item__switch" htmlFor={"showObjPart" + index} id={"labshowObjPart" + index} title="Показати розширену інформацію">⊕</label>
              : <div className="list-item__switch" />
            }
            <div className="list-item__visible-data">
              <div className="list-item__obj-type">{item.ObjectType}</div>
              <div className="list-item__obj-addr">{item.Address}</div>
              <div className="list-item__obj-date">{checkDate(item.DateInfo, "")}</div>
            </div>
          </div>
          <input className="list-item__checkbox" id={"showObjPart" + index} type="checkbox" onClick={handleChange} />
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