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

export const checkStatut = (partToCheck) => {
  if (partToCheck === null || '') return partToCheck = "інформація відсутня"
  return partToCheck + "%";
}