import { useContext, useState } from "react";
import 'dayjs/locale/uk';
import { AuthContext } from "../context/authContext";
import HeadsListItem from "./HeadsListItem";
import PersonFire from "./PersonFire";
import { Button, FormControlLabel, Switch } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PersonEdit } from "./PersonEdit";

export const HeadsList = (props) => {
  const personType = props.sequr ? 0 : props.role ? 2 : 1;
  const { currentUser } = useContext(AuthContext);
  const [showFiredPeople, setShowFiredPeople] = useState(false);
  const [editPerson, setEditPerson] = useState(null);
  const [statePersonEditing, setStatePersonEditing] = useState({ person: false, place: false });
  const [firePerson, setFirePerson] = useState(null);

  function TableHeader({ firedPeople }) {
    return (<tr className="data-table__header">
      <th>Прізвище, ім'я та по-батькові</th>
      <th>{props.sequr
        ? "Посада"
        : props.role
          ? firedPeople
            ? "Посада, дата призначення та звільнення"
            : "Посада, дата призначення"
          : firedPeople
            ? "Частка у Статутному капіталі, з ... по ..."
            : "Частка у Статутному капіталі, з дати"}
      </th>
      {currentUser.acc > 1 && <th />}
    </tr>)
  }

  const handleButtonClick = () => {
    setStatePersonEditing({ person: true, place: true });
    props.setEditMode(true);
    setEditPerson({
      Name: '', Indnum: null, Birth: null, BirthPlace: null, LivePlace: null,
      Pasport: null, PaspDate: null, PaspPlace: null, Osvita: null, PhotoFile: null,
      Enterprise: props.enterprId, StatutPart: null, DateEnter: null,
      Posada: null, DateStartWork: null, inCombination: false, sequrBoss: false
    });
  }

  return (<>
    <PersonFire
      firePerson={firePerson}
      setFirePerson={setFirePerson}
      role={props.role}
      updateList={props.updateList}
      editor={currentUser.Id}
    />
    {editPerson === null
      ? <>
        {props.source.length > 0
          ? <>
            {!props.role && <div className="block-header">Засновники - фізичні особи:</div>}
            <table className="data-table">
              <thead>
                <TableHeader firedPeople={false} />
              </thead>
              <tbody>
                {props.source.filter(person => person.State === 0).map(person =>
                  <HeadsListItem
                    key={person.Id}
                    person={person}
                    role={props.role}
                    active={true}
                    sequr={props.sequr}
                    setEditMode={props.setEditMode}
                    setEditPerson={setEditPerson}
                    setStatePersonEditing={setStatePersonEditing}
                    setFirePerson={setFirePerson}
                  />
                )}
                {showFiredPeople && <>
                  <TableHeader firedPeople={true} />
                  {props.source.filter(person => person.State === 1).map(person =>
                    <HeadsListItem
                      key={person.Id}
                      person={person}
                      role={props.role}
                      active={false}
                      sequr={props.sequr}
                      setEditMode={props.setEditMode}
                      setEditPerson={setEditPerson}
                      setStatePersonEditing={setStatePersonEditing}
                      setFirePerson={setFirePerson}
                    />
                  )}
                </>}
              </tbody>
            </table>
          </>
          : <div className="block-header">{props.sequr
            ? "Персоналу охорони у юридичної особи на даний час немає"
            : props.role
              ? "Керівників у юридичної особи на даний час немає"
              : "Фізичних осіб у складі засновників немає"}
          </div>}
        {currentUser.acc > 1 && <div>
          <Button
            sx={{ mb: 3, ml: 3, mt: 3 }}
            onClick={handleButtonClick}
            variant="contained"
            startIcon={<PersonAddIcon />}
          >{props.sequr
            ? "Додати нового працівника охорони"
            : props.role
              ? "Додати нового керівника"
              : "Додати нового співзасновника - фізичну особу"}
          </Button>
        </div>}
        {props.source.filter(person => person.State === 1).length > 0 && <FormControlLabel
          label={props.sequr
            ? "показати звільнених працівників охорони"
            : props.role
              ? "показати попередніх керівників"
              : "показати попередніх засновників - фізичних осіб"}
          control={<Switch
            checked={showFiredPeople}
            onChange={() => showFiredPeople ? setShowFiredPeople(false) : setShowFiredPeople(true)}
            inputProps={{ 'aria-label': 'controlled' }} />}
        />}
      </>
      : <PersonEdit
        person={editPerson}
        personType={personType}
        enterprId={props.enterprId}
        simpleEdit={false}
        setEditPerson={setEditPerson}
        updateList={props.updateList}
        setEditMode={props.setEditMode}
        isNewPerson={statePersonEditing}
        editor={currentUser.Id}
      />
    }
  </>)
}