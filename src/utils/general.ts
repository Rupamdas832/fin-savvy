import dayjs from "dayjs";

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

export const getFirstAndLastDateOfAMonth = (month: number, year: number) => {
  const start = dayjs()
    .set("year", year)
    .set("month", month - 1)
    .set("date", 1)
    .format("YYYY-MM-DD");

  const end = dayjs()
    .set("year", year)
    .set("month", month)
    .set("date", 1)
    .format("YYYY-MM-DD");

  return { startDate: new Date(start), endDate: new Date(end) };
};
