import { Request } from 'express';

export const reportDate = (req: Request) => {
  const { startDate, endDate } = req.body;

  let begin, end;

  //   if there is one of the dates, return the current month date i.e start of the month to the end of the month.
  if (!startDate || !endDate) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    begin = new Date(year, month, 1).toString();
    end = new Date(year, month + 1, 0).toString();
  } else {
    // Otherwise, use the incoming start and end date.
    const newEndDate = new Date(endDate);
    const year = newEndDate.getFullYear();
    const month = newEndDate.getMonth();
    const day = newEndDate.getDate();
    begin = new Date(startDate);
    end = new Date(year, month, day + 1, 1);
  }

  return [begin, end];
};
