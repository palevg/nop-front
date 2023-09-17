import { checkDate, checkStatut } from "../utils/checkers";

export const EntFoundersList = (props) => {

  return (
    <div>
      {props.source.map((item, index) =>
        <div className="rowFounderE" key={index}>
          <div className="rowFounderE__entr-name">
            <div>{item.Name}</div>
            {item.OKPO !== null && <div className="">Реєстраційний код: {item.OKPO}</div>}
          </div>
          <div><span style={{ fontWeight: 300 }}>Адреса:</span> {item.Address}</div>
          <div><span style={{ fontWeight: 300 }}>Представник:</span> {item.Predstavnik}</div>
          {item.StatutPart !== null && <div><span style={{ fontWeight: 300 }}>Частка у Статутному капіталі:</span> {checkStatut(item.StatutPart)}{checkDate(item.DateEnter, " з ")}
            {props.active
              ? ''
              : checkDate(item.DateExit, " по ")
            }
          </div>}
        </div>
      )}

    </div>
  )
}