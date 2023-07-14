import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from '../axios';
import { AuthContext } from "../context/authContext";
import { AppBar, Box, Typography, Tabs, Tab, FormControlLabel, Switch, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useFetching } from "../hooks/useFetching";
import Error from './Error';
import Loader from "../components/UI/Loader/Loader";
import MyModal from '../components/UI/MyModal/MyModal';
import { checkDate } from "../utils/checkers";
import { EnterprList } from "../components/EnterprList";
import { EntFoundersList } from "../components/EntFoundersList";
import { HeadsList } from "../components/HeadsList";
import { ObjectsList } from "../components/ObjectsList";
import { CheckList } from "../components/CheckList";
import { PersonEdit } from "../components/PersonEdit";
import "../styles/pages.css";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const taxState = ["спрощена", "загальна", "невідомо"];
const riskState = ["високий", "середній", "незначний", "невідомо"];
const licenseState = ["діюча", "анульована", "призупинена", "недійсна"];

const EnterprPage = () => {
  const [value, setValue] = useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }
  const [modal, setModal] = useState(false);
  const showShevron = () => {
    setModal(true);
  }
  const params = useParams();
  const { isAuth, currentUser } = React.useContext(AuthContext);
  const [enterprNew, setEnterprNew] = useState(null);
  const [enterpr, setEnterpr] = useState({});
  const [enterpAfil, setEnterpAfil] = useState([]);
  const [founders, setFounders] = useState([]);
  const [oldFounders, setOldFounders] = useState(false);
  const [foundersE, setFoundersE] = useState([]);
  const [oldFoundersE, setOldFoundersE] = useState(false);
  const [heads, setHeads] = useState([]);
  const [oldHeads, setOldHeads] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [objects, setObjects] = useState([]);
  const [checkings, setCheckings] = useState([]);
  const [editPerson, setEditPerson] = useState(null);
  const updateEditing = (value) => { setEditPerson(value); }

  let newPersonData = {
    fullName: '',
    indnum: '',
    birthDate: '',
    birthPlace: '',
    livePlace: '',
    pasport: '',
    paspDate: '',
    paspPlace: '',
    osvita: '',
    foto: '',
    statutPart: '',
    dateEnter: '',
    posada: '',
    dateStartWork: ''
  }

  const [fetchFirmaById, isLoading] = useFetching(async (id) => {
    await axios.get('/enterprs/' + id)
      .then(response => {
        setEnterpr(response.data[0]);
        if (enterprNew !== params.id) {   // це тимчасова перевірка, бо поки є подвійне зчитування даних
          enterpAfil.length = founders.length = foundersE.length = heads.length = licenses.length = employees.length = objects.length = checkings.length = 0;
          response.data.map((item) => {
            switch (item.res_key) {
              case 1:
                enterpAfil.push(item);
                break;
              case 2:
                founders.push(item);
                break;
              case 3:
                foundersE.push(item);
                break;
              case 4:
                heads.push(item);
                break
              case 5:
                licenses.push(item);
                break
              case 6:
                employees.push(item);
                break
              case 7:
                objects.push(item);
                break
              case 8:
                checkings.push(item);
                break
            }
          });
        }
        setEnterprNew(params.id);
        setEnterpAfil(enterpAfil);
        setFounders(founders);
        setFoundersE(foundersE);
        setHeads(heads);
        setLicenses(licenses);
        setEmployees(employees);
        setObjects(objects);
        setCheckings(checkings);
      })
      .catch(err => {
        setEnterprNew(null);
        // alert(err.response.data.message);
      });
  });

  const showOldFounders = () => {
    oldFounders ? setOldFounders(false) : setOldFounders(true);
  }

  const showOldFoundersE = () => {
    oldFoundersE ? setOldFoundersE(false) : setOldFoundersE(true);
  }

  const showOldHeads = () => {
    oldHeads ? setOldHeads(false) : setOldHeads(true);
  }

  const enterprData = [
    { fieldName: "Код за ЄДРПОУ", fieldValue: enterpr.Ident },
    { fieldName: "Дата створення", fieldValue: checkDate(enterpr.DateCreate, '') },
    { fieldName: "Статутний фонд (у грн.)", fieldValue: enterpr.StatutSize },
    { fieldName: "Адреса реєстрації", fieldValue: enterpr.AddressDeUre },
    { fieldName: "Фактична адреса", fieldValue: enterpr.AddressDeFacto },
    { fieldName: "Телефон", fieldValue: enterpr.Phones },
    { fieldName: "Факс", fieldValue: enterpr.Faxes },
    { fieldName: "Розрахунковий рахунок", fieldValue: enterpr.RosRah },
    { fieldName: "Кредитна установа", fieldValue: enterpr.RosUst },
    { fieldName: "МФО", fieldValue: enterpr.RosMFO },
    { fieldName: "Система оподаткування", fieldValue: taxState[enterpr.Podatok] },
    { fieldName: "Ступінь ризику", fieldValue: riskState[enterpr.StateRisk] },
    { fieldName: "Додаткова інформація", fieldValue: enterpr.AddInfo }
  ];

  React.useEffect(() => {
    fetchFirmaById(params.id);
  }, [params.id]);

  return isAuth
    ? isLoading
      ? <Loader />
      : enterprNew
        ? <div className="fullPage">
          <h1 className="fullPage__name">{enterpr.FullName}</h1>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="ЗАГАЛЬНЕ" {...a11yProps(0)} />
              <Tab label="ЗАСНОВНИКИ" {...a11yProps(1)} />
              <Tab label="КЕРІВНИКИ" {...a11yProps(2)} />
              <Tab label="ЛІЦЕНЗІЇ" {...a11yProps(3)} />
              <Tab label={"ПРАЦІВНИКИ (" + employees.length + ")"} {...a11yProps(4)} />
              <Tab label={"ОБ'ЄКТИ (" + objects.length + ")"} {...a11yProps(5)} />
              <Tab label={"ПЕРЕВІРКИ (" + checkings.length + ")"} {...a11yProps(6)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <MyModal visible={modal} setVisible={setModal}>
              {enterpr.Shevron && <img src={`${process.env.REACT_APP_API_URL}/uploads/${enterpr.Shevron}`} alt="Шеврон/знак" />}
            </MyModal>
            {enterprData.map((item, index) =>
              item.fieldValue && <div className="rowInfo" key={index}>
                <div className="rowInfo__fieldName">{item.fieldName}:</div>
                <div className="rowInfo__fieldValue">{item.fieldValue}</div>
              </div>
            )}
            {currentUser.acc > 1 && enterpr.HideInfo && <div className="rowInfo">
              <div className="rowInfo__fieldName">Службова інформація:</div>
              <div className="rowInfo__fieldValue">{enterpr.HideInfo}</div>
            </div>}
            {enterpr.Shevron && <div className="rowInfo">
              Шеврон або розпізнавальний знак на одязі персоналу охорони:
              <img style={{ height: 40, marginLeft: 20, cursor: "pointer" }}
                onClick={showShevron}
                title="Натисніть щоб збільшити розмір зображення"
                src={`${process.env.REACT_APP_API_URL}/uploads/${enterpr.Shevron}`} alt="Шеврон/знак" />
            </div>}
            {enterpAfil.length > 0 && <div style={{ marginTop: 40 }}>
              <EnterprList enterprs={enterpAfil} loading={false} title="Афільовані підприємства" titleSize={false} />
            </div>}
            {currentUser.acc > 1 && <Button className="enterpr__edit-btn" variant="contained" startIcon={<EditIcon />}>Редагувати</Button>}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {founders.filter(founders => founders.State === 0).length > 0
              ? <div>
                <div className="block-header">Засновники - фізичні особи:</div>
                <HeadsList source={founders.filter(heads => heads.State === 0)} role={false} active={true} sequr={false} buttons={true} />
              </div>
              : <div className="block-header">Фізичних осіб у складі засновників немає</div>
            }
            {currentUser.acc > 1 &&
              <div><Button className="enterpr__add-btn" variant="contained" startIcon={<AddIcon />}>Додати нового співзасновника - фізичну особу</Button></div>}
            {founders.filter(founders => founders.State === 1).length > 0 && <FormControlLabel
              label="показати попередніх засновників - фізичних осіб"
              control={<Switch
                checked={oldFounders}
                onChange={showOldFounders}
                inputProps={{ 'aria-label': 'controlled' }} />}
            />}
            {oldFounders && <HeadsList source={founders.filter(founders => founders.State === 1)} role={false} active={false} sequr={false} buttons={false} />}
            {foundersE.filter(foundersE => foundersE.State === 0).length > 0
              ? <div>
                <div className="block-header">Засновники - юридичні особи:</div>
                <EntFoundersList source={foundersE.filter(foundersE => foundersE.State === 0)} active={true} />
              </div>
              : <div className="block-header">Юридичних осіб у складі засновників немає</div>
            }
            {currentUser.acc > 1 &&
              <div><Button className="enterpr__add-btn" variant="contained" startIcon={<AddIcon />}>Додати нового співзасновника - юридичну особу</Button></div>}
            {foundersE.filter(foundersE => foundersE.State === 1).length > 0 && <FormControlLabel
              label="показати попередніх засновників - юридичних осіб"
              control={<Switch
                checked={oldFoundersE}
                onChange={showOldFoundersE}
                inputProps={{ 'aria-label': 'controlled' }} />}
            />}
            {oldFoundersE && <EntFoundersList source={foundersE.filter(foundersE => foundersE.State === 1)} active={false} />}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {heads.filter(heads => heads.State === 0).length > 0
              ? <HeadsList source={heads.filter(heads => heads.State === 0)} role={true} active={true} sequr={false} buttons={true} />
              : <div className="block-header">Керівників у підприємства на даний час немає</div>
            }
            {currentUser.acc > 1 && <div>
              <Button className="enterpr__add-btn" onClick={() => setEditPerson(newPersonData)} variant="contained" startIcon={<AddIcon />}>Додати нового керівника</Button>
            </div>}
            {editPerson !== null && <PersonEdit
              person={editPerson}
              personType={2}
              updateEditing={updateEditing}
              isNewPerson={true}
              editor={currentUser} />
            }
            {heads.filter(heads => heads.State === 1).length > 0 && <FormControlLabel
              label="показати попередніх керівників"
              control={<Switch
                checked={oldHeads}
                onChange={showOldHeads}
                inputProps={{ 'aria-label': 'controlled' }} />}
            />}
            {oldHeads && <HeadsList source={heads.filter(heads => heads.State === 1)} role={true} active={false} sequr={false} buttons={false} />}
          </TabPanel>
          <TabPanel value={value} index={3}>
            <div className="rowInfo list-header">
              <div className="license-item license-item__kateg">Катег.</div>
              <div className="license-item license-item__number">Серія і номер</div>
              <div className="license-item license-item__date">Діє з</div>
              <div className="license-item license-item__date">по</div>
              <div className="license-item license-item__state">Стан</div>
            </div>
            {licenses.map((item, index) =>
              <div className="rowInfo" key={index}>
                <div className="license-item license-item__kateg" title={item.LicName}>{item.Category}</div>
                <div className="license-item license-item__number">{item.SerLicenze} {item.NumLicenze}</div>
                <div className="license-item license-item__date" title={item.ReasonStart}>{checkDate(item.DateLicenz, '')}</div>
                <div className="license-item license-item__date" title={item.ReasonStart}>
                  {(new Date(item.DateClose) > new Date("2222-02-20"))
                    ? "безтерміново"
                    : checkDate(item.DateClose, '')
                  }
                </div>
                <div className="license-item license-item__state" title={item.ReasonClose}>
                  {item.State === 0
                    ? (new Date(item.DateClose) > new Date())
                      ? licenseState[item.State]
                      : "термін дії закінчився"
                    : licenseState[item.State]
                  }
                </div>
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {employees.length > 0
              ? <HeadsList source={employees} role={true} sequr={true} buttons={false} />
              : <div className="block-header">Персоналу охорони у підприємства на даний час немає</div>
            }
          </TabPanel>
          <TabPanel value={value} index={5}>
            {objects.length > 0
              ? <ObjectsList source={objects} />
              : <div className="block-header">Об'єктів під охороною підприємства на даний час немає</div>
            }
          </TabPanel>
          <TabPanel value={value} index={6}>
            {checkings.length > 0
              ? <CheckList source={checkings} />
              : <div className="block-header">Перевірок діяльності підприємства не було</div>
            }
          </TabPanel>
        </div>
        : <Error />
    : <Error />
}

export default EnterprPage;