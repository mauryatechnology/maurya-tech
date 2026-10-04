import { SalaryCtcCalculator } from '@/components/tools/calculators/SalaryCtcCalculator';
import { HourlyToAnnualCalculator } from '@/components/tools/calculators/HourlyToAnnualCalculator';
import { EmiCalculator } from '@/components/tools/calculators/EmiCalculator';
import { PercentageCalculator } from '@/components/tools/calculators/PercentageCalculator';
import { AgeDateCalculator } from '@/components/tools/calculators/AgeDateCalculator';
import { AtsResumeChecker } from '@/components/tools/calculators/AtsResumeChecker';
import { CgpaCalculator } from '@/components/tools/calculators/CgpaCalculator';
import { ResumeBuilder } from '@/components/tools/calculators/ResumeBuilder';
import { UnitConverter } from '@/components/tools/calculators/UnitConverter';
import { FreelanceRateCalculator } from '@/components/tools/calculators/FreelanceRateCalculator';
import { UsPaycheckCalculator } from '@/components/tools/calculators/UsPaycheckCalculator';
import { IncomeTaxNewVsOldCalculator } from '@/components/tools/calculators/IncomeTaxNewVsOldCalculator';
import { MortgageCalculator } from '@/components/tools/calculators/MortgageCalculator';
import { SipCalculator } from '@/components/tools/calculators/SipCalculator';
import { FdCalculator } from '@/components/tools/calculators/FdCalculator';
import { PpfCalculator } from '@/components/tools/calculators/PpfCalculator';
import { Retirement401kCalculator } from '@/components/tools/calculators/Retirement401kCalculator';
import { UkStudentLoanCalculator } from '@/components/tools/calculators/UkStudentLoanCalculator';
import { ConsumptionTaxCalculator } from '@/components/tools/calculators/ConsumptionTaxCalculator';

/** slug → interactive calculator component. Add new tools here. */
export const CALCULATOR_COMPONENTS = {
  'ctc-calculator': SalaryCtcCalculator,
  'hourly-to-annual-salary': HourlyToAnnualCalculator,
  'emi-calculator': EmiCalculator,
  'percentage-calculator': PercentageCalculator,
  'age-calculator': AgeDateCalculator,
  'ats-resume-checker': AtsResumeChecker,
  'cgpa-calculator': CgpaCalculator,
  'resume-builder': ResumeBuilder,
  'unit-converter': UnitConverter,
  'freelance-rate-calculator': FreelanceRateCalculator,
  'us-paycheck-calculator': UsPaycheckCalculator,
  'income-tax-calculator': IncomeTaxNewVsOldCalculator,
  'mortgage-calculator': MortgageCalculator,
  'sip-calculator': SipCalculator,
  'fd-calculator': FdCalculator,
  'ppf-calculator': PpfCalculator,
  '401k-calculator': Retirement401kCalculator,
  'student-loan-calculator': UkStudentLoanCalculator,
  'gst-calculator': ConsumptionTaxCalculator,
  'sales-tax-calculator': ConsumptionTaxCalculator,
  'vat-calculator': ConsumptionTaxCalculator,
};
