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
};
