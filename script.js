// Rental Property Investment Calculator
class RentalPropertyCalculator {
    constructor() {
        this.initializeEventListeners();
        this.updateCalculations();
    }

                    initializeEventListeners() {
                    // Calculate button
                    document.getElementById('calculateBtn').addEventListener('click', () => {
                        this.calculateInvestment();
                    });

                    // Auto-update calculations when inputs change
                    const inputs = document.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.addEventListener('input', () => {
                            this.updateCalculations();
                            // Clear error for this field when user starts typing
                            if (input.id) {
                                this.clearError(input.id);
                            }
                            
                            // Update analysis period display in real-time
                            if (input.id === 'analysisPeriod') {
                                const analysisPeriod = parseInt(input.value) || 10;
                                document.getElementById('analysisPeriodDisplay').textContent = `(${analysisPeriod} years)`;
                            }
                        });
                    });

                    // Special handling for down payment percentage
                    document.getElementById('downPaymentPercent').addEventListener('input', (e) => {
                        const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
                        const percent = parseFloat(e.target.value) || 0;
                        const downPayment = (propertyPrice * percent) / 100;
                        document.getElementById('downPayment').value = Math.round(downPayment);
                        this.updateCalculations();
                        this.clearError('downPaymentPercent');
                        this.clearError('downPayment');
                    });

                    document.getElementById('downPayment').addEventListener('input', (e) => {
                        const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
                        const downPayment = parseFloat(e.target.value) || 0;
                        const percent = propertyPrice > 0 ? (downPayment / propertyPrice) * 100 : 0;
                        document.getElementById('downPaymentPercent').value = percent.toFixed(1);
                        this.updateCalculations();
                        this.clearError('downPayment');
                        this.clearError('downPaymentPercent');
                    });

                    // Toggle input section minimize/maximize
                    document.getElementById('toggleInputsBtn').addEventListener('click', () => {
                        const inputSection = document.getElementById('inputSection');
                        const mainContent = document.querySelector('.main-content');
                        const toggleBtn = document.getElementById('toggleInputsBtn');
                        const icon = toggleBtn.querySelector('i');
                        
                        inputSection.classList.toggle('minimized');
                        mainContent.classList.toggle('inputs-collapsed');
                        
                        if (inputSection.classList.contains('minimized')) {
                            icon.className = 'fas fa-chevron-right';
                            toggleBtn.title = 'Maximize Input Section';
                        } else {
                            icon.className = 'fas fa-chevron-left';
                            toggleBtn.title = 'Minimize Input Section';
                        }
                    });

                    // Handle depreciation method change
                    document.getElementById('depreciationMethod').addEventListener('change', (e) => {
                        const method = e.target.value;
                        const periodField = document.getElementById('depreciationPeriod');
                        
                        if (method === 'straight-line') {
                            periodField.value = '27.5';
                        } else if (method === 'accelerated') {
                            periodField.value = '27.5';
                        } else if (method === 'none') {
                            periodField.value = '0';
                        }
                        
                        this.clearError('depreciationMethod');
                    });
                }

    updateCalculations() {
        this.updateLoanAmount();
        this.updateMonthlyPayment();
    }

    updateLoanAmount() {
        const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
        const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
        const loanAmount = Math.max(0, propertyPrice - downPayment);
        document.getElementById('loanAmount').value = Math.round(loanAmount);
    }

    updateMonthlyPayment() {
        const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
        const loanTerm = parseInt(document.getElementById('loanTerm').value) || 30;
        
        if (loanAmount > 0 && interestRate > 0) {
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;
            const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                                 (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            document.getElementById('monthlyPayment').value = Math.round(monthlyPayment);
        } else {
            document.getElementById('monthlyPayment').value = 0;
        }
    }

    getInputValues() {
        return {
            propertyPrice: parseFloat(document.getElementById('propertyPrice').value) || 0,
            downPayment: parseFloat(document.getElementById('downPayment').value) || 0,
            loanAmount: parseFloat(document.getElementById('loanAmount').value) || 0,
            interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
            loanTerm: parseInt(document.getElementById('loanTerm').value) || 30,
            monthlyPayment: parseFloat(document.getElementById('monthlyPayment').value) || 0,
            monthlyRent: parseFloat(document.getElementById('monthlyRent').value) || 0,
            rentGrowthRate: parseFloat(document.getElementById('rentGrowthRate').value) || 0,
            vacancyRate: parseFloat(document.getElementById('vacancyRate').value) || 0,
            propertyTax: parseFloat(document.getElementById('propertyTax').value) || 0,
            insurance: parseFloat(document.getElementById('insurance').value) || 0,
            hoaFees: parseFloat(document.getElementById('hoaFees').value) || 0,
            utilities: parseFloat(document.getElementById('utilities').value) || 0,
            maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
            propertyManagement: parseFloat(document.getElementById('propertyManagement').value) || 0,
            depreciationMethod: document.getElementById('depreciationMethod').value,
            depreciationPeriod: parseFloat(document.getElementById('depreciationPeriod').value) || 27.5,
            landValue: parseFloat(document.getElementById('landValue').value) || 0,
            analysisPeriod: parseInt(document.getElementById('analysisPeriod').value) || 10,
            appreciationRate: parseFloat(document.getElementById('appreciationRate').value) || 0,
            sellingCosts: parseFloat(document.getElementById('sellingCosts').value) || 0,
            taxRate: parseFloat(document.getElementById('taxRate').value) || 0,
            inflationRate: parseFloat(document.getElementById('inflationRate').value) || 0,
            discountRate: parseFloat(document.getElementById('discountRate').value) || 0
        };
    }

                    calculateInvestment() {
                    // Validate all inputs first
                    if (!this.validateInputs()) {
                        return;
                    }
                    
                    const inputs = this.getInputValues();
                    
                    // Calculate monthly cash flow
                    const monthlyCashFlow = this.calculateMonthlyCashFlow(inputs);
                    
                    // Calculate yearly returns
                    const yearlyReturns = this.calculateYearlyReturns(inputs);
                    
                    // Calculate IRR
                    const irr = this.calculateIRR(inputs, yearlyReturns);
                    
                    // Calculate NPV
                    const npv = this.calculateNPV(inputs, yearlyReturns);
                    
                    // Calculate break-even
                    const breakEven = this.calculateBreakEven(inputs, yearlyReturns);
                    
                    // Calculate total capital gain
                    const totalCapitalGain = this.calculateTotalCapitalGain(inputs, yearlyReturns);
                    
                    // Display results
                    this.displayResults(inputs, monthlyCashFlow, yearlyReturns, irr, npv, breakEven, totalCapitalGain);
                    
                    // Show results section
                    document.getElementById('resultsSection').style.display = 'block';
                    
                    // Scroll to results
                    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
                }

                validateInputs() {
                    let isValid = true;
                    
                    // Clear all previous error messages
                    this.clearAllErrors();
                    
                    // Validate Property Information
                    if (!this.validateField('propertyPrice', 'Purchase Price is required', value => value > 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('propertyType', 'Property Type is required', value => value !== '')) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('squareFootage', 'Square Footage is required', value => value > 0)) {
                        isValid = false;
                    }
                    
                    // Validate Financing Details
                    if (!this.validateField('downPayment', 'Down Payment is required', value => value > 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('downPaymentPercent', 'Down Payment % is required', value => value > 0 && value <= 100)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('interestRate', 'Interest Rate is required', value => value > 0 && value <= 20)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('loanTerm', 'Loan Term is required', value => value > 0)) {
                        isValid = false;
                    }
                    
                    // Validate Rental Income
                    if (!this.validateField('monthlyRent', 'Monthly Rent is required', value => value > 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('rentGrowthRate', 'Rent Growth Rate is required', value => value >= 0 && value <= 20)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('vacancyRate', 'Vacancy Rate is required', value => value >= 0 && value <= 50)) {
                        isValid = false;
                    }
                    
                    // Validate Operating Expenses
                    if (!this.validateField('propertyTax', 'Property Tax is required', value => value >= 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('insurance', 'Insurance is required', value => value >= 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('hoaFees', 'HOA Fees is required', value => value >= 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('utilities', 'Utilities is required', value => value >= 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('maintenance', 'Maintenance is required', value => value >= 0)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('propertyManagement', 'Property Management Fee is required', value => value >= 0 && value <= 20)) {
                        isValid = false;
                    }

                    // Validate Depreciation
                    if (!this.validateField('depreciationPeriod', 'Depreciation Period is required', value => value >= 0)) {
                        isValid = false;
                    }

                    if (!this.validateField('landValue', 'Land Value is required', value => value >= 0)) {
                        isValid = false;
                    }
                    
                    // Validate Investment Parameters
                    if (!this.validateField('analysisPeriod', 'Analysis Period is required', value => value >= 1 && value <= 30)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('appreciationRate', 'Appreciation Rate is required', value => value >= 0 && value <= 20)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('sellingCosts', 'Selling Costs is required', value => value >= 0 && value <= 20)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('taxRate', 'Tax Rate is required', value => value >= 0 && value <= 50)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('inflationRate', 'Inflation Rate is required', value => value >= 0 && value <= 20)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('discountRate', 'Discount Rate is required', value => value >= 0 && value <= 20)) {
                        isValid = false;
                    }
                    
                    // Additional validation for logical relationships
                    const propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
                    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
                    const landValue = parseFloat(document.getElementById('landValue').value) || 0;
                    
                    if (downPayment >= propertyPrice) {
                        this.showError('downPayment', 'Down Payment cannot be greater than or equal to Purchase Price');
                        isValid = false;
                    }

                    if (landValue >= propertyPrice) {
                        this.showError('landValue', 'Land Value cannot be greater than or equal to Purchase Price');
                        isValid = false;
                    }
                    
                    return isValid;
                }

                validateField(fieldId, errorMessage, validationFunction) {
                    const field = document.getElementById(fieldId);
                    const value = field.value.trim();
                    
                    if (!value || !validationFunction(parseFloat(value) || value)) {
                        this.showError(fieldId, errorMessage);
                        return false;
                    }
                    
                    return true;
                }

                showError(fieldId, message) {
                    const field = document.getElementById(fieldId);
                    const errorElement = document.getElementById(`${fieldId}-error`);
                    
                    field.classList.add('error');
                    errorElement.textContent = message;
                }

                clearError(fieldId) {
                    const field = document.getElementById(fieldId);
                    const errorElement = document.getElementById(`${fieldId}-error`);
                    
                    field.classList.remove('error');
                    errorElement.textContent = '';
                }

                clearAllErrors() {
                    const errorElements = document.querySelectorAll('.error-message');
                    const errorFields = document.querySelectorAll('.form-field input.error, .form-field select.error');
                    
                    errorElements.forEach(element => {
                        element.textContent = '';
                    });
                    
                    errorFields.forEach(field => {
                        field.classList.remove('error');
                    });
                }

    calculateMonthlyCashFlow(inputs) {
        const grossMonthlyRent = inputs.monthlyRent;
        const vacancyLoss = grossMonthlyRent * (inputs.vacancyRate / 100);
        const effectiveGrossIncome = grossMonthlyRent - vacancyLoss;
        
        const monthlyPropertyTax = inputs.propertyTax / 12;
        const monthlyInsurance = inputs.insurance / 12;
        const monthlyHoaFees = inputs.hoaFees;
        const monthlyUtilities = inputs.utilities;
        const monthlyMaintenance = inputs.maintenance;
        const propertyManagementFee = effectiveGrossIncome * (inputs.propertyManagement / 100);
        
        const totalOperatingExpenses = monthlyPropertyTax + monthlyInsurance + monthlyHoaFees + 
                                     monthlyUtilities + monthlyMaintenance + propertyManagementFee;
        
        const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;
        const debtService = inputs.monthlyPayment;
        const monthlyDepreciation = this.calculateDepreciation(inputs, 1) / 12; // First year depreciation divided by 12
        const monthlyCashFlow = netOperatingIncome - debtService;
        
        return {
            grossMonthlyRent,
            vacancyLoss,
            effectiveGrossIncome,
            totalOperatingExpenses,
            monthlyDepreciation,
            netOperatingIncome,
            debtService,
            monthlyCashFlow
        };
    }

    calculateYearlyReturns(inputs) {
        const returns = [];
        let currentPropertyValue = inputs.propertyPrice;
        let currentMonthlyRent = inputs.monthlyRent;
        let cumulativeCashFlow = 0;
        let cumulativeROI = 0;
        let carriedForwardDepreciation = 0; // Track unclaimed depreciation
        
        for (let year = 1; year <= inputs.analysisPeriod; year++) {
            // Property appreciation
            currentPropertyValue *= (1 + inputs.appreciationRate / 100);
            
            // Rent growth
            currentMonthlyRent *= (1 + inputs.rentGrowthRate / 100);
            
            // Calculate annual cash flow
            const annualCashFlow = this.calculateAnnualCashFlow(inputs, currentMonthlyRent, year);
            cumulativeCashFlow += annualCashFlow;
            
            // Calculate depreciation
            const depreciation = this.calculateDepreciation(inputs, year);
            
            // Calculate equity component paid in mortgage (principal portion) - annual amount
            const equityComponent = this.calculateAnnualEquityComponent(inputs, year);
            
            // Calculate interest payment
            const interestPayment = this.calculateAnnualInterestPayment(inputs, year);
            
            // Calculate net cash flow (NOI - total mortgage payment)
            const netCashFlow = annualCashFlow;
            
            // Calculate taxable cash flow (net cash flow + depreciation)
            const taxableCashFlow = netCashFlow + depreciation;
            
            // Calculate tax savings from depreciation
            const totalDepreciationAvailable = depreciation + carriedForwardDepreciation;
            const taxableIncome = Math.max(0, taxableCashFlow); // Only positive taxable cash flow is taxable
            const taxSavings = Math.min(totalDepreciationAvailable, taxableIncome) * (inputs.taxRate / 100);
            const remainingDepreciation = Math.max(0, totalDepreciationAvailable - taxableIncome);
            
            // Update carried forward depreciation for next year
            carriedForwardDepreciation = remainingDepreciation;
            
            // Calculate total cash flow for ROI (net cash flow + tax savings)
            const totalCashFlowForROI = netCashFlow + taxSavings;
            
            // Calculate enhanced ROI including tax savings
            const annualROI = (totalCashFlowForROI / inputs.downPayment) * 100;
            cumulativeROI += annualROI;
            
            returns.push({
                year,
                propertyValue: currentPropertyValue,
                annualRent: currentMonthlyRent * 12,
                operatingExpenses: this.calculateAnnualOperatingExpenses(inputs, currentMonthlyRent),
                netOperatingIncome: this.calculateAnnualNOI(inputs, currentMonthlyRent),
                totalMortgagePayment: inputs.monthlyPayment * 12,
                interestPayment: interestPayment,
                netCashFlow: netCashFlow,
                taxableCashFlow: taxableCashFlow,
                principalPaid: equityComponent,
                depreciation: depreciation,
                taxSavings: taxSavings,
                carriedForwardDepreciation: carriedForwardDepreciation,
                totalCashFlowForROI: totalCashFlowForROI,
                roi: annualROI,
                cumulativeROI: cumulativeROI
            });
        }
        
        return returns;
    }

    calculateAnnualCashFlow(inputs, monthlyRent, year) {
        const grossAnnualRent = monthlyRent * 12;
        const vacancyLoss = grossAnnualRent * (inputs.vacancyRate / 100);
        const effectiveGrossIncome = grossAnnualRent - vacancyLoss;
        
        const annualPropertyTax = inputs.propertyTax * Math.pow(1 + inputs.inflationRate / 100, year - 1);
        const annualInsurance = inputs.insurance * Math.pow(1 + inputs.inflationRate / 100, year - 1);
        const annualHoaFees = inputs.hoaFees * 12 * Math.pow(1 + inputs.inflationRate / 100, year - 1);
        const annualUtilities = inputs.utilities * 12 * Math.pow(1 + inputs.inflationRate / 100, year - 1);
        const annualMaintenance = inputs.maintenance * 12 * Math.pow(1 + inputs.inflationRate / 100, year - 1);
        const propertyManagementFee = effectiveGrossIncome * (inputs.propertyManagement / 100);
        
        const totalOperatingExpenses = annualPropertyTax + annualInsurance + annualHoaFees + 
                                     annualUtilities + annualMaintenance + propertyManagementFee;
        
        const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;
        const debtService = inputs.monthlyPayment * 12;
        
        return netOperatingIncome - debtService;
    }

    calculateAnnualOperatingExpenses(inputs, monthlyRent) {
        const grossAnnualRent = monthlyRent * 12;
        const annualPropertyTax = inputs.propertyTax;
        const annualInsurance = inputs.insurance;
        const annualHoaFees = inputs.hoaFees * 12;
        const annualUtilities = inputs.utilities * 12;
        const annualMaintenance = inputs.maintenance * 12;
        const propertyManagementFee = grossAnnualRent * (inputs.propertyManagement / 100);
        
        return annualPropertyTax + annualInsurance + annualHoaFees + 
               annualUtilities + annualMaintenance + propertyManagementFee;
    }

    calculateAnnualNOI(inputs, monthlyRent) {
        const grossAnnualRent = monthlyRent * 12;
        const vacancyLoss = grossAnnualRent * (inputs.vacancyRate / 100);
        const effectiveGrossIncome = grossAnnualRent - vacancyLoss;
        const operatingExpenses = this.calculateAnnualOperatingExpenses(inputs, monthlyRent);
        
        return effectiveGrossIncome - operatingExpenses;
    }

    calculateIRR(inputs, yearlyReturns) {
        const cashFlows = [-inputs.downPayment]; // Initial investment (negative)
        
        // Add yearly cash flows
        yearlyReturns.forEach(return_ => {
            cashFlows.push(return_.cashFlow);
        });
        
        // Add final sale proceeds
        const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1].propertyValue;
        const sellingCosts = finalPropertyValue * (inputs.sellingCosts / 100);
        const remainingLoanBalance = this.calculateRemainingLoanBalance(inputs, inputs.analysisPeriod);
        const saleProceeds = finalPropertyValue - sellingCosts - remainingLoanBalance;
        
        cashFlows.push(saleProceeds);
        
        // Calculate IRR using Newton-Raphson method
        return this.calculateIRRNewtonRaphson(cashFlows);
    }

    calculateIRRNewtonRaphson(cashFlows, guess = 0.1, maxIterations = 100, tolerance = 0.0001) {
        let rate = guess;
        
        for (let i = 0; i < maxIterations; i++) {
            const npv = this.calculateNPVFromRate(cashFlows, rate);
            const derivative = this.calculateNPVDerivative(cashFlows, rate);
            
            if (Math.abs(derivative) < tolerance) {
                break;
            }
            
            const newRate = rate - npv / derivative;
            
            if (Math.abs(newRate - rate) < tolerance) {
                rate = newRate;
                break;
            }
            
            rate = newRate;
        }
        
        return rate * 100; // Convert to percentage
    }

    calculateNPVFromRate(cashFlows, rate) {
        let npv = 0;
        for (let i = 0; i < cashFlows.length; i++) {
            npv += cashFlows[i] / Math.pow(1 + rate, i);
        }
        return npv;
    }

    calculateNPVDerivative(cashFlows, rate) {
        let derivative = 0;
        for (let i = 1; i < cashFlows.length; i++) {
            derivative -= i * cashFlows[i] / Math.pow(1 + rate, i + 1);
        }
        return derivative;
    }

    calculateNPV(inputs, yearlyReturns) {
        const discountRate = inputs.discountRate / 100;
        let npv = -inputs.downPayment; // Initial investment
        
        // Add discounted yearly cash flows
        yearlyReturns.forEach((return_, index) => {
            const discountedCashFlow = return_.cashFlow / Math.pow(1 + discountRate, index + 1);
            npv += discountedCashFlow;
        });
        
        // Add discounted sale proceeds
        const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1].propertyValue;
        const sellingCosts = finalPropertyValue * (inputs.sellingCosts / 100);
        const remainingLoanBalance = this.calculateRemainingLoanBalance(inputs, inputs.analysisPeriod);
        const saleProceeds = finalPropertyValue - sellingCosts - remainingLoanBalance;
        const discountedSaleProceeds = saleProceeds / Math.pow(1 + discountRate, inputs.analysisPeriod);
        
        npv += discountedSaleProceeds;
        
        return npv;
    }

    calculateBreakEven(inputs, yearlyReturns) {
        let cumulativeCashFlow = 0;
        
        for (let i = 0; i < yearlyReturns.length; i++) {
            cumulativeCashFlow += yearlyReturns[i].cashFlow;
            if (cumulativeCashFlow >= 0) {
                return i + 1; // Return year number (1-based)
            }
        }
        
        return null; // No break-even point found
    }

    calculateTotalCapitalGain(inputs, yearlyReturns) {
        if (yearlyReturns.length === 0) return 0;
        
        const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1].propertyValue;
        const sellingCosts = finalPropertyValue * (inputs.sellingCosts / 100);
        const remainingLoanBalance = this.calculateRemainingLoanBalance(inputs, inputs.analysisPeriod);
        
        // Total capital gain = Sale proceeds - Initial investment
        const saleProceeds = finalPropertyValue - sellingCosts - remainingLoanBalance;
        const totalCapitalGain = saleProceeds - inputs.downPayment;
        
        return totalCapitalGain;
    }

    calculateRemainingLoanBalance(inputs, years) {
        const monthlyRate = inputs.interestRate / 100 / 12;
        const numberOfPayments = inputs.loanTerm * 12;
        const paymentsMade = years * 12;
        const remainingPayments = numberOfPayments - paymentsMade;
        
        if (remainingPayments <= 0) {
            return 0;
        }
        
        return inputs.monthlyPayment * 
               (1 - Math.pow(1 + monthlyRate, -remainingPayments)) / monthlyRate;
    }

    calculateTotalInterestPaid(inputs, years) {
        const monthlyRate = inputs.interestRate / 100 / 12;
        const numberOfPayments = inputs.loanTerm * 12;
        const paymentsMade = years * 12;
        
        if (paymentsMade >= numberOfPayments) {
            // Loan is fully paid
            const totalPayments = inputs.monthlyPayment * numberOfPayments;
            return totalPayments - inputs.loanAmount;
        }
        
        // Calculate total interest paid for the given number of years
        let totalInterest = 0;
        let remainingBalance = inputs.loanAmount;
        
        for (let month = 1; month <= paymentsMade; month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = inputs.monthlyPayment - interestPayment;
            totalInterest += interestPayment;
            remainingBalance -= principalPayment;
        }
        
        return totalInterest;
    }

    calculateAnnualEquityComponent(inputs, year) {
        const monthlyRate = inputs.interestRate / 100 / 12;
        const numberOfPayments = inputs.loanTerm * 12;
        const startMonth = (year - 1) * 12 + 1;
        const endMonth = year * 12;
        
        if (startMonth > numberOfPayments) {
            return 0; // Loan already paid off
        }

        let annualPrincipal = 0;
        let remainingBalance = this.calculateRemainingLoanBalance(inputs, year - 1);

        for (let month = startMonth; month <= Math.min(endMonth, numberOfPayments); month++) {
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = inputs.monthlyPayment - interestPayment;
            annualPrincipal += principalPayment;
            remainingBalance -= principalPayment;
        }
        
        return annualPrincipal;
    }

    calculateAnnualInterestPayment(inputs, year) {
        // Calculate the interest portion of the mortgage payment for a specific year
        const totalAnnualPayment = inputs.monthlyPayment * 12;
        const principalPaid = this.calculateAnnualEquityComponent(inputs, year);
        return totalAnnualPayment - principalPaid;
    }

    calculateDepreciation(inputs, year) {
        if (inputs.depreciationMethod === 'none' || inputs.depreciationPeriod <= 0) {
            return 0;
        }

        const depreciableValue = inputs.propertyPrice - inputs.landValue;
        
        if (depreciableValue <= 0) {
            return 0;
        }

        if (inputs.depreciationMethod === 'straight-line') {
            // Straight-line depreciation
            const annualDepreciation = depreciableValue / inputs.depreciationPeriod;
            return Math.min(annualDepreciation, depreciableValue - (annualDepreciation * (year - 1)));
        } else if (inputs.depreciationMethod === 'accelerated') {
            // MACRS-like accelerated depreciation (simplified)
            const rates = [0.03636, 0.03455, 0.03182, 0.02941, 0.02727, 0.02564, 0.02439, 0.02326, 0.02222, 0.02128, 
                          0.02041, 0.01961, 0.01887, 0.01818, 0.01754, 0.01695, 0.01639, 0.01587, 0.01538, 0.01493,
                          0.01449, 0.01408, 0.0137, 0.01333, 0.01299, 0.01266, 0.01235, 0.01205, 0.01176, 0.01149, 0.01122];
            
            if (year <= rates.length) {
                return depreciableValue * rates[year - 1];
            } else {
                return 0;
            }
        }
        
        return 0;
    }

    displayResults(inputs, monthlyCashFlow, yearlyReturns, irr, npv, breakEven, totalCapitalGain) {
        // Update analysis period display
        document.getElementById('analysisPeriodDisplay').textContent = `(${inputs.analysisPeriod} years)`;
        
        // Display summary cards
        document.getElementById('cashOnCashROI').textContent = this.formatCurrency(totalCapitalGain);
        document.getElementById('irrValue').textContent = `${irr.toFixed(2)}%`;
        document.getElementById('npvValue').textContent = this.formatCurrency(npv);
        document.getElementById('breakEvenYears').textContent = breakEven ? `${breakEven} years` : 'Never';
        
        // Display monthly cash flow
        document.getElementById('grossMonthlyRent').textContent = this.formatCurrency(monthlyCashFlow.grossMonthlyRent);
        document.getElementById('vacancyLoss').textContent = this.formatCurrency(monthlyCashFlow.vacancyLoss);
        document.getElementById('effectiveGrossIncome').textContent = this.formatCurrency(monthlyCashFlow.effectiveGrossIncome);
        document.getElementById('operatingExpenses').textContent = this.formatCurrency(monthlyCashFlow.totalOperatingExpenses);
        document.getElementById('netOperatingIncome').textContent = this.formatCurrency(monthlyCashFlow.netOperatingIncome);
        document.getElementById('debtService').textContent = this.formatCurrency(monthlyCashFlow.debtService);
        document.getElementById('monthlyDepreciation').textContent = this.formatCurrency(monthlyCashFlow.monthlyDepreciation);
        document.getElementById('monthlyCashFlow').textContent = this.formatCurrency(monthlyCashFlow.monthlyCashFlow);
        
        // Display yearly returns table
        this.displayYearlyReturnsTable(yearlyReturns);
        
        // Display IRR analysis
        this.displayIRRAnalysis(inputs, yearlyReturns, irr);
        
        // Display sensitivity analysis
        this.displaySensitivityAnalysis(inputs);
    }

    displayYearlyReturnsTable(yearlyReturns) {
        const tbody = document.getElementById('returnsTableBody');
        tbody.innerHTML = '';
        
        yearlyReturns.forEach(return_ => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${return_.year}</td>
                <td>${this.formatCurrency(return_.propertyValue)}</td>
                <td>${this.formatCurrency(return_.annualRent)}</td>
                <td>${this.formatCurrency(return_.operatingExpenses)}</td>
                <td>${this.formatCurrency(return_.netOperatingIncome)}</td>
                <td>${this.formatCurrency(return_.totalMortgagePayment)}</td>
                <td>${this.formatCurrency(return_.interestPayment)}</td>
                <td class="${return_.netCashFlow >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(return_.netCashFlow)}</td>
                <td class="${return_.taxableCashFlow >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(return_.taxableCashFlow)}</td>
                <td>${this.formatCurrency(return_.principalPaid)}</td>
                <td>${this.formatCurrency(return_.depreciation)}</td>
                <td class="positive">${this.formatCurrency(return_.taxSavings)}</td>
                <td>${this.formatCurrency(return_.carriedForwardDepreciation)}</td>
                <td class="${return_.totalCashFlowForROI >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(return_.totalCashFlowForROI)}</td>
                <td class="${return_.roi >= 0 ? 'positive' : 'negative'}">${return_.roi.toFixed(2)}%</td>
                <td class="${return_.cumulativeROI >= 0 ? 'positive' : 'negative'}">${return_.cumulativeROI.toFixed(2)}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    displayIRRAnalysis(inputs, yearlyReturns, irr) {
        const totalCashFlow = yearlyReturns.reduce((sum, return_) => sum + return_.totalCashFlowForROI, 0);
        const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1].propertyValue;
        const sellingCosts = finalPropertyValue * (inputs.sellingCosts / 100);
        const remainingLoanBalance = this.calculateRemainingLoanBalance(inputs, inputs.analysisPeriod);
        const saleProceeds = finalPropertyValue - sellingCosts - remainingLoanBalance;
        const capitalGain = saleProceeds - inputs.downPayment;
        
        // Debug: Log individual cash flows to understand the low total
        console.log('Individual yearly cash flows:');
        yearlyReturns.forEach((return_, index) => {
            console.log(`Year ${return_.year}: $${return_.totalCashFlowForROI.toFixed(2)}`);
        });
        console.log(`Total Cash Flow: $${totalCashFlow.toFixed(2)}`);
        
        document.getElementById('initialInvestment').textContent = this.formatCurrency(inputs.downPayment);
        document.getElementById('holdingPeriod').textContent = `${inputs.analysisPeriod} years`;
        document.getElementById('totalCashFlow').textContent = this.formatCurrency(totalCashFlow);
        document.getElementById('saleProceeds').textContent = this.formatCurrency(capitalGain);
        document.getElementById('irrFinal').textContent = `${irr.toFixed(2)}%`;
        
        // Draw IRR chart
        this.drawIRRChart(yearlyReturns);
    }

    drawIRRChart(yearlyReturns) {
        const canvas = document.getElementById('irrChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up chart with better padding for labels
        const leftPadding = 80;  // More space for Y-axis labels
        const rightPadding = 20;
        const topPadding = 30;   // Space for title
        const bottomPadding = 50; // More space for X-axis labels
        const chartWidth = canvas.width - leftPadding - rightPadding;
        const chartHeight = canvas.height - topPadding - bottomPadding;
        
        // Find min and max values for cash flows
        const cashFlows = yearlyReturns.map(r => r.totalCashFlowForROI);
        const minCashFlow = Math.min(...cashFlows);
        const maxCashFlow = Math.max(...cashFlows);
        const range = maxCashFlow - minCashFlow;
        
        // Ensure range is not zero for proper scaling
        const adjustedRange = range === 0 ? Math.abs(maxCashFlow) || 1000 : range;
        const adjustedMin = range === 0 ? minCashFlow - 500 : minCashFlow;
        
        // Draw chart title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Annual Cash Flow Over Time', canvas.width / 2, 20);
        
        // Draw axes
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Y-axis
        ctx.moveTo(leftPadding, topPadding);
        ctx.lineTo(leftPadding, canvas.height - bottomPadding);
        // X-axis
        ctx.moveTo(leftPadding, canvas.height - bottomPadding);
        ctx.lineTo(canvas.width - rightPadding, canvas.height - bottomPadding);
        ctx.stroke();
        
        // Draw Y-axis grid lines and labels
        ctx.strokeStyle = '#f7fafc';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px Inter';
        ctx.textAlign = 'right';
        
        const numGridLines = 5;
        for (let i = 0; i <= numGridLines; i++) {
            const value = adjustedMin + (adjustedRange * i / numGridLines);
            const y = canvas.height - bottomPadding - (adjustedRange * i / numGridLines) * chartHeight;
            
            // Grid line
            ctx.beginPath();
            ctx.moveTo(leftPadding, y);
            ctx.lineTo(canvas.width - rightPadding, y);
            ctx.stroke();
            
            // Y-axis label with better positioning
            const labelText = this.formatCurrency(value);
            ctx.fillText(labelText, leftPadding - 15, y + 4);
        }
        
        // Draw Y-axis title
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(30, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Cash Flow ($)', 0, 0);
        ctx.restore();
        
        // Draw X-axis labels (year numbers)
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        yearlyReturns.forEach((return_, index) => {
            const x = leftPadding + (index / (yearlyReturns.length - 1)) * chartWidth;
            ctx.fillText(return_.year.toString(), x, canvas.height - bottomPadding + 20);
        });
        
        // Draw cash flow line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        yearlyReturns.forEach((return_, index) => {
            const x = leftPadding + (index / (yearlyReturns.length - 1)) * chartWidth;
            const y = canvas.height - bottomPadding - ((return_.totalCashFlowForROI - adjustedMin) / adjustedRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#667eea';
        yearlyReturns.forEach((return_, index) => {
            const x = leftPadding + (index / (yearlyReturns.length - 1)) * chartWidth;
            const y = canvas.height - bottomPadding - ((return_.totalCashFlowForROI - adjustedMin) / adjustedRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add white border to data points
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Draw axis labels
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        
        // X-axis label
        ctx.fillText('Year', canvas.width / 2, canvas.height - 10);
        
        // Y-axis label
        ctx.save();
        ctx.translate(20, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Cash Flow ($)', 0, 0);
        ctx.restore();
    }

    displaySensitivityAnalysis(inputs) {
        this.displayRentSensitivity(inputs);
        this.displayAppreciationSensitivity(inputs);
    }

    displayRentSensitivity(inputs) {
        const tbody = document.getElementById('rentSensitivityBody');
        tbody.innerHTML = '';
        
        const rentChanges = [-20, -10, 0, 10, 20]; // Percentage changes
        
        rentChanges.forEach(change => {
            const adjustedRent = inputs.monthlyRent * (1 + change / 100);
            const adjustedInputs = { ...inputs, monthlyRent: adjustedRent };
            
            const monthlyCashFlow = this.calculateMonthlyCashFlow(adjustedInputs);
            const yearlyReturns = this.calculateYearlyReturns(adjustedInputs);
            const irr = this.calculateIRR(adjustedInputs, yearlyReturns);
            const totalCapitalGain = this.calculateTotalCapitalGain(adjustedInputs, yearlyReturns);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${change > 0 ? '+' : ''}${change}%</td>
                <td class="${monthlyCashFlow.monthlyCashFlow >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(monthlyCashFlow.monthlyCashFlow)}</td>
                <td class="${totalCapitalGain >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(totalCapitalGain)}</td>
                <td class="${irr >= 0 ? 'positive' : 'negative'}">${irr.toFixed(2)}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    displayAppreciationSensitivity(inputs) {
        const tbody = document.getElementById('appreciationSensitivityBody');
        tbody.innerHTML = '';
        
        const appreciationRates = [1, 2, 3, 4, 5]; // Percentage rates
        
        appreciationRates.forEach(rate => {
            const adjustedInputs = { ...inputs, appreciationRate: rate };
            const yearlyReturns = this.calculateYearlyReturns(adjustedInputs);
            const irr = this.calculateIRR(adjustedInputs, yearlyReturns);
            const finalPropertyValue = yearlyReturns[yearlyReturns.length - 1].propertyValue;
            const totalReturn = (finalPropertyValue - inputs.propertyPrice) / inputs.propertyPrice * 100;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rate}%</td>
                <td>${this.formatCurrency(finalPropertyValue)}</td>
                <td class="${totalReturn >= 0 ? 'positive' : 'negative'}">${totalReturn.toFixed(2)}%</td>
                <td class="${irr >= 0 ? 'positive' : 'negative'}">${irr.toFixed(2)}%</td>
            `;
            tbody.appendChild(row);
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RentalPropertyCalculator();
}); 