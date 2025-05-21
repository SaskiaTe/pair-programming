import { calculatePayslip, DEDUCTION_RATES, Salary } from "./payroll";

describe("calculatePayslip", () => {
  it("16-jähriger Lernender mit 700.- Monatsgehalt", () => {
    const salary: Salary = {
      born: new Date("2009-05-15"),
      payday: new Date("2025-04-30"),
      gross: 700,
    };

    const payslip = calculatePayslip(salary);
    expect(payslip.totalDeductions).toBe(0);
    expect(payslip.deductions.size).toBe(0);
    expect(payslip.net).toBe(700);
  });

  it("18-jähriger Lernender mit 1200.- Monatsgehalt", () => {
    const salary: Salary = {
      born: new Date("2006-01-01"),
      payday: new Date("2025-05-01"),
      gross: 1200,
    };

    const payslip = calculatePayslip(salary);
    const expectedDeductions = new Map([
      ["AHV", parseFloat((1200 * 8.7 / 100).toFixed(2))],
      ["IV", parseFloat((1200 * 1.4 / 100).toFixed(2))],
      ["EO", parseFloat((1200 * 0.5 / 100).toFixed(2))],
    ]);

    for (const [key, value] of expectedDeductions) {
      expect(payslip.deductions.get(key)).toBe(value);
    }

    expect(payslip.totalDeductions).toBeCloseTo(
      Array.from(expectedDeductions.values()).reduce((a, b) => a + b, 0),
      2
    );
    expect(payslip.net).toBeCloseTo(1200 - payslip.totalDeductions, 2);
  });

  it("21-jähriger Angestellter mit 5900.- Monatsgehalt", () => {
    const salary: Salary = {
      born: new Date("2004-01-01"),
      payday: new Date("2025-05-01"),
      gross: 5900,
    };

    const payslip = calculatePayslip(salary);

    const expectedKeys = ["AHV", "IV", "EO", "ALV", "NBU", "PK"];
    for (const key of expectedKeys) {
      expect(payslip.deductions.has(key)).toBe(true);
    }

    const totalDeductions = Array.from(payslip.deductions.values()).reduce((a, b) => a + b, 0);
    expect(payslip.totalDeductions).toBeCloseTo(totalDeductions, 2);
    expect(payslip.net).toBeCloseTo(5900 - payslip.totalDeductions, 2);
  });
});