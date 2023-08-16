export const checkDate = (dateToCheck, prefix) => {
  dateToCheck === null || ''
    ? dateToCheck = ""
    : dateToCheck = prefix + new Date(dateToCheck).toLocaleDateString("uk")
  return dateToCheck;
  // let newDate = '';
  // if (dateToCheck !== null) {
  //   const timezoneOffset = new Date().getTimezoneOffset();
  //   newDate = new Date(dateToCheck);
  //   newDate.setMinutes(newDate.getMinutes() - timezoneOffset);
  //   if (prefix !== '') newDate = prefix + new Date(newDate).toLocaleDateString("uk")
  // }
  // return newDate;
}

export const isDateValid = (value) => {
  const arrD = value.split(".");
  arrD[1] -= 1;
  const d = new Date(arrD[2], arrD[1], arrD[0]);
  if ((d.getFullYear() == arrD[2]) && (d.getMonth() == arrD[1]) && (d.getDate() == arrD[0])) return true
  else return false;
}

export const checkStatut = (partToCheck) => {
  if (partToCheck === null || '') return partToCheck = "інформація відсутня"
  return partToCheck + "%";
}