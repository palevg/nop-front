import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from '../axios';
import Error from './Error';
import { PlacesList } from "../components/PlacesList";
import { PersonEdit } from "../components/PersonEdit";
import Loader from "../components/UI/Loader/Loader";
import { useFetching } from "../hooks/useFetching";
import { checkDate } from "../utils/checkers";
import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import "../styles/pages.css";

export default function Person() {
  const { isAuth, currentUser } = useContext(AuthContext);
  const params = useParams();
  const [person, setPerson] = useState({});
  const [editPerson, setEditPerson] = useState(null);
  const [founder, setFounder] = useState([]);
  const [head, setHead] = useState([]);
  const [employee, setEmployee] = useState([]);

  const [fetchPersonById, isLoading] = useFetching(async (id) => {
    await axios.get('/peoples/' + id)
      .then(response => {
        setPerson(response.data[0]);
        setFounder(response.data.filter(item => item.res_key === 1));
        setHead(response.data.filter(item => item.res_key === 2));
        setEmployee(response.data.filter(item => item.res_key === 3));
      })
      .catch(err => {
        alert(err.response.data.message);
      });
  });

  const personFields = [
    { fieldName: "Ідентифікаційний код", fieldValue: person.Indnum },
    { fieldName: "Дата народження", fieldValue: checkDate(person.Birth, '') },
    { fieldName: "Місце народження", fieldValue: person.BirthPlace },
    { fieldName: "Місце проживання", fieldValue: person.LivePlace },
    { fieldName: "Паспорт (серія, №)", fieldValue: person.Pasport },
    { fieldName: "Дата видачі", fieldValue: checkDate(person.PaspDate, '') },
    { fieldName: "Ким виданий", fieldValue: person.PaspPlace },
    { fieldName: "Освіта", fieldValue: person.Osvita }
  ];

  useEffect(() => {
    fetchPersonById(params.id);
  }, []);

  return isAuth
    ? isLoading
      ? <Loader />
      : "Name" in person
        ? <div className="fullPage">
          <h1 className="fullPage__name">{person.Name}</h1>
          {editPerson === null
            ? <div className="fullPage__person-info">
              {person.PhotoFile && <img className="fullPage__person-foto__small" src={`${process.env.REACT_APP_API_URL}/uploads/${person.PhotoFile}`} alt="" />}
              <div className="fullPage__person-details">
                <div>
                  {personFields.map((item, index) =>
                    <div key={index}>
                      {item.fieldValue !== null && <div className="list-item flex-end">
                        <div className="list-item__fieldNamePers">{item.fieldName}:</div>
                        <div className="list-item__fieldValue">{item.fieldValue}</div>
                      </div>}
                    </div>
                  )}
                </div>
                {person.PhotoFile && <img className="fullPage__person-foto__big" src={`${process.env.REACT_APP_API_URL}/uploads/${person.PhotoFile}`} alt={person.Name} />}
              </div>
              {currentUser.acc > 1 && editPerson === null && <div>
                <Button sx={{ mt: 2 }} onClick={() => setEditPerson(person)} variant="contained" startIcon={<EditIcon />}>Редагувати дані про особу</Button>
              </div>}
              {founder.length > 0 && <PlacesList source={founder} personType={1} />}
              {head.length > 0 && <PlacesList source={head} personType={2} />}
              {employee.length > 0 && <PlacesList source={employee} personType={3} />}
            </div>
            : <PersonEdit
              person={editPerson}
              personType={0}
              setEditPerson={setEditPerson}
              updateList={setPerson}
              isNewPerson={{ person: false, place: false }}
              editor={currentUser.Id} />}
        </div>
        : <Error />
    : <Error />
}