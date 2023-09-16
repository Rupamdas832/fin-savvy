export const getNameInitials = (firstName?: string, lastName?: string) => {
  let str = "";
  if (firstName && lastName) {
    str = firstName[0].toUpperCase() + lastName[0].toUpperCase();
  } else if (firstName) {
    str = firstName[0].toUpperCase();
  }
  return str;
};
