import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from '../axios';
import Error from './Error';
import { PlacesList } from "../components/PlacesList";
import Loader from "../components/UI/Loader/Loader";
import { useFetching } from "../hooks/useFetching";
import { checkDate } from "../utils/checkers";
import "../styles/pages.css";

const Person = () => {
  const { isAuth } = React.useContext(AuthContext);
  const params = useParams();
  const [personData, setPersonData] = useState(false);
  const [person, setPerson] = useState({});
  const [founder, setFounder] = useState([]);
  const [head, setHead] = useState([]);
  const [employee, setEmployee] = useState([]);

  const [fetchPersonById, isLoading, error] = useFetching(async (id) => {
    await axios.get('/peoples/' + id)
      .then(response => {
        setPerson(response.data[0]);
        setPersonData(true);
        response.data.map((item) => {
          switch (item.res_key) {
            case 1:
              founder.push(item);
              break;
            case 2:
              head.push(item);
              break
            case 3:
              employee.push(item);
              break
          }
        });
        setFounder(founder);
        setHead(head);
        setEmployee(employee);
      })
      .catch(err => {
        setPersonData(false);
        // alert(err.response.data.message);
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

  React.useEffect(() => {
    fetchPersonById(params.id);
  }, []);

  return isAuth
    ? isLoading
      ? <Loader />
      : personData
        ? <div className="fullPage">
          <h1 className="fullPage__name">{person.Name}</h1>
          <div className="fullPage__person-info">
            {person.PhotoFile && <img className="fullPage__person-foto__small" src={`${process.env.REACT_APP_API_URL}/uploads/${person.PhotoFile}`} alt="" />}
            <div className="fullPage__person-details">
              <div>
                {personFields.map((item, index) =>
                  <div key={index}>
                    {item.fieldValue !== null && <div className="rowInfo">
                      <div className="rowInfo__fieldName">{item.fieldName}:</div>
                      <div className="rowInfo__fieldValue">{item.fieldValue}</div>
                    </div>
                    }
                  </div>
                )}
              </div>
              {person.PhotoFile && <img className="fullPage__person-foto__big" src={`${process.env.REACT_APP_API_URL}/uploads/${person.PhotoFile}`} alt="" />}
              {/* <img className="personFoto" src={process.env.PUBLIC_URL + "/images/" + person.PhotoFile} alt="" />  //window.location.origin */}
            </div>
            {founder.length > 0 && <PlacesList source={founder} role={false} sequr={false} />}
            {head.length > 0 && <PlacesList source={head} role={true} sequr={false} />}
            {employee.length > 0 && <PlacesList source={employee} role={false} sequr={true} />}
          </div>
        </div>
        : <Error />
    : <Error />
}

export default Person;