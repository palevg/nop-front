import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from '../axios';
import { AuthContext } from "../context/authContext";
import { AppBar, Box, Typography, Tabs, Tab, FormControlLabel, Switch, Button, Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useFetching } from "../hooks/useFetching";
import Error from './Error';
import Loader from "../components/UI/Loader/Loader";
import MyModal from '../components/UI/MyModal/MyModal';
import { checkDate } from "../utils/checkers";
import { taxState, riskState, opForms, formVlasn, activities } from "../utils/data";
import { EnterprList } from "../components/EnterprList";
import { EntFoundersList } from "../components/EntFoundersList";
import { HeadsList } from "../components/HeadsList";
import { OrdersList } from "../components/OrdersList";
import { LicensesList } from "../components/LicensList";
import { ObjectsList } from "../components/ObjectsList";
import { CheckList } from "../components/CheckList";
import { PersonEdit } from "../components/PersonEdit";
import { EnterprEdit } from "../components/EnterprEdit";
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
  const { isAuth, currentUser } = useContext(AuthContext);
  const [enterpr, setEnterpr] = useState({});
  const updateEnterprInfo = (value) => { setEnterpr(value); }
  const [enterpAfil, setEnterpAfil] = useState([]);
  const updateAfilInfo = (value) => { setEnterpAfil(value); }
  const [founders, setFounders] = useState([]);
  const [oldFounders, setOldFounders] = useState(false);
  const [foundersE, setFoundersE] = useState([]);
  const [oldFoundersE, setOldFoundersE] = useState(false);
  const [heads, setHeads] = useState([]);
  const [oldHeads, setOldHeads] = useState(false);
  const [orders, setOrders] = useState([]);
  const updateOrdersList = (value) => { setOrders(value); }
  const [licenses, setLicenses] = useState([]);
  const updateLicensesList = (value) => { setLicenses(value); }
  const [employees, setEmployees] = useState([]);
  const [objects, setObjects] = useState([]);
  const [checkings, setCheckings] = useState([]);
  const [editEnterpr, setEditEnterpr] = useState(null);
  const updateMainEditing = (value) => { setEditEnterpr(value); }
  const [editPerson, setEditPerson] = useState(null);
  const updateEditing = (value) => { setEditPerson(value); }
  const updateHeadsList = (value) => { setHeads(value); }
  const updateFoundersList = (value) => { setFounders(value); }
  const [editMode, setEditMode] = useState(null);
  const updateEditMode = (value) => { setEditMode(value); }

  const newPersonData = {
    Name: '', Indnum: null, Birth: null, BirthPlace: null, LivePlace: null,
    Pasport: null, PaspDate: null, PaspPlace: null, Osvita: null, PhotoFile: null,
    Enterprise: params.id,
    StatutPart: null, DateEnter: null,
    Posada: null, DateStartWork: null, inCombination: false, sequrBoss: false
  }

  const [fetchFirmaById, isLoading] = useFetching(async (id) => {
    await axios.get('/enterprs/' + id)
      .then(response => {
        setEnterpr(response.data[0]);
        setEnterpAfil(response.data.filter(item => item.res_key === 1));
        setFounders(response.data.filter(item => item.res_key === 2));
        setFoundersE(response.data.filter(item => item.res_key === 3));
        setHeads(response.data.filter(item => item.res_key === 4));
        setOrders(response.data.filter(item => item.res_key === 5));
        setLicenses(response.data.filter(item => item.res_key === 6));
        setEmployees(response.data.filter(item => item.res_key === 7));
        setObjects(response.data.filter(item => item.res_key === 8));
        setCheckings(response.data.filter(item => item.res_key === 9));
      })
      .catch(err => {
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

  const uniqueHeads = () => {
    const unique = [];
    heads.forEach((item) => {
      if (unique.filter(unique => unique.HumanId === item.HumanId).length === 0) {
        unique.push(item);
      }
    });
    return unique;
  }

  const enterprData = [
    { fieldName: "Код за ЄДРПОУ", fieldValue: enterpr.Ident },
    { fieldName: "Дата створення", fieldValue: checkDate(enterpr.DateCreate, '') },
    { fieldName: "Організац.-правова форма", fieldValue: "OPForm" in enterpr ? opForms[opForms.findIndex(e => e.Id === enterpr.OPForm)].Name : enterpr.OPForm },
    { fieldName: "Форма власності", fieldValue: "FormVlasn" in enterpr ? formVlasn[enterpr.FormVlasn - 1].Name : enterpr.FormVlasn },
    { fieldName: "Основний вид діяльності", fieldValue: "VidDijal" in enterpr ? activities[activities.findIndex(e => e.Id === enterpr.VidDijal)].Code + " - " + activities[activities.findIndex(e => e.Id === enterpr.VidDijal)].Name : enterpr.VidDijal },
    { fieldName: "Статутний фонд", fieldValue: "StatutSize" in enterpr ? parseFloat(enterpr.StatutSize).toLocaleString("uk-UA", { style: "currency", currency: "UAH" }) : enterpr.StatutSize },
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

  useEffect(() => {
    fetchFirmaById(params.id);
  }, [params.id]);

  return isAuth
    ? isLoading
      ? <Loader />
      : "Ident" in enterpr
        ? editEnterpr
          ? <EnterprEdit
            addNew={false}
            enterpr={enterpr}
            afil={enterpAfil}
            updateEditing={updateMainEditing}
            updateInfo={updateEnterprInfo}
            updateInfo2={updateAfilInfo}
            editor={currentUser.Id}
          />
          : <div className="fullPage">
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
                <Tab label="ЗАГАЛЬНЕ" disabled={Boolean((editPerson || editMode) && value !== 0)} {...a11yProps(0)} />
                <Tab label="ЗАСНОВНИКИ" disabled={Boolean((editPerson || editMode) && value !== 1)} {...a11yProps(1)} />
                <Tab label="КЕРІВНИКИ" disabled={Boolean((editPerson || editMode) && value !== 2)} {...a11yProps(2)} />
                <Tab label="ЗАЯВИ" disabled={Boolean((editPerson || editMode) && value !== 3)} {...a11yProps(3)} />
                <Tab label="ЛІЦЕНЗІЇ" disabled={Boolean((editPerson || editMode) && value !== 4)} {...a11yProps(4)} />
                <Tab label={"ПРАЦІВНИКИ (" + employees.length + ")"} disabled={Boolean((editPerson || editMode) && value !== 5)} {...a11yProps(5)} />
                <Tab label={"ОБ'ЄКТИ (" + objects.length + ")"} disabled={Boolean((editPerson || editMode) && value !== 6)} {...a11yProps(6)} />
                <Tab label={"ПЕРЕВІРКИ (" + checkings.length + ")"} disabled={Boolean((editPerson || editMode) && value !== 7)} {...a11yProps(7)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <MyModal visible={modal} setVisible={setModal}>
                {enterpr.Shevron && <img src={`${process.env.REACT_APP_API_URL}/uploads/${enterpr.Shevron}`} alt="Шеврон/знак" />}
              </MyModal>
              {enterprData.map((item, index) =>
                item.fieldValue && <div className="list-item flex-end" key={index}>
                  <div className="list-item__fieldName">{item.fieldName}:</div>
                  <div className="list-item__fieldValue">{item.fieldValue}</div>
                  {currentUser.acc > 1 && index === 0 &&
                    <Tooltip title="Редагувати дані">
                      <IconButton size="small" color="primary" aria-label="edit" onClick={() => setEditEnterpr(true)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>}
                </div>
              )}
              {currentUser.acc > 1 && enterpr.HideInfo && <div className="list-item flex-end">
                <div className="list-item__fieldName">Службова інформація:</div>
                <div className="list-item__fieldValue">{enterpr.HideInfo}</div>
              </div>}
              {enterpr.Shevron && <div className="list-item flex-end">
                Шеврон або розпізнавальний знак на одязі персоналу охорони:
                <img style={{ height: 40, marginLeft: 20, cursor: "pointer" }}
                  onClick={showShevron}
                  title="Натисніть щоб збільшити розмір зображення"
                  src={`${process.env.REACT_APP_API_URL}/uploads/${enterpr.Shevron}`} alt="Шеврон/знак" />
              </div>}
              {enterpAfil.length > 0 && <div style={{ marginTop: 40 }}>
                <EnterprList enterprs={enterpAfil} loading={false} title="Афільовані підприємства" titleSize={false} />
              </div>}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {editPerson === null
                ? founders.filter(founders => founders.State === 0).length > 0
                  ? <div>
                    {editPerson === null && editMode === null && <div className="block-header">Засновники - фізичні особи:</div>}
                    <HeadsList
                      source={founders.filter(founders => founders.State === 0)}
                      role={false} active={true} sequr={false} buttons={true}
                      updateList={updateFoundersList}
                      updateEditMode={updateEditMode}
                    />
                  </div>
                  : editPerson === null && editMode === null && <div className="block-header">Фізичних осіб у складі засновників немає</div>
                : <PersonEdit
                  person={editPerson}
                  personType={1}
                  simpleEdit={true}
                  updateEditing={updateEditing}
                  updateList={updateFoundersList}
                  isNewPerson={{ person: true, place: true }}
                  editor={currentUser.Id} />
              }
              {currentUser.acc > 1 && editPerson === null && editMode === null && <div>
                <Button
                  sx={{ mb: 3, ml: 3, mt: 3 }}
                  onClick={() => setEditPerson(newPersonData)}
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                >Додати нового співзасновника - фізичну особу
                </Button>
              </div>}
              {editPerson === null && editMode === null && founders.filter(founders => founders.State === 1).length > 0 && <FormControlLabel
                label="показати попередніх засновників - фізичних осіб"
                control={<Switch
                  checked={oldFounders}
                  onChange={showOldFounders}
                  inputProps={{ 'aria-label': 'controlled' }} />}
              />}
              {editPerson === null && editMode === null && oldFounders && <HeadsList source={founders.filter(founders => founders.State === 1)} role={false} active={false} sequr={false} buttons={false} />}
              {editPerson === null && editMode === null && foundersE.filter(foundersE => foundersE.State === 0).length > 0
                ? <div>
                  {editPerson === null && editMode === null && <div className="block-header">Засновники - юридичні особи:</div>}
                  <EntFoundersList source={foundersE.filter(foundersE => foundersE.State === 0)} active={true} />
                </div>
                : editPerson === null && editMode === null && <div className="block-header">Юридичних осіб у складі засновників немає</div>
              }
              {currentUser.acc > 1 && editPerson === null && editMode === null && <div>
                <Button
                  sx={{ mb: 3, ml: 3, mt: 3 }}
                  variant="contained"
                  startIcon={<AddBusinessIcon />}
                >Додати нового співзасновника - юридичну особу
                </Button>
              </div>}
              {editPerson === null && editMode === null && foundersE.filter(foundersE => foundersE.State === 1).length > 0 && <FormControlLabel
                label="показати попередніх засновників - юридичних осіб"
                control={<Switch
                  checked={oldFoundersE}
                  onChange={showOldFoundersE}
                  inputProps={{ 'aria-label': 'controlled' }} />}
              />}
              {editPerson === null && editMode === null && oldFoundersE && <EntFoundersList source={foundersE.filter(foundersE => foundersE.State === 1)} active={false} />}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {editPerson === null
                ? heads.filter(heads => heads.State === 0).length > 0
                  ? <HeadsList source={heads.filter(heads => heads.State === 0)}
                    role={true} active={true} sequr={false} buttons={true}
                    updateList={updateHeadsList}
                    updateEditMode={updateEditMode} />
                  : <div className="block-header">Керівників у підприємства на даний час немає</div>
                : <PersonEdit
                  person={editPerson}
                  personType={2}
                  simpleEdit={true}
                  updateEditing={updateEditing}
                  updateList={updateHeadsList}
                  isNewPerson={{ person: true, place: true }}
                  editor={currentUser.Id} />
              }
              {currentUser.acc > 1 && editPerson === null && editMode === null && <div>
                <Button
                  sx={{ mb: 3, ml: 3, mt: 3 }}
                  onClick={() => setEditPerson(newPersonData)}
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                >Додати нового керівника
                </Button>
              </div>}
              {editPerson === null && editMode === null && heads.filter(heads => heads.State === 1).length > 0 && <FormControlLabel
                label="показати попередніх керівників"
                control={<Switch
                  checked={oldHeads}
                  onChange={showOldHeads}
                  inputProps={{ 'aria-label': 'controlled' }} />}
              />}
              {editPerson === null && editMode === null && oldHeads && <HeadsList source={heads.filter(heads => heads.State === 1)} role={true} active={false} sequr={false} buttons={false} />}
            </TabPanel>
            <TabPanel value={value} index={3}>
              <OrdersList source={orders} heads={uniqueHeads()} updateList={updateOrdersList} updateList2={updateLicensesList} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              {licenses.length > 0
                ? <LicensesList source={licenses} />
                : <div className="block-header">Ліцензій підприємство ще не отримувало</div>
              }
            </TabPanel>
            <TabPanel value={value} index={5}>
              {employees.length > 0
                ? <HeadsList source={employees} role={true} sequr={true} buttons={false} />
                : <div className="block-header">Персоналу охорони у підприємства на даний час немає</div>
              }
            </TabPanel>
            <TabPanel value={value} index={6}>
              {objects.length > 0
                ? <ObjectsList source={objects} />
                : <div className="block-header">Об'єктів під охороною підприємства на даний час немає</div>
              }
            </TabPanel>
            <TabPanel value={value} index={7}>
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