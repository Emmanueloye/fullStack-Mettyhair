export const reportLastDate = (endDate: Date) => {
  //   Determine if the current date is last day of the month
  const newDate = new Date();
  const currentDate = new Date(
    newDate.getFullYear(),
    newDate.getMonth() + 1,
    0
  );
  let lastDate;
  if (new Date(endDate).getDate() === currentDate.getDate()) {
    lastDate = new Date(
      `${currentDate.getFullYear()}-0${currentDate.getMonth() + 2}-01`
    );
  } else {
    const reqDate = new Date(endDate);

    lastDate = new Date(
      `${reqDate.getFullYear()}-0${reqDate.getMonth() + 1}-${
        reqDate.getDate() + 1
      }`
    );
  }

  return lastDate;
};
