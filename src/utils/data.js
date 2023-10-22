import axios from '../axios';

const arrRegions = [{ Id: 0, NameRegion: "вся Україна" }];
const getRegionNames = async () => {
  await axios.get("/regions")
    .then(res => {
      if (res.data.length > 0) {
        res.data.forEach(item => arrRegions.push(item));
      }
    })
    .catch(err => {
      window.alert(err.response.data);
    });
}
getRegionNames();
export const regionNames = arrRegions;

export const taxStates = ["спрощена", "загальна", "невідомо"];

export const riskStates = ["високий", "середній", "незначний", "невідомо"];

const arrOPForm = [];
const getOPForms = async () => {
  await axios.get("/opforms")
    .then(res => {
      if (res.data.length > 0) {
        res.data.forEach(item => arrOPForm.push(item));
      }
    })
    .catch(err => {
      window.alert(err.response.data);
    });
}
getOPForms();
export const opForms = arrOPForm;

const arrFormVlasn = [];
const getFormVlasn = async () => {
  await axios.get("/formvlasn")
    .then(res => {
      if (res.data.length > 0) {
        res.data.forEach(item => arrFormVlasn.push(item));
      }
    })
    .catch(err => {
      window.alert(err.response.data);
    });
}
getFormVlasn();
export const ownershipForms = arrFormVlasn;

const arrActivities = [];
const getActivities = async () => {
  await axios.get("/activities")
    .then(res => {
      if (res.data.length > 0) {
        res.data.forEach(item => arrActivities.push(item));
      }
    })
    .catch(err => {
      window.alert(err.response.data);
    });
}
getActivities();
export const activities = arrActivities;

export const orderTypes = ["видачі ліцензії", "видачі дубліката ліцензії", "переоформлення ліцензії", "видачі засвідченої копії ліцензії", "переоформлення засвідченої копії ліцензії"];

export const orderCategories = ["A", "B", "C", "A+B", "A+C", "ABC"];

export const orderStates = ["діюча", "залишена без розгляду", "відмовлена", "", "", "задовільнена"];

export const ordersStates = ["діючі", "залишені без розгляду", "відмовлені"];

const licTypes = [];
const getLicTypes = async () => {
  await axios.get("/lictypes")
    .then(res => {
      if (res.data.length > 0) {
        res.data.forEach(item => licTypes.push(item));
      }
    })
    .catch(err => {
      window.alert(err.response.data);
    });
}
getLicTypes();
export const licenseTypes = licTypes;

export const licenseStates = ["діюча", "анульована", "призупинена", "недійсна"];

export const licensesStates = ["діючі", "анульовані", "строк дії закінчено", "недійсні", "всі"];

export const workPlacesList = [{ name: 'Генеральний директор' }, { name: 'Голова правління' }, { name: 'Директор' },
{ name: 'Виконавчий директор' }, { name: 'Заступник генер. директора' }, { name: 'Заступник директора' },
{ name: 'Заст.директора з охорон. діяльності' }, { name: 'Фахівець з організації охорони' },
{ name: 'Головний спеціаліст' }, { name: 'Головний бухгалтер' }, { name: 'Бухгалтер' }, { name: 'Підприємець' }];

export const checkTypes = ["планова", "позапланова (перевірка виконання розпорядження)", "позапланова (по письмовій скарзі/заяві)"];

export const pointsLicUmOldText = ["2.1.1", "2.1.2", "2.1.3", "2.1.4", "2.1.5", "2.2.1", "2.2.2", "2.2.3", "2.2.4", "2.2.5", "2.2.6",
  "3.1", "3.2", "3.3", "3.4", "3.5", "4.4", "4.5.1", "4.5.2", "4.5.3", "4.5.6", "4.6.1", "4.6.2", "4.6.3", "4.6.4", "4.7.1", "4.7.2",
  "4.7.3", "4.7.4", "4.7.5", "4.7.6", "4.7.7", "4.7.8"];

export const pointsLicUm365Text = ["2.1.1", "2.1.2", "2.1.3", "2.1.4", "2.2.1", "2.2.2", "2.2.3", "2.3.1", "2.3.2", "2.3.3", "2.3.4",
  "2.3.5", "2.3.6", "2.3.7", "2.3.8", "2.3.9", "2.4", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "4.1", "4.2.1", "4.2.2", "4.2.3",
  "4.2.4", "4.2.5", "4.2.6", "4.2.7", "4.2.8", "4.2.9", "4.2.10", "4.2.11", "4.2.12", "4.2.13", "4.2.14", "4.2.15", "4.2.16", "4.2.17"];