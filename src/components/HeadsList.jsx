import { useContext, useState } from "react";
import 'dayjs/locale/uk';
import { AuthContext } from "../context/authContext";
import HeadsListItem from "./HeadsListItem";
import PersonFire from "./PersonFire";
import { Button, FormControlLabel, Switch } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PersonEdit } from "./PersonEdit";

export const HeadsList = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [showFiredPeople, setShowFiredPeople] = useState(false);
  const [editPerson, setEditPerson] = useState(null);
  const [statePersonEditing, setStatePersonEditing] = useState({ person: false, place: false });
  const [firePerson, setFirePerson] = useState(null);

  function TableHeader({ firedPeople }) {
    return (<thead>
      <tr className="data-table__header">
        <th>Прізвище, ім'я та по-батькові</th>
        <th>{props.personType === 3
          ? "Посада"
          : props.personType === 2
            ? firedPeople
              ? "Посада, дата призначення та звільнення"
              : "Посада, дата призначення"
            : firedPeople
              ? "Частка у Статутному капіталі, з ... по ..."
              : "Частка у Статутному капіталі, з дати"}
        </th>
        {currentUser.acc > 1 && <th />}
      </tr>
    </thead>)
  }

  function EmptyListNotification() {
    return (<div className="block-header">{props.personType === 3
      ? "Персоналу охорони у юридичної особи на даний час немає"
      : props.personType === 2
        ? "Керівників у юридичної особи на даний час немає"
        : "Фізичних осіб у складі засновників немає"}
    </div>)
  }

  const handleButtonClick = () => {
    setStatePersonEditing({ person: true, place: true });
    props.setEditMode(true);
    setEditPerson({
      Name: '', Indnum: null, Birth: null, BirthPlace: null, LivePlace: null,
      Pasport: null, PaspDate: null, PaspPlace: null, Osvita: null, PhotoFile: null,
      Enterprise: props.enterprId, EnterDate: null, StatutPart: null,
      Posada: null, inCombination: false, sequrBoss: false
    });
  }

  return (<>
    <PersonFire
      firePerson={firePerson}
      setFirePerson={setFirePerson}
      personType={props.personType}
      updateList={props.updateList}
      editor={currentUser.Id}
    />
    {editPerson === null
      ? <>
        {props.source.length > 0
          ? <>
            {props.personType === 1 && props.source.filter(person => person.State === 0).length > 0 &&
              <div className="block-header">Засновники - фізичні особи:</div>}
            {props.source.filter(person => person.State === 0).length > 0
              ? <table className="data-table">
                <TableHeader firedPeople={false} />
                <tbody>
                  {props.source.filter(person => person.State === 0).map(person =>
                    <HeadsListItem
                      key={person.Id}
                      person={person}
                      personType={props.personType}
                      firedPeople={false}
                      setEditMode={props.setEditMode}
                      setEditPerson={setEditPerson}
                      setStatePersonEditing={setStatePersonEditing}
                      setFirePerson={setFirePerson}
                    />
                  )}
                </tbody>
              </table>
              : <EmptyListNotification />}
          </>
          : <EmptyListNotification />}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          {currentUser.acc > 1 && <Button
            sx={{ mb: 3, ml: 3, mt: 3 }}
            onClick={handleButtonClick}
            variant="contained"
            startIcon={<PersonAddIcon />}
          >{props.personType === 3
            ? "Додати нового працівника охорони"
            : props.personType === 2
              ? "Додати нового керівника"
              : "Додати нового співзасновника - фізичну особу"}
          </Button>}
          {props.source.filter(person => person.State === 1).length > 0 && <FormControlLabel
            label={props.personType === 3
              ? "показати звільнених працівників охорони"
              : props.personType === 2
                ? "показати попередніх керівників"
                : "показати попередніх засновників - фізичних осіб"}
            control={<Switch
              checked={showFiredPeople}
              onChange={() => showFiredPeople ? setShowFiredPeople(false) : setShowFiredPeople(true)}
              inputProps={{ 'aria-label': 'controlled' }} />}
          />}
          {showFiredPeople && <>
            <table className="data-table">
              <TableHeader firedPeople={true} />
              <tbody>
                {props.source.filter(person => person.State === 1).map(person =>
                  <HeadsListItem
                    key={person.Id}
                    person={person}
                    personType={props.personType}
                    firedPeople={true}
                    setEditMode={props.setEditMode}
                    setEditPerson={setEditPerson}
                    setStatePersonEditing={setStatePersonEditing}
                  />
                )}
              </tbody>
            </table>
          </>}
        </div>
      </>
      : <PersonEdit
        person={editPerson}
        personType={props.personType}
        setEditPerson={setEditPerson}
        updateList={props.updateList}
        setEditMode={props.setEditMode}
        isNewPerson={statePersonEditing}
        editor={currentUser.Id}
      />
    }
  </>)
}