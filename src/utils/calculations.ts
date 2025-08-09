import { PropertyInputs, MonthlyCashFlow, YearlyReturn, InvestmentResults } from '../types';

export class RentalCalculator {
  static calculateMonthlyCashFlow(inputs: PropertyInputs): MonthlyCashFlow {
    const grossRent = inputs.monthlyRent;
    const vacancyLoss = grossRent * (inputs.vacancyRate / 100);
    const effectiveRent = grossRent - vacancyLoss;
    
    const propertyTax = inputs.propertyTax / 12;
    const insurance = inputs.insurance / 12;
    const hoaFees = inputs.hoaFees;
    const utilities = inputs.utilities;
    const maintenance = inputs.maintenance;
    const propertyManagement = effectiveRent * (inputs.propertyManagement / 100);
    
    const totalExpenses = propertyTax + insurance + hoaFees + utilities + maintenance + propertyManagement;
    const netOperatingIncome = effectiveRent - totalExpenses;
    const debtService = inputs.monthlyPayment;
    const cashFlow = netOperatingIncome - debtService;
    
    return {
      grossRent,
      vacancyLoss,
      effectiveRent,
      propertyTax,
      insurance,
      hoaFees,
      utilities,
      maintenance,
      propertyManagement,
      totalExpenses,
      netOperatingIncome,
      debtService,
      cashFlow
    };
  }

  static calculateYearlyReturns(inputs: PropertyInputs): YearlyReturn[] {
    const yearlyReturns: YearlyReturn[] = [];
    let cumulativeCashFlow = 0;
    let totalEquityComponent = 0;
    let totalInterestPaid = 0;
    
    for (let year = 1; year <= inputs.analysisPeriod; year++) {
      const propertyValue = inputs.propertyPrice * Math.pow(1 + inputs.appreciationRate / 100, year);
      const annualRent = inputs.monthlyRent * 12 * Math.pow(1 + inputs.rentGrowthRate / 100, year - 1);
      const operatingExpenses = this.calculateAnnualOperatingExpenses(inputs, inputs.monthlyRent, year);
      const netOperatingIncome = annualRent - operatingExpenses;
      const debtService = inputs.monthlyPayment * 12;
      const cashFlow = netOperatingIncome - debtService;
      
      cumulativeCashFlow += cashFlow;
      const roi = (cashFlow / inputs.downPayment) * 100;
      const cumulativeRoi = (cumulativeCashFlow / inputs.downPayment) * 100;
      
      const equity = this.calculateAnnualEquityComponent(inputs, year);
      totalEquityComponent += equity;
      
      const interestPaid = this.calculateAnnualInterestPayment(inputs, year);
      totalInterestPaid += interestPaid;
      
      const depreciation = this.calculateDepreciation(inputs, year);
      const taxableIncome = netOperatingIncome - depreciation - interestPaid;
      const taxes = taxableIncome * (inputs.taxRate / 100);
      const afterTaxCashFlow = cashFlow - taxes;
      
      yearlyReturns.push({
        year,
        propertyValue,
        annualRent,
        operatingExpenses,
        netOperatingIncome,
        debtService,
        cashFlow,
        roi,
        cumulativeRoi,
        equity,
        depreciation,
        taxableIncome,
        taxes,
        afterTaxCashFlow
      });
    }
    
    return yearlyReturns;
  }

  static calculateIRR(inputs: PropertyInputs, yearlyReturns: YearlyReturn[]): number {
    const cashFlows = [-inputs.downPayment];
    yearlyReturns.forEach(return_ => {
      cashFlows.push(return_.cashFlow);
    });
    
    // Add final sale proceeds
    const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1]?.propertyValue || inputs.propertyPrice;
    const sellingCosts = finalPropertyValue * (inputs.sellingCosts / 100);
    const finalCashFlow = finalPropertyValue - sellingCosts - (inputs.loanAmount - yearlyReturns[yearlyReturns.length - 1]?.equity || 0);
    cashFlows.push(finalCashFlow);
    
    return this.calculateIRRNewtonRaphson(cashFlows);
  }

  static calculateIRRNewtonRaphson(cashFlows: number[], guess = 0.1, maxIterations = 100, tolerance = 0.0001): number {
    let rate = guess;
    
    for (let i = 0; i < maxIterations; i++) {
      const npv = this.calculateNPVFromRate(cashFlows, rate);
      const derivative = this.calculateNPVDerivative(cashFlows, rate);
      
      if (Math.abs(derivative) < tolerance) {
        break;
      }
      
      const newRate = rate - npv / derivative;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate * 100; // Convert to percentage
      }
      
      rate = newRate;
    }
    
    return rate * 100;
  }

  static calculateNPVFromRate(cashFlows: number[], rate: number): number {
    let npv = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      npv += cashFlows[i] / Math.pow(1 + rate, i);
    }
    return npv;
  }

  static calculateNPVDerivative(cashFlows: number[], rate: number): number {
    let derivative = 0;
    for (let i = 1; i < cashFlows.length; i++) {
      derivative -= i * cashFlows[i] / Math.pow(1 + rate, i + 1);
    }
    return derivative;
  }

  static calculateNPV(inputs: PropertyInputs, yearlyReturns: YearlyReturn[]): number {
    const cashFlows = [-inputs.downPayment];
    yearlyReturns.forEach(return_ => {
      cashFlows.push(return_.cashFlow);
    });
    
    const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1]?.propertyValue || inputs.propertyPrice;
    const sellingCosts = finalPropertyValue * (inputs.sellingCosts / 100);
    const finalCashFlow = finalPropertyValue - sellingCosts - (inputs.loanAmount - yearlyReturns[yearlyReturns.length - 1]?.equity || 0);
    cashFlows.push(finalCashFlow);
    
    return this.calculateNPVFromRate(cashFlows, inputs.discountRate / 100);
  }

  static calculateBreakEven(inputs: PropertyInputs, yearlyReturns: YearlyReturn[]): number {
    let cumulativeCashFlow = 0;
    
    for (let i = 0; i < yearlyReturns.length; i++) {
      cumulativeCashFlow += yearlyReturns[i].cashFlow;
      if (cumulativeCashFlow >= 0) {
        return i + 1;
      }
    }
    
    return -1; // No break-even point found
  }

  static calculateTotalCapitalGain(inputs: PropertyInputs, yearlyReturns: YearlyReturn[]): number {
    const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1]?.propertyValue || inputs.propertyPrice;
    const sellingCosts = finalPropertyValue * (inputs.sellingCosts / 100);
    const remainingLoan = inputs.loanAmount - (yearlyReturns[yearlyReturns.length - 1]?.equity || 0);
    
    return finalPropertyValue - sellingCosts - remainingLoan - inputs.downPayment;
  }

  static calculateCashOnCashROI(inputs: PropertyInputs, monthlyCashFlow: MonthlyCashFlow): number {
    const annualCashFlow = monthlyCashFlow.cashFlow * 12;
    return (annualCashFlow / inputs.downPayment) * 100;
  }

  private static calculateAnnualOperatingExpenses(inputs: PropertyInputs, monthlyRent: number, year: number): number {
    const baseExpenses = (inputs.propertyTax + inputs.insurance + inputs.hoaFees * 12 + inputs.utilities * 12 + inputs.maintenance * 12);
    const propertyManagement = monthlyRent * 12 * (inputs.propertyManagement / 100);
    return baseExpenses * Math.pow(1 + inputs.inflationRate / 100, year - 1) + propertyManagement;
  }

  private static calculateAnnualEquityComponent(inputs: PropertyInputs, year: number): number {
    const monthlyRate = inputs.interestRate / 100 / 12;
    const totalPayments = inputs.loanTerm * 12;
    const remainingPayments = totalPayments - (year - 1) * 12;
    
    const monthlyPayment = inputs.monthlyPayment;
    const remainingBalance = inputs.loanAmount * Math.pow(1 + monthlyRate, remainingPayments) - 
                            monthlyPayment * (Math.pow(1 + monthlyRate, remainingPayments) - 1) / monthlyRate;
    
    return inputs.loanAmount - remainingBalance;
  }

  private static calculateAnnualInterestPayment(inputs: PropertyInputs, year: number): number {
    const monthlyRate = inputs.interestRate / 100 / 12;
    const totalPayments = inputs.loanTerm * 12;
    const remainingPayments = totalPayments - (year - 1) * 12;
    
    const monthlyPayment = inputs.monthlyPayment;
    const remainingBalance = inputs.loanAmount * Math.pow(1 + monthlyRate, remainingPayments) - 
                            monthlyPayment * (Math.pow(1 + monthlyRate, remainingPayments) - 1) / monthlyRate;
    
    return monthlyPayment * 12 - (inputs.loanAmount - remainingBalance);
  }

  private static calculateDepreciation(inputs: PropertyInputs, year: number): number {
    if (inputs.depreciationMethod === 'none' || inputs.depreciationPeriod === 0) {
      return 0;
    }
    
    const depreciableValue = inputs.propertyPrice * 0.8; // 80% of property value is depreciable
    const annualDepreciation = depreciableValue / inputs.depreciationPeriod;
    
    if (year <= inputs.depreciationPeriod) {
      return annualDepreciation;
    }
    
    return 0;
  }

  static calculateInvestment(inputs: PropertyInputs): InvestmentResults {
    const monthlyCashFlow = this.calculateMonthlyCashFlow(inputs);
    const yearlyReturns = this.calculateYearlyReturns(inputs);
    const irr = this.calculateIRR(inputs, yearlyReturns);
    const npv = this.calculateNPV(inputs, yearlyReturns);
    const breakEven = this.calculateBreakEven(inputs, yearlyReturns);
    const totalCapitalGain = this.calculateTotalCapitalGain(inputs, yearlyReturns);
    const cashOnCashRoi = this.calculateCashOnCashROI(inputs, monthlyCashFlow);
    
    const totalInterestPaid = yearlyReturns.reduce((sum, return_) => {
      return sum + (return_.debtService - return_.equity);
    }, 0);
    
    const totalEquityComponent = yearlyReturns.reduce((sum, return_) => {
      return sum + return_.equity;
    }, 0);
    
    return {
      monthlyCashFlow,
      yearlyReturns,
      irr,
      npv,
      breakEven,
      totalCapitalGain,
      cashOnCashRoi,
      totalInterestPaid,
      totalEquityComponent
    };
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }
}

