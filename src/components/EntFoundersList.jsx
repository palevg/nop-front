import { checkDate, checkStatut } from "../utils/checkers";

export const EntFoundersList = (props) => {

  return (
    <div>
      {props.source.map(enterpr =>
        <div className="rowFounderE" key={enterpr.Id}>
          <div className="rowFounderE__entr-name">
            <div>{enterpr.Name}</div>
            {enterpr.OKPO !== null && <div className="">Реєстраційний код: {enterpr.OKPO}</div>}
          </div>
          <div><span style={{ fontWeight: 300 }}>Адреса:</span> {enterpr.Address}</div>
          <div><span style={{ fontWeight: 300 }}>Представник:</span> {enterpr.Predstavnik}</div>
          {enterpr.StatutPart !== null && <div><span style={{ fontWeight: 300 }}>Частка у Статутному капіталі:</span> {checkStatut(enterpr.StatutPart)}{checkDate(enterpr.DateEnter, " з ")}
            {props.active
              ? ''
              : checkDate(enterpr.DateExit, " по ")
            }
          </div>}
        </div>
      )}

    </div>
  )
}