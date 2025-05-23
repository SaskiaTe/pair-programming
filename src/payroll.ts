export type Salary = {
  born: Date;
  payday: Date;
  gross: number;
};

export type Deductions = Map<string, number>;

export const DEDUCTION_RATES: Deductions = new Map([
  ["AHV", 8.7],
  ["IV", 1.4],
  ["EO", 0.5],
  ["ALV", 1.1],
  ["NBU", 0.73],
  ["PK", 8.9],
]);

export type Payslip = {
  salary: Salary;
  deductions: Deductions;
  totalDeductions: number;
  net: number;
};

export function calculatePayslip(salary: Salary): Payslip {
  const result: Payslip = {
    salary: salary,
    deductions: new Map(),
    totalDeductions: 0.0,
    net: salary.gross,
  };

  const { born, payday, gross } = salary;

  const ageAtPayday = payday.getFullYear() - born.getFullYear();
  const turned18 = new Date(born.getFullYear() + 18, 0, 1);
  const turned17 = new Date(born.getFullYear() + 17, 0, 1);
  const isPaydayAfter17 = payday >= turned17;

 const annualGross = gross * 12;

for(const [key, rate] of DEDUCTION_RATES.entries()){
  let shouldApply = false;

  if(["AHV", "IV", "EO"].includes(key)){
    shouldApply = isPaydayAfter17;
  }

  if(["ALV", "NBU"].includes(key)){
    shouldApply = annualGross >= 2500;
  }

  if(key === "PK"){
    shouldApply = annualGross >= 22680;
  }

  if(shouldApply){
    const amount = parseFloat((gross * rate / 100).toFixed(2));
    result.deductions.set(key, amount);
    result.totalDeductions += amount;
  }
}
  result.totalDeductions = parseFloat(result.totalDeductions.toFixed(2));
  result.net = parseFloat((gross - result.totalDeductions).toFixed(2));

  return result;
}
