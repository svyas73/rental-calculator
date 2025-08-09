export interface PropertyInputs {
  propertyPrice: number;
  propertyType: string;
  squareFootage: number;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  monthlyRent: number;
  rentGrowthRate: number;
  vacancyRate: number;
  propertyTax: number;
  insurance: number;
  hoaFees: number;
  utilities: number;
  maintenance: number;
  propertyManagement: number;
  analysisPeriod: number;
  appreciationRate: number;
  sellingCosts: number;
  taxRate: number;
  inflationRate: number;
  discountRate: number;
  depreciationMethod: string;
  depreciationPeriod: number;
}

export interface MonthlyCashFlow {
  grossRent: number;
  vacancyLoss: number;
  effectiveRent: number;
  propertyTax: number;
  insurance: number;
  hoaFees: number;
  utilities: number;
  maintenance: number;
  propertyManagement: number;
  totalExpenses: number;
  netOperatingIncome: number;
  debtService: number;
  cashFlow: number;
}

export interface YearlyReturn {
  year: number;
  propertyValue: number;
  annualRent: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  debtService: number;
  cashFlow: number;
  roi: number;
  cumulativeRoi: number;
  equity: number;
  depreciation: number;
  taxableIncome: number;
  taxes: number;
  afterTaxCashFlow: number;
}

export interface InvestmentResults {
  monthlyCashFlow: MonthlyCashFlow;
  yearlyReturns: YearlyReturn[];
  irr: number;
  npv: number;
  breakEven: number;
  totalCapitalGain: number;
  cashOnCashRoi: number;
  totalInterestPaid: number;
  totalEquityComponent: number;
}

export interface SensitivityAnalysis {
  rentVariations: Array<{
    rent: number;
    cashFlow: number;
    roi: number;
    irr: number;
  }>;
  appreciationVariations: Array<{
    appreciation: number;
    totalReturn: number;
    irr: number;
  }>;
}

