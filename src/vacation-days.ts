export type Employment = {
  startDate: Date;
  untilDate: Date;
  percentage: number;
  vacationDays: number;
};

export function calculateProRataVacationDays(employment: Employment): number {
  const yearStart = new Date(employment.startDate.getFullYear(), 0, 1);
  const yearEnd = new Date(employment.startDate.getFullYear(), 11, 31);

  const employmentStart = employment.startDate < yearStart ? yearStart : employment.startDate;
  const employmentEnd = employment.untilDate > yearEnd ? yearEnd : employment.untilDate;

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalYearDays = (yearEnd.getTime() - yearStart.getTime()) / msPerDay + 1;
  const workedDays = (employmentEnd.getTime() - employmentStart.getTime()) / msPerDay + 1;

  const workFraction = (workedDays / totalYearDays) * (employment.percentage / 100);
  const proRataVacationDays = employment.vacationDays * workFraction;

  return proRataVacationDays;
}
