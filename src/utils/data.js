import axios from '../axios';

const regions = ["вся Україна"];
const getRegionNames = async () => {
  await axios.get("/regions")
    .then(res => {
      if (res.data.length > 0) {
        res.data.forEach(item => {
          regions.push(item.NameRegion)
        });
      }
    })
    .catch(err => {
      window.alert(err.response.data);
    });
}
getRegionNames();
export const regionNames = regions;

export const taxState = ["спрощена", "загальна", "невідомо"];

export const riskState = ["високий", "середній", "незначний", "невідомо"];

export const orderType = ["видачі ліцензії", "видачі дубліката ліцензії", "переоформлення ліцензії", "видачі засвідченої копії ліцензії", "переоформлення засвідченої копії ліцензії"];

export const orderCategory = ["A", "B", "C", "A+B", "A+C", "ABC"];

export const orderState = ["діюча", "залишена без розгляду", "відмовлена", "", "", "задовільнена"];

export const ordersState = ["діючі", "залишені без розгляду", "відмовлені"];

const licTypes = [];
const getLicTypes = async () => {
  await axios.get("/lictypes")
    .then(res => {
      if (res.data.length > 0) {
        res.data.forEach((item) => {
          licTypes.push(item.LicName)
        });
      }
    })
    .catch(err => {
      window.alert(err.response.data);
    });
}
getLicTypes();
export const licenseType = licTypes;

export const licenseState = ["діюча", "анульована", "призупинена", "недійсна"];

export const licensesState = ["діючі", "анульовані", "строк дії закінчено", "недійсні", "всі"];

export const workPlacesList = [{ name: 'Генеральний директор' }, { name: 'Голова правління' }, { name: 'Директор' },
{ name: 'Виконавчий директор' }, { name: 'Заступник генер. директора' }, { name: 'Заступник директора' },
{ name: 'Заст.директора з охорон. діяльності' }, { name: 'Фахівець з організації охорони' },
{ name: 'Головний спеціаліст' }, { name: 'Головний бухгалтер' }, { name: 'Бухгалтер' }, { name: 'Підприємець' }];

export const checkType = ["планова", "позапланова (перевірка виконання розпорядження)", "позапланова (по письмовій скарзі/заяві)"];

export const pointsLicUmText = ["2.1.1", "2.1.2", "2.1.3", "2.1.4", "2.1.5", "2.2.1", "2.2.2", "2.2.3", "2.2.4", "2.2.5", "2.2.6",
  "3.1", "3.2", "3.3", "3.4", "3.5", "4.2.9", "4.2.10", "4.2.11", "4.2.12", "4.2.13", "4.2.14", "4.2.15", "4.2.16", "4.2.17", "4.4",
  "4.5.1", "4.5.2", "4.5.3", "4.5.6", "4.6.1", "4.6.2", "4.6.3", "4.6.4", "4.7.1", "4.7.2", "4.7.3", "4.7.4", "4.7.5", "4.7.6", "4.7.7", "4.7.8"];