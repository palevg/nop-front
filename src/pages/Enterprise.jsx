import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from '../axios';
import { AuthContext } from "../context/authContext";
import { AppBar, Box, Typography, Tabs, Tab, FormControlLabel, Switch, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useFetching } from "../hooks/useFetching";
import Error from './Error';
import Loader from "../components/UI/Loader/Loader";
import MyModal from '../components/UI/MyModal/MyModal';
import { checkDate } from "../utils/checkers";
import { taxStates, riskStates, opForms, ownershipForms, activities } from "../utils/data";
import { EnterprList } from "../components/EnterprList";
import { EntFoundersList } from "../components/EntFoundersList";
import { HeadsList } from "../components/HeadsList";
import { OrdersList } from "../components/OrdersList";
import { LicensesList } from "../components/LicensList";
import { ObjectsList } from "../components/ObjectsList";
import CheckList from "../components/CheckList";
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

export default function Enterprise() {
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
  const [foundersE, setFoundersE] = useState([]);
  const [oldFoundersE, setOldFoundersE] = useState(false);
  const [heads, setHeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [objects, setObjects] = useState([]);
  const [checks, setChecks] = useState([]);
  const [editEnterpr, setEditEnterpr] = useState(null);
  const [editMode, setEditMode] = useState(null);

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
        setChecks(response.data.filter(item => item.res_key === 9));
      })
      .catch(err => {
        alert(err.response.data.message);
      });
  });

  const showOldFoundersE = () => {
    oldFoundersE ? setOldFoundersE(false) : setOldFoundersE(true);
  }

  const uniqueHeads = () => {
    const unique = [];
    heads.forEach(item => {
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
    { fieldName: "Форма власності", fieldValue: "FormVlasn" in enterpr ? ownershipForms[enterpr.FormVlasn - 1].Name : enterpr.FormVlasn },
    { fieldName: "Основний вид діяльності", fieldValue: "VidDijal" in enterpr ? activities[activities.findIndex(e => e.Id === enterpr.VidDijal)].Code + " - " + activities[activities.findIndex(e => e.Id === enterpr.VidDijal)].Name : enterpr.VidDijal },
    { fieldName: "Статутний фонд", fieldValue: "StatutSize" in enterpr ? parseFloat(enterpr.StatutSize).toLocaleString("uk-UA", { style: "currency", currency: "UAH" }) : enterpr.StatutSize },
    { fieldName: "Адреса реєстрації", fieldValue: enterpr.AddressDeUre },
    { fieldName: "Фактична адреса", fieldValue: enterpr.AddressDeFacto },
    { fieldName: "Телефон", fieldValue: enterpr.Phones },
    { fieldName: "Факс", fieldValue: enterpr.Faxes },
    { fieldName: "Розрахунковий рахунок", fieldValue: enterpr.RosRah },
    { fieldName: "Кредитна установа", fieldValue: enterpr.RosUst },
    { fieldName: "МФО", fieldValue: enterpr.RosMFO },
    { fieldName: "Система оподаткування", fieldValue: taxStates[enterpr.Podatok] },
    { fieldName: "Ступінь ризику", fieldValue: riskStates[enterpr.StateRisk] },
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
            setEditEnterpr={setEditEnterpr}
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
                <Tab label="ЗАГАЛЬНЕ" disabled={Boolean(editMode && value !== 0)} {...a11yProps(0)} />
                <Tab label="ЗАСНОВНИКИ" disabled={Boolean(editMode && value !== 1)} {...a11yProps(1)} />
                <Tab label="КЕРІВНИКИ" disabled={Boolean(editMode && value !== 2)} {...a11yProps(2)} />
                <Tab label="ЗАЯВИ" disabled={Boolean(editMode && value !== 3)} {...a11yProps(3)} />
                <Tab label="ЛІЦЕНЗІЇ" disabled={Boolean(editMode && value !== 4)} {...a11yProps(4)} />
                <Tab label={"ПРАЦІВНИКИ (" + employees.filter(person => person.State === 0).length + ")"} disabled={Boolean(editMode && value !== 5)} {...a11yProps(5)} />
                <Tab label={"ОБ'ЄКТИ (" + objects.length + ")"} disabled={Boolean(editMode && value !== 6)} {...a11yProps(6)} />
                <Tab label={"ПЕРЕВІРКИ (" + checks.length + ")"} disabled={Boolean(editMode && value !== 7)} {...a11yProps(7)} />
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
                    <Button
                      sx={{ minWidth: 88 }}
                      size="small"
                      variant="contained"
                      onClick={() => setEditEnterpr(true)}
                      startIcon={<EditIcon />}
                    >Змінити
                    </Button>
                  }
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
              <HeadsList source={founders} enterprId={params.id} personType={1}
                updateList={setFounders} setEditMode={setEditMode} />
              {editMode === null && foundersE.filter(foundersE => foundersE.State === 0).length > 0
                ? <>
                  {editMode === null && <div className="block-header">Засновники - юридичні особи:</div>}
                  <EntFoundersList source={foundersE.filter(foundersE => foundersE.State === 0)} active={true} />
                </>
                : editMode === null && <div className="block-header">Юридичних осіб у складі засновників немає</div>
              }
              {currentUser.acc > 1 && editMode === null && <div>
                <Button
                  sx={{ mb: 3, ml: 3, mt: 3 }}
                  variant="contained"
                  startIcon={<AddBusinessIcon />}
                >Додати нового співзасновника - юридичну особу
                </Button>
              </div>}
              {editMode === null && foundersE.filter(foundersE => foundersE.State === 1).length > 0 && <FormControlLabel
                label="показати попередніх засновників - юридичних осіб"
                control={<Switch
                  checked={oldFoundersE}
                  onChange={showOldFoundersE}
                  inputProps={{ 'aria-label': 'controlled' }} />}
              />}
              {editMode === null && oldFoundersE && <EntFoundersList source={foundersE.filter(foundersE => foundersE.State === 1)} active={false} />}
            </TabPanel>
            <TabPanel value={value} index={2}>
              <HeadsList source={heads} enterprId={params.id} personType={2}
                updateList={setHeads} setEditMode={setEditMode} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <OrdersList source={orders} enterprId={params.id} heads={uniqueHeads()} updateList={setOrders} updateList2={setLicenses} setEditMode={setEditMode} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <LicensesList source={licenses} updateList={setLicenses} setEditMode={setEditMode} />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <HeadsList source={employees} enterprId={params.id} personType={3}
                updateList={setEmployees} setEditMode={setEditMode} />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <ObjectsList source={objects} />
            </TabPanel>
            <TabPanel value={value} index={7}>
              <CheckList source={checks} enterprId={params.id} updateList={setChecks} setEditMode={setEditMode} />
            </TabPanel>
          </div>
        : <Error />
    : <Error />
}