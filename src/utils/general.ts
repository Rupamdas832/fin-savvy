export const getNumberSystem = (val: number) => {
  if (val >= 10000000) {
    return `${(val / 10000000).toFixed(2)} Cr`;
  } else if (val > 100000) {
    return `${(val / 100000).toFixed(2)} L`;
  } else if (val > 1000) {
    return `${(val / 1000).toFixed(2)} K`;
  }
  return val;
};
