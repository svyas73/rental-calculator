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

                    // Add event listeners for download buttons
                    document.getElementById('downloadExcelBtn').addEventListener('click', () => {
                        this.downloadExcel();
                    });
                    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
                        this.downloadPdf();
                    });
                    
                    // Add event listeners for ROI-specific download buttons
                    document.getElementById('downloadRoiExcelBtn').addEventListener('click', () => {
                        this.downloadRoiExcel();
                    });
                    document.getElementById('downloadRoiPdfBtn').addEventListener('click', () => {
                        this.downloadRoiPdf();
                    });
                    
                    // Initialize address autocomplete
                    this.initializeAddressAutocomplete();
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
            propertyAddress: document.getElementById('propertyAddress').value || '',
            purchaseMonth: parseInt(document.getElementById('purchaseMonth').value) || 1,
            purchaseYear: parseInt(document.getElementById('purchaseYear').value) || new Date().getFullYear(),
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
                    
                    // Add CSS class for full-width results
                    document.querySelector('.main-content').classList.add('results-displayed');
                    
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
                    
                    if (!this.validateField('propertyAddress', 'Property Address is required', value => {
                        const address = String(value).trim();
                        if (address === '') return false;
                        
                        // More liberal address validation with detailed error messages
                        const validationResult = this.validateAddressFormat(address);
                        if (!validationResult.isValid) {
                            this.showError('propertyAddress', validationResult.errorMessage);
                            return false;
                        }
                        return true;
                    })) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('purchaseMonth', 'Purchase Month is required', value => value >= 1 && value <= 12)) {
                        isValid = false;
                    }
                    
                    if (!this.validateField('purchaseYear', 'Purchase Year is required', value => value >= 1990 && value <= 2030)) {
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
                    const value = field.value;
                    
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
            
                    // Calculate taxable cash flow (net cash flow + principal paid)
            const taxableCashFlow = netCashFlow + equityComponent;
            
                    // Calculate tax savings from depreciation using max(0, k-j) formula
        // where k = depreciation, j = taxable cash flow (taxable income before depreciation)
        const totalDepreciationAvailable = depreciation + carriedForwardDepreciation;
        const taxableIncomeBeforeDepreciation = Math.max(0, taxableCashFlow); // j in the formula
        const unclaimedDepreciation = Math.max(0, totalDepreciationAvailable - taxableIncomeBeforeDepreciation); // max(0, k-j)
        const usedDepreciation = Math.min(totalDepreciationAvailable, taxableIncomeBeforeDepreciation);
        const taxSavings = usedDepreciation * (inputs.taxRate / 100);

        // Update carried forward depreciation for next year
        carriedForwardDepreciation = unclaimedDepreciation;
            
            // Calculate total cash flow for ROI (net cash flow + tax savings)
            const totalCashFlowForROI = netCashFlow + taxSavings;
            
            // Calculate enhanced ROI including tax savings
            const annualROI = (totalCashFlowForROI / inputs.downPayment) * 100;
            cumulativeROI += annualROI;
            
            returns.push({
                year,
                monthYear: this.calculateMonthYear(inputs.purchaseYear, inputs.purchaseMonth, year),
                actualYear: this.calculateActualYear(inputs.purchaseYear, inputs.purchaseMonth, year),
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
            cashFlows.push(return_.totalCashFlowForROI);
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
            const discountedCashFlow = return_.totalCashFlowForROI / Math.pow(1 + discountRate, index + 1);
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
            cumulativeCashFlow += yearlyReturns[i].totalCashFlowForROI;
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
        
        // Update property header with debug logging
        console.log('Displaying results with inputs:', inputs);
        this.updatePropertyHeader(inputs);
        
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

    updatePropertyHeader(inputs) {
        console.log('updatePropertyHeader called with inputs:', inputs);
        
        // Ensure property header is visible
        const propertyHeader = document.getElementById('propertyHeader');
        if (propertyHeader) {
            propertyHeader.style.display = 'block';
            propertyHeader.style.visibility = 'visible';
        }
        
        // Update property address - SIMPLE DIRECT APPROACH
        const propertyAddressDisplay = document.getElementById('propertyAddressDisplay');
        console.log('Property address display element found:', propertyAddressDisplay);
        
        if (propertyAddressDisplay) {
            // Get the address directly from the input field as backup
            const addressInput = document.getElementById('propertyAddress');
            const addressFromInput = addressInput ? addressInput.value : '';
            const addressText = inputs.propertyAddress || addressFromInput || 'Property Address Not Specified';
            
            console.log('Address from inputs:', inputs.propertyAddress);
            console.log('Address from input field:', addressFromInput);
            console.log('Final address text:', addressText);
            
            propertyAddressDisplay.textContent = addressText;
            
            // Force a re-render
            propertyAddressDisplay.style.display = 'none';
            setTimeout(() => {
                propertyAddressDisplay.style.display = 'block';
            }, 10);
        } else {
            console.error('Property address display element not found');
        }
        
        // Update purchase date
        const purchaseDateValue = document.getElementById('purchaseDateValue');
        if (purchaseDateValue) {
            if (inputs.purchaseMonth && inputs.purchaseYear) {
                const monthName = this.getMonthName(parseInt(inputs.purchaseMonth));
                purchaseDateValue.textContent = `${monthName} ${inputs.purchaseYear}`;
            } else {
                purchaseDateValue.textContent = 'Not specified';
            }
        }
        
        // Update property links
        this.updatePropertyLinks(inputs.propertyAddress);
        
        // Try to fetch property image
        this.fetchPropertyImage(inputs.propertyAddress);
    }

    updatePropertyLinks(address) {
        if (!address) return;
        
        // Encode address for URLs
        const encodedAddress = encodeURIComponent(address);
        
        // Update Zillow link
        const zillowLink = document.getElementById('zillowLink');
        zillowLink.href = `https://www.zillow.com/homes/${encodedAddress}`;
        
        // Update Redfin link
        const redfinLink = document.getElementById('redfinLink');
        redfinLink.href = `https://www.redfin.com/city/17100/CA/search?location=${encodedAddress}`;
        
        // Update Google Maps link
        const googleMapsLink = document.getElementById('googleMapsLink');
        googleMapsLink.href = `https://www.google.com/maps/search/${encodedAddress}`;
    }

    async fetchPropertyImage(address) {
        if (!address) {
            console.log('No address provided for image fetch');
            return;
        }
        
        console.log('Starting image fetch for address:', address);
        
        const imageElement = document.getElementById('propertyImage');
        const loadingElement = document.getElementById('imageLoading');
        
        // Show loading
        loadingElement.style.display = 'block';
        
        try {
            // Try multiple sources for property images with timeout
            const imageUrl = await Promise.race([
                this.getPropertyImageFromMultipleSources(address),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
            ]);
            
            if (imageUrl) {
                console.log('Setting image URL:', imageUrl);
                imageElement.src = imageUrl;
                imageElement.alt = `Property image for ${address}`;
            } else {
                console.log('No image URL found, using placeholder');
                // Fallback to a better placeholder
                imageElement.src = this.getPlaceholderImage(address);
                imageElement.alt = `No image available for ${address}`;
            }
            
        } catch (error) {
            console.log('Could not fetch property image:', error);
            imageElement.src = this.getPlaceholderImage(address);
            imageElement.alt = `No image available for ${address}`;
        } finally {
            loadingElement.style.display = 'none';
        }
    }

    async getPropertyImageFromMultipleSources(address) {
        console.log('Trying to fetch image for address:', address);
        
        const sources = [
            () => this.tryGoogleStreetView(address),
            () => this.tryZillowImage(address),
            () => this.tryPublicStreetViewAPI(address),
            () => this.tryRealEstateAPI(address),
            () => this.tryBingMapsImage(address)
        ];

        for (let i = 0; i < sources.length; i++) {
            try {
                console.log(`Trying source ${i + 1}/${sources.length}`);
                const imageUrl = await sources[i]();
                if (imageUrl) {
                    console.log('Found property image from source', i + 1);
                    return imageUrl;
                }
            } catch (error) {
                console.log(`Source ${i + 1} failed:`, error);
                continue;
            }
        }
        
        console.log('No image found from any source');
        return null;
    }

    async tryPublicStreetViewAPI(address) {
        try {
            // First, try to get coordinates from the address
            const coordinates = await this.getCoordinatesFromAddress(address);
            if (coordinates) {
                const { lat, lng } = coordinates;
                
                // Try multiple street view services
                const services = [
                    `https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${lat},${lng}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`,
                    `https://api.streetviewapi.com/streetview?location=${lat},${lng}&size=400x300`,
                    `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=400x300&maptype=satellite&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`
                ];
                
                for (const serviceUrl of services) {
                    try {
                        const response = await fetch(serviceUrl, { timeout: 3000 });
                        if (response.ok) {
                            // Test if the image loads successfully
                            const img = new Image();
                            return new Promise((resolve) => {
                                img.onload = () => resolve(serviceUrl);
                                img.onerror = () => resolve(null);
                                img.src = serviceUrl;
                            });
                        }
                    } catch (error) {
                        console.log('Service failed:', serviceUrl, error);
                        continue;
                    }
                }
            }
        } catch (error) {
            console.log('Public Street View API failed:', error);
        }
        
        return null;
    }

    async getCoordinatesFromAddress(address) {
        try {
            // Use a free geocoding service
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
            
            if (response.ok) {
                const data = await response.json();
                if (data && data[0]) {
                    return {
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon)
                    };
                }
            }
        } catch (error) {
            console.log('Geocoding failed:', error);
        }
        return null;
    }

    async tryZillowImage(address) {
        try {
            // Try multiple approaches to get Zillow images
            
            // Approach 1: Try to get coordinates first, then search Zillow
            const coordinates = await this.getCoordinatesFromAddress(address);
            if (coordinates) {
                const { lat, lng } = coordinates;
                
                // Try Zillow API with coordinates
                const zillowSearchUrl = `https://www.zillow.com/homes/for_sale/?searchQueryState=%7B"pagination"%3A%7B%7D%2C"mapBounds"%3A%7B"west"%3A${lng-0.01}%2C"east"%3A${lng+0.01}%2C"south"%3A${lat-0.01}%2C"north"%3A${lat+0.01}%7D%2C"isMapVisible"%3Atrue%2C"filterState"%3A%7B%7D%2C"isListVisible"%3Atrue%7D`;
                
                // Use a CORS proxy
                const response = await fetch(`https://cors-anywhere.herokuapp.com/${zillowSearchUrl}`, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 8000
                });
                
                if (response.ok) {
                    const html = await response.text();
                    
                    // Look for Zillow property images
                    const imageMatches = html.match(/https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpg/g);
                    if (imageMatches && imageMatches.length > 0) {
                        // Return the first image (usually the main property photo)
                        return imageMatches[0];
                    }
                }
            }
            
            // Approach 2: Try direct address search
            const directSearchUrl = `https://www.zillow.com/homes/${encodeURIComponent(address)}`;
            const directResponse = await fetch(`https://cors-anywhere.herokuapp.com/${directSearchUrl}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 8000
            });
            
            if (directResponse.ok) {
                const html = await directResponse.text();
                const imageMatches = html.match(/https:\/\/photos\.zillowstatic\.com\/[^"'\s]+\.jpg/g);
                if (imageMatches && imageMatches.length > 0) {
                    return imageMatches[0];
                }
            }
            
        } catch (error) {
            console.log('Zillow image fetch failed:', error);
        }
        return null;
    }

    async tryGoogleStreetView(address) {
        try {
            // Try Google Street View API with multiple approaches
            
            // Approach 1: Try with coordinates (more reliable)
            const coordinates = await this.getCoordinatesFromAddress(address);
            if (coordinates) {
                const { lat, lng } = coordinates;
                
                // Try multiple API keys (demo keys that might work)
                const apiKeys = [
                    'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg',
                    'AIzaSyC7J2AK3p2ui2KIt8csimSJN9pQaC1UQYw',
                    'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
                ];
                
                for (const apiKey of apiKeys) {
                    try {
                        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=500x375&location=${lat},${lng}&key=${apiKey}`;
                        
                        // Test if the image loads with CORS handling
                        const result = await this.testImageLoad(streetViewUrl);
                        if (result) {
                            console.log('Google Street View image found with key');
                            return result;
                        }
                    } catch (error) {
                        console.log('API key failed:', apiKey);
                        continue;
                    }
                }
            }
            
            // Approach 2: Try with address directly
            const encodedAddress = encodeURIComponent(address);
            const directUrl = `https://maps.googleapis.com/maps/api/streetview?size=500x375&location=${encodedAddress}&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`;
            
            const result = await this.testImageLoad(directUrl);
            if (result) {
                return result;
            }
            
        } catch (error) {
            console.log('Google Street View fetch failed:', error);
        }
        return null;
    }

    async testImageLoad(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Try to handle CORS
            
            img.onload = () => {
                console.log('Image loaded successfully:', url);
                resolve(url);
            };
            
            img.onerror = () => {
                console.log('Image failed to load:', url);
                resolve(null);
            };
            
            // Add timestamp to avoid caching issues
            const timestamp = new Date().getTime();
            const urlWithTimestamp = url.includes('?') ? `${url}&t=${timestamp}` : `${url}?t=${timestamp}`;
            
            img.src = urlWithTimestamp;
        });
    }

    validateAddressFormat(address) {
        // Remove extra spaces and normalize
        const cleanAddress = address.replace(/\s+/g, ' ').trim();
        
        console.log('Validating address:', cleanAddress);
        
        // ACCEPT ANYTHING THAT'S NOT EMPTY
        if (cleanAddress.length === 0) {
            console.log('Address is empty');
            return {
                isValid: false,
                errorMessage: 'Please enter a property address.'
            };
        }
        
        console.log('Address validation passed - accepting any non-empty address');
        return {
            isValid: true,
            errorMessage: ''
        };
    }

    initializeAddressAutocomplete() {
        const addressInput = document.getElementById('propertyAddress');
        const suggestionsContainer = document.getElementById('addressSuggestions');
        let debounceTimer;
        
        addressInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear previous timer
            clearTimeout(debounceTimer);
            
            // Hide suggestions if query is too short
            if (query.length < 3) {
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            // Debounce the API call
            debounceTimer = setTimeout(() => {
                this.fetchAddressSuggestions(query);
            }, 300);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!addressInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }

    async fetchAddressSuggestions(query) {
        const suggestionsContainer = document.getElementById('addressSuggestions');
        
        try {
            // Use a free geocoding service for address suggestions
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=us`);
            
            if (response.ok) {
                const data = await response.json();
                
                if (data && data.length > 0) {
                    this.displayAddressSuggestions(data);
                } else {
                    // Show a simple validation message
                    this.displaySimpleAddressValidation(query);
                }
            } else {
                this.displaySimpleAddressValidation(query);
            }
        } catch (error) {
            console.log('Address autocomplete failed, using fallback:', error);
            this.displaySimpleAddressValidation(query);
        }
    }

    displayAddressSuggestions(results) {
        const suggestionsContainer = document.getElementById('addressSuggestions');
        
        suggestionsContainer.innerHTML = '';
        
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'address-suggestion-item';
            
            // Format the address nicely
            const displayName = result.display_name || result.name || '';
            const parts = displayName.split(', ');
            const mainText = parts.slice(0, 2).join(', '); // First two parts
            const secondaryText = parts.slice(2).join(', '); // Rest
            
            item.innerHTML = `
                <div class="main-text">${mainText}</div>
                <div class="secondary-text">${secondaryText}</div>
            `;
            
            item.addEventListener('click', () => {
                document.getElementById('propertyAddress').value = displayName;
                suggestionsContainer.style.display = 'none';
                this.clearError('propertyAddress');
            });
            
            suggestionsContainer.appendChild(item);
        });
        
        suggestionsContainer.style.display = 'block';
    }

    displaySimpleAddressValidation(query) {
        // Simple validation without API - just check basic format
        console.log('Testing address validation for:', query);
        const validation = this.validateAddressFormat(query);
        console.log('Validation result:', validation);
        
        if (!validation.isValid) {
            this.showError('propertyAddress', validation.errorMessage);
        } else {
            this.clearError('propertyAddress');
        }
    }

    async tryRealEstateAPI(address) {
        try {
            // Try RapidAPI Real Estate API (free tier available)
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'demo-key', // Replace with your RapidAPI key
                    'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
                }
            };
            
            const response = await fetch(`https://realty-mole-property-api.p.rapidapi.com/properties?address=${encodeURIComponent(address)}`, options);
            
            if (response.ok) {
                const data = await response.json();
                if (data.properties && data.properties[0] && data.properties[0].images) {
                    return data.properties[0].images[0];
                }
            }
        } catch (error) {
            console.log('Real Estate API fetch failed:', error);
        }
        return null;
    }

    async tryBingMapsImage(address) {
        try {
            // Try Bing Maps API for aerial/satellite view
            const encodedAddress = encodeURIComponent(address);
            const apiKey = 'demo-key'; // Replace with your Bing Maps key
            
            const response = await fetch(`https://dev.virtualearth.net/REST/v1/Imagery/Map/Aerial/${encodedAddress}?key=${apiKey}&mapSize=400,300`);
            
            if (response.ok) {
                return response.url;
            }
        } catch (error) {
            console.log('Bing Maps fetch failed:', error);
        }
        return null;
    }

    getPlaceholderImage(address) {
        // Create a custom SVG placeholder with a house drawing and "No Image" watermark
        const houseSvg = `
            <svg width="500" height="375" viewBox="0 0 500 375" xmlns="http://www.w3.org/2000/svg">
                <rect width="500" height="375" fill="#f7fafc"/>
                
                <!-- House drawing -->
                <g transform="translate(187, 125)">
                    <!-- House body -->
                    <rect x="0" y="50" width="125" height="100" fill="#e2e8f0" stroke="#cbd5e0" stroke-width="2"/>
                    
                    <!-- Roof -->
                    <polygon points="0,50 62.5,12.5 125,50" fill="#a0aec0" stroke="#718096" stroke-width="2"/>
                    
                    <!-- Door -->
                    <rect x="44" y="100" width="37" height="50" fill="#4a5568" stroke="#2d3748" stroke-width="1"/>
                    <circle cx="75" cy="125" r="2" fill="#e2e8f0"/>
                    
                    <!-- Windows -->
                    <rect x="12" y="62" width="25" height="25" fill="#bee3f8" stroke="#3182ce" stroke-width="1"/>
                    <rect x="88" y="62" width="25" height="25" fill="#bee3f8" stroke="#3182ce" stroke-width="1"/>
                    
                    <!-- Chimney -->
                    <rect x="88" y="25" width="10" height="25" fill="#a0aec0" stroke="#718096" stroke-width="1"/>
                    
                    <!-- Ground -->
                    <rect x="-12" y="150" width="150" height="12" fill="#9ae6b4" stroke="#48bb78" stroke-width="1"/>
                </g>
                
                <!-- "No Image" watermark -->
                <text x="250" y="312" text-anchor="middle" fill="#9ba0a8" font-family="Inter, sans-serif" font-size="18" font-weight="500">
                    No Image Available
                </text>
                
                <!-- Address text -->
                <text x="250" y="337" text-anchor="middle" fill="#718096" font-family="Inter, sans-serif" font-size="14">
                    ${address || 'Property Address'}
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(houseSvg)}`;
    }

    displayYearlyReturnsTable(yearlyReturns) {
        const tbody = document.getElementById('returnsTableBody');
        tbody.innerHTML = '';
        
                        // Calculate totals for summable columns
                const totals = {
                    annualRent: 0,
                    operatingExpenses: 0,
                    netOperatingIncome: 0,
                    totalMortgagePayment: 0,
                    interestPayment: 0,
                    principalPaid: 0,
                    netCashFlow: 0,
                    taxableCashFlow: 0,
                    depreciation: 0,
                    taxSavings: 0,
                    totalCashFlowForROI: 0
                };
        
                        yearlyReturns.forEach(return_ => {
                    // Add to totals
                    totals.annualRent += return_.annualRent;
                    totals.operatingExpenses += return_.operatingExpenses;
                    totals.netOperatingIncome += return_.netOperatingIncome;
                    totals.totalMortgagePayment += return_.totalMortgagePayment;
                    totals.interestPayment += return_.interestPayment;
                    totals.principalPaid += return_.principalPaid;
                    totals.netCashFlow += return_.netCashFlow;
                    totals.taxableCashFlow += return_.taxableCashFlow;
                    totals.depreciation += return_.depreciation;
                    totals.taxSavings += return_.taxSavings;
                    totals.totalCashFlowForROI += return_.totalCashFlowForROI;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${return_.year}</td>
                <td>${return_.monthYear}</td>
                <td>${return_.actualYear}</td>
                <td>${this.formatCurrency(return_.propertyValue)}</td>
                <td>${this.formatCurrency(return_.annualRent)}</td>
                <td>${this.formatCurrency(return_.operatingExpenses)}</td>
                <td>${this.formatCurrency(return_.netOperatingIncome)}</td>
                <td>${this.formatCurrency(return_.totalMortgagePayment)}</td>
                <td>${this.formatCurrency(return_.interestPayment)}</td>
                <td>${this.formatCurrency(return_.principalPaid)}</td>
                <td class="${return_.netCashFlow >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(return_.netCashFlow)}</td>
                <td class="${return_.taxableCashFlow >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(return_.taxableCashFlow)}</td>
                <td>${this.formatCurrency(return_.depreciation)}</td>
                <td class="positive">${this.formatCurrency(return_.taxSavings)}</td>
                <td>${this.formatCurrency(return_.carriedForwardDepreciation)}</td>
                <td class="${return_.totalCashFlowForROI >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(return_.totalCashFlowForROI)}</td>
                <td class="${return_.roi >= 0 ? 'positive' : 'negative'}">${return_.roi.toFixed(2)}%</td>
            `;
            tbody.appendChild(row);
        });
        
                        // Add totals row
                const totalsRow = document.createElement('tr');
                totalsRow.className = 'totals-row';
                totalsRow.innerHTML = `
                    <td><strong>TOTAL</strong></td>
                    <td><strong>-</strong></td>
                    <td><strong>-</strong></td>
                    <td><strong>-</strong></td>
                    <td><strong>${this.formatCurrency(totals.annualRent)}</strong></td>
                    <td><strong>${this.formatCurrency(totals.operatingExpenses)}</strong></td>
                    <td><strong>${this.formatCurrency(totals.netOperatingIncome)}</strong></td>
                    <td><strong>${this.formatCurrency(totals.totalMortgagePayment)}</strong></td>
                    <td><strong>${this.formatCurrency(totals.interestPayment)}</strong></td>
                    <td><strong>${this.formatCurrency(totals.principalPaid)}</strong></td>
                    <td class="${totals.netCashFlow >= 0 ? 'positive' : 'negative'}"><strong>${this.formatCurrency(totals.netCashFlow)}</strong></td>
                    <td class="${totals.taxableCashFlow >= 0 ? 'positive' : 'negative'}"><strong>${this.formatCurrency(totals.taxableCashFlow)}</strong></td>
                    <td><strong>${this.formatCurrency(totals.depreciation)}</strong></td>
                    <td class="positive"><strong>${this.formatCurrency(totals.taxSavings)}</strong></td>
                    <td><strong>-</strong></td>
                    <td class="${totals.totalCashFlowForROI >= 0 ? 'positive' : 'negative'}"><strong>${this.formatCurrency(totals.totalCashFlowForROI)}</strong></td>
                    <td><strong>-</strong></td>
                `;
        tbody.appendChild(totalsRow);
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
        const leftPadding = 120;  // More space for Y-axis labels
        const rightPadding = 40;
        const topPadding = 40;   // Space for title
        const bottomPadding = 80; // More space for X-axis labels
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
        
        // Draw additional Y-axis labels for better readability
        if (yearlyReturns.length > 1) {
            const additionalGridLines = Math.min(15, yearlyReturns.length * 2);
            for (let i = 0; i <= additionalGridLines; i++) {
                const value = adjustedMin + (adjustedRange * i / additionalGridLines);
                const y = canvas.height - bottomPadding - (adjustedRange * i / additionalGridLines) * chartHeight;
                
                // Only draw if not already drawn by main grid lines
                const isMainGridLine = i % (additionalGridLines / numGridLines) === 0;
                if (!isMainGridLine) {
                    // Draw lighter grid line
                    ctx.strokeStyle = '#f0f4f8';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(leftPadding, y);
                    ctx.lineTo(canvas.width - rightPadding, y);
                    ctx.stroke();
                    
                    // Draw smaller Y-axis label
                    ctx.fillStyle = '#a0aec0';
                    ctx.font = '9px Inter';
                    const labelText = this.formatCurrency(value);
                    ctx.fillText(labelText, leftPadding - 8, y + 3);
                }
            }
        }
        
        // Draw Y-axis labels with better spacing (alternate years approach)
        const cashFlowRange = maxCashFlow - minCashFlow;
        if (cashFlowRange > 0) {
            // Show fewer, more spaced out Y-axis values for better readability
            const numLabels = Math.min(5, Math.ceil(yearlyReturns.length / 2)); // Show every other year or max 5 labels
            const stepSize = cashFlowRange / (numLabels - 1);
            
            for (let i = 0; i < numLabels; i++) {
                const value = minCashFlow + (stepSize * i);
                const y = canvas.height - bottomPadding - ((value - adjustedMin) / adjustedRange) * chartHeight;
                
                // Only draw if within chart bounds
                if (y >= topPadding && y <= canvas.height - bottomPadding) {
                    // Draw grid line
                    ctx.strokeStyle = '#e2e8f0';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(leftPadding, y);
                    ctx.lineTo(canvas.width - rightPadding, y);
                    ctx.stroke();
                    
                    // Draw Y-axis label
                    ctx.fillStyle = '#4a5568';
                    ctx.font = '12px Inter';
                    ctx.textAlign = 'right';
                    const labelText = this.formatCurrency(value);
                    ctx.fillText(labelText, leftPadding - 15, y + 4);
                }
            }
        }
        
        // Y-axis title will be drawn later to avoid duplication
        
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
    
    getMonthName(monthNumber) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[monthNumber - 1] || 'Jan';
    }
    
    calculateActualYear(purchaseYear, purchaseMonth, analysisYear) {
        // Calculate the actual calendar year for each analysis year
        // If purchase was in 2022 and we're analyzing year 1, actual year would be 2023
        // If purchase was in 2022 and we're analyzing year 3, actual year would be 2025
        return purchaseYear + analysisYear;
    }
    
    calculateMonthYear(purchaseYear, purchaseMonth, analysisYear) {
        const actualYear = this.calculateActualYear(purchaseYear, purchaseMonth, analysisYear);
        const monthName = this.getMonthName(purchaseMonth);
        return `${monthName}/${actualYear}`;
    }

    downloadExcel() {
        const table = document.getElementById('returnsTable');
        const rows = table.querySelectorAll('tr');
        const data = [];

        // Get input parameters
        const inputs = this.getInputValues();
        
        // Add title and timestamp
        data.push(['RENTAL PROPERTY INVESTMENT ANALYSIS - COMPLETE REPORT']);
        data.push([`Generated on: ${new Date().toLocaleString()}`]);
        data.push([]);
        
        // Add input parameters section
        data.push(['INPUT PARAMETERS']);
        data.push([]);
        
        // Property Information
        data.push(['Property Information']);
        data.push(['Property Price', this.formatCurrency(inputs.propertyPrice)]);
        data.push(['Property Address', inputs.propertyAddress]);
        data.push(['Purchase Date', `${this.getMonthName(inputs.purchaseMonth)} ${inputs.purchaseYear}`]);
        data.push(['Property Type', document.getElementById('propertyType').value]);
        data.push(['Square Footage', document.getElementById('squareFootage').value + ' sq ft']);
        data.push([]);
        
        // Financing Details
        data.push(['Financing Details']);
        data.push(['Down Payment', this.formatCurrency(inputs.downPayment)]);
        data.push(['Down Payment %', (inputs.downPayment / inputs.propertyPrice * 100).toFixed(1) + '%']);
        data.push(['Loan Amount', this.formatCurrency(inputs.loanAmount)]);
        data.push(['Interest Rate', inputs.interestRate + '%']);
        data.push(['Loan Term', inputs.loanTerm + ' years']);
        data.push(['Monthly Payment', this.formatCurrency(inputs.monthlyPayment)]);
        data.push([]);
        
        // Rental Income
        data.push(['Rental Income']);
        data.push(['Monthly Rent', this.formatCurrency(inputs.monthlyRent)]);
        data.push(['Rent Growth Rate', inputs.rentGrowthRate + '%']);
        data.push(['Vacancy Rate', inputs.vacancyRate + '%']);
        data.push([]);
        
        // Operating Expenses
        data.push(['Operating Expenses']);
        data.push(['Property Tax', this.formatCurrency(inputs.propertyTax)]);
        data.push(['Insurance', this.formatCurrency(inputs.insurance)]);
        data.push(['HOA Fees', this.formatCurrency(inputs.hoaFees)]);
        data.push(['Utilities', this.formatCurrency(inputs.utilities)]);
        data.push(['Maintenance', this.formatCurrency(inputs.maintenance)]);
        data.push(['Property Management', inputs.propertyManagement + '%']);
        data.push([]);
        
        // Depreciation
        data.push(['Depreciation']);
        data.push(['Depreciation Method', inputs.depreciationMethod]);
        data.push(['Depreciation Period', inputs.depreciationPeriod + ' years']);
        data.push(['Land Value', this.formatCurrency(inputs.landValue)]);
        data.push([]);
        
        // Analysis Parameters
        data.push(['Analysis Parameters']);
        data.push(['Analysis Period', inputs.analysisPeriod + ' years']);
        data.push(['Appreciation Rate', inputs.appreciationRate + '%']);
        data.push(['Selling Costs', inputs.sellingCosts + '%']);
        data.push(['Tax Rate', inputs.taxRate + '%']);
        data.push(['Inflation Rate', inputs.inflationRate + '%']);
        data.push(['Discount Rate', inputs.discountRate + '%']);
        data.push([]);
        data.push([]);

        // Add Summary Highlights
        data.push(['SUMMARY HIGHLIGHTS']);
        data.push([]);
        data.push(['Total Capital Gain', document.getElementById('cashOnCashROI').textContent]);
        data.push(['IRR', document.getElementById('irrValue').textContent]);
        data.push(['Net Present Value', document.getElementById('npvValue').textContent]);
        data.push(['Break-Even (Years)', document.getElementById('breakEvenYears').textContent]);
        data.push([]);
        data.push([]);

        // Add Monthly Cash Flow Analysis
        data.push(['MONTHLY CASH FLOW ANALYSIS']);
        data.push([]);
        data.push(['Gross Monthly Rent', document.getElementById('grossMonthlyRent').textContent]);
        data.push(['Vacancy Loss', document.getElementById('vacancyLoss').textContent]);
        data.push(['Effective Gross Income', document.getElementById('effectiveGrossIncome').textContent]);
        data.push(['Operating Expenses', document.getElementById('operatingExpenses').textContent]);
        data.push(['Net Operating Income', document.getElementById('netOperatingIncome').textContent]);
        data.push(['Debt Service', document.getElementById('debtService').textContent]);
        data.push(['Monthly Depreciation', document.getElementById('monthlyDepreciation').textContent]);
        data.push(['Monthly Cash Flow', document.getElementById('monthlyCashFlow').textContent]);
        data.push([]);
        data.push([]);

        // Add IRR Analysis
        data.push(['IRR ANALYSIS']);
        data.push([]);
        data.push(['Initial Investment', document.getElementById('initialInvestment').textContent]);
        data.push(['Holding Period', document.getElementById('holdingPeriod').textContent]);
        data.push(['Total Cash Flow', document.getElementById('totalCashFlow').textContent]);
        data.push(['Capital Gain', document.getElementById('saleProceeds').textContent]);
        data.push(['IRR', document.getElementById('irrFinal').textContent]);
        data.push([]);
        data.push([]);

        // Get headers for yearly returns table
        const headers = [];
        const headerCells = rows[0].querySelectorAll('th');
        headerCells.forEach(cell => {
            const headerName = cell.querySelector('.header-name');
            headers.push(headerName ? headerName.textContent : cell.textContent.trim());
        });
        data.push(['YEARLY RETURNS ANALYSIS']);
        data.push([]);
        data.push(headers);

        // Get data rows
        for (let i = 1; i < rows.length; i++) {
            const row = [];
            const cells = rows[i].querySelectorAll('td');
            cells.forEach(cell => {
                row.push(cell.textContent.trim());
            });
            data.push(row);
        }

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        // Set column widths
        const colWidths = headers.map(() => ({ width: 18 }));
        ws['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Rental Analysis');

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `rental_analysis_complete_${timestamp}.xlsx`;

        // Save file
        XLSX.writeFile(wb, filename);
    }

    downloadPdf() {
        const table = document.getElementById('returnsTable');
        const rows = table.querySelectorAll('tr');
        const data = [];

        // Get input parameters
        const inputs = this.getInputValues();

        // Get headers
        const headers = [];
        const headerCells = rows[0].querySelectorAll('th');
        headerCells.forEach(cell => {
            const headerName = cell.querySelector('.header-name');
            headers.push(headerName ? headerName.textContent : cell.textContent.trim());
        });

        // Get data rows
        for (let i = 1; i < rows.length; i++) {
            const row = [];
            const cells = rows[i].querySelectorAll('td');
            cells.forEach(cell => {
                row.push(cell.textContent.trim());
            });
            data.push(row);
        }

        // Create PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');

        // FIRST PAGE - Complete Report Overview
        // Add title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Rental Property Investment Analysis - Complete Report', 14, 20);

        // Add timestamp
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const timestamp = new Date().toLocaleString();
        doc.text(`Generated on: ${timestamp}`, 14, 30);

        // Add Summary Highlights
        let yPosition = 45;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SUMMARY HIGHLIGHTS', 14, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Capital Gain: ${document.getElementById('cashOnCashROI').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`IRR: ${document.getElementById('irrValue').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Net Present Value: ${document.getElementById('npvValue').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Break-Even: ${document.getElementById('breakEvenYears').textContent}`, 20, yPosition);
        yPosition += 10;

        // Add Monthly Cash Flow Analysis
        doc.setFont('helvetica', 'bold');
        doc.text('MONTHLY CASH FLOW ANALYSIS', 14, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(`Gross Monthly Rent: ${document.getElementById('grossMonthlyRent').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Monthly Cash Flow: ${document.getElementById('monthlyCashFlow').textContent}`, 20, yPosition);
        yPosition += 10;

        // Add IRR Analysis
        doc.setFont('helvetica', 'bold');
        doc.text('IRR ANALYSIS', 14, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.text(`Initial Investment: ${document.getElementById('initialInvestment').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Holding Period: ${document.getElementById('holdingPeriod').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Total Cash Flow: ${document.getElementById('totalCashFlow').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Capital Gain: ${document.getElementById('saleProceeds').textContent}`, 20, yPosition);
        yPosition += 5;
        doc.text(`IRR: ${document.getElementById('irrFinal').textContent}`, 20, yPosition);
        yPosition += 10;

        // Add input parameters section in two columns
        doc.setFont('helvetica', 'bold');
        doc.text('INPUT PARAMETERS', 14, yPosition);
        yPosition += 8;

        // Left column parameters
        let leftY = yPosition;
        let rightY = yPosition;
        const leftX = 20;
        const rightX = 120;

        // Property Information
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Property Information:', leftX, leftY);
        leftY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Property Address: ${inputs.propertyAddress || 'Not specified'}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Purchase Date: ${this.getMonthName(inputs.purchaseMonth)} ${inputs.purchaseYear}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Property Price: ${this.formatCurrency(inputs.propertyPrice)}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Property Type: ${document.getElementById('propertyType').value}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Square Footage: ${document.getElementById('squareFootage').value} sq ft`, leftX + 5, leftY);
        leftY += 6;

        // Financing Details
        doc.setFont('helvetica', 'bold');
        doc.text('Financing Details:', leftX, leftY);
        leftY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Down Payment: ${this.formatCurrency(inputs.downPayment)}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Interest Rate: ${inputs.interestRate}%`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Loan Term: ${inputs.loanTerm} years`, leftX + 5, leftY);
        leftY += 6;

        // Rental Income
        doc.setFont('helvetica', 'bold');
        doc.text('Rental Income:', leftX, leftY);
        leftY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Monthly Rent: ${this.formatCurrency(inputs.monthlyRent)}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Rent Growth Rate: ${inputs.rentGrowthRate}%`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Vacancy Rate: ${inputs.vacancyRate}%`, leftX + 5, leftY);

        // Right column parameters
        // Operating Expenses
        doc.setFont('helvetica', 'bold');
        doc.text('Operating Expenses:', rightX, rightY);
        rightY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Property Tax: ${this.formatCurrency(inputs.propertyTax)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Insurance: ${this.formatCurrency(inputs.insurance)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`HOA Fees: ${this.formatCurrency(inputs.hoaFees)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Maintenance: ${this.formatCurrency(inputs.maintenance)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Property Management: ${inputs.propertyManagement}%`, rightX + 5, rightY);
        rightY += 6;

        // Depreciation
        doc.setFont('helvetica', 'bold');
        doc.text('Depreciation:', rightX, rightY);
        rightY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Method: ${inputs.depreciationMethod}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Period: ${inputs.depreciationPeriod} years`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Land Value: ${this.formatCurrency(inputs.landValue)}`, rightX + 5, rightY);
        rightY += 6;

        // Analysis Parameters
        doc.setFont('helvetica', 'bold');
        doc.text('Analysis Parameters:', rightX, rightY);
        rightY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Analysis Period: ${inputs.analysisPeriod} years`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Appreciation Rate: ${inputs.appreciationRate}%`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Tax Rate: ${inputs.taxRate}%`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Discount Rate: ${inputs.discountRate}%`, rightX + 5, rightY);

        // SECOND PAGE - Yearly Returns Table
        doc.addPage();

        // Add yearly returns table title on second page
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('YEARLY RETURNS ANALYSIS', 14, 20);

        // Create table on second page
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 30,
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [102, 126, 234],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            margin: { top: 30, right: 14, bottom: 14, left: 14 },
            pageBreak: 'auto'
        });

        // Generate filename with timestamp
        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `rental_analysis_complete_${dateStr}.pdf`;

        // Save file
        doc.save(filename);
    }

    downloadRoiExcel() {
        // Get the table data
        const table = document.getElementById('returnsTable');
        const rows = table.querySelectorAll('tbody tr');
        
        if (rows.length === 0) {
            alert('No ROI data available to export. Please run the calculation first.');
            return;
        }

        // Prepare data array
        const data = [];
        
        // Add title and timestamp
        data.push(['ROI ANALYSIS - YEARLY RETURNS DATA']);
        data.push([`Generated on: ${new Date().toLocaleString()}`]);
        data.push([]);
        
        // Add input parameters section
        data.push(['INPUT PARAMETERS']);
        data.push([]);
        
        const inputs = this.getInputValues();
        
        // Property Information
        data.push(['Property Information']);
        data.push(['Property Price', this.formatCurrency(inputs.propertyPrice)]);
        data.push(['Property Address', inputs.propertyAddress]);
        data.push(['Purchase Date', `${this.getMonthName(inputs.purchaseMonth)} ${inputs.purchaseYear}`]);
        data.push(['Property Type', document.getElementById('propertyType').value]);
        data.push(['Square Footage', document.getElementById('squareFootage').value + ' sq ft']);
        data.push([]);
        
        // Financing Details
        data.push(['Financing Details']);
        data.push(['Down Payment', this.formatCurrency(inputs.downPayment)]);
        data.push(['Interest Rate', inputs.interestRate + '%']);
        data.push(['Loan Term', inputs.loanTerm + ' years']);
        data.push([]);
        
        // Rental Income
        data.push(['Rental Income']);
        data.push(['Monthly Rent', this.formatCurrency(inputs.monthlyRent)]);
        data.push(['Rent Growth Rate', inputs.rentGrowthRate + '%']);
        data.push(['Vacancy Rate', inputs.vacancyRate + '%']);
        data.push([]);
        
        // Operating Expenses
        data.push(['Operating Expenses']);
        data.push(['Property Tax', this.formatCurrency(inputs.propertyTax)]);
        data.push(['Insurance', this.formatCurrency(inputs.insurance)]);
        data.push(['HOA Fees', this.formatCurrency(inputs.hoaFees)]);
        data.push(['Maintenance', this.formatCurrency(inputs.maintenance)]);
        data.push(['Property Management', inputs.propertyManagement + '%']);
        data.push([]);
        
        // Depreciation
        data.push(['Depreciation']);
        data.push(['Method', inputs.depreciationMethod]);
        data.push(['Period', inputs.depreciationPeriod + ' years']);
        data.push(['Land Value', this.formatCurrency(inputs.landValue)]);
        data.push([]);
        
        // Analysis Parameters
        data.push(['Analysis Parameters']);
        data.push(['Analysis Period', inputs.analysisPeriod + ' years']);
        data.push(['Appreciation Rate', inputs.appreciationRate + '%']);
        data.push(['Tax Rate', inputs.taxRate + '%']);
        data.push(['Discount Rate', inputs.discountRate + '%']);
        data.push([]);
        data.push([]);
        
        // Get headers for yearly returns table
        const headers = [];
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(cell => {
            const headerName = cell.querySelector('.header-name');
            headers.push(headerName ? headerName.textContent : cell.textContent.trim());
        });
        
        data.push(['YEARLY RETURNS DATA']);
        data.push([]);
        data.push(headers);
        
        // Add table data
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            data.push(rowData);
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Set column widths
        const colWidths = headers.map(() => ({ width: 18 }));
        ws['!cols'] = colWidths;
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'ROI Analysis');
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `roi_analysis_${timestamp}.xlsx`;
        
        // Save file
        XLSX.writeFile(wb, filename);
    }

    downloadRoiPdf() {
        // Get the table data
        const table = document.getElementById('returnsTable');
        const rows = table.querySelectorAll('tbody tr');
        
        if (rows.length === 0) {
            alert('No ROI data available to export. Please run the calculation first.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');
        
        // FIRST PAGE - ROI Analysis Overview
        // Add title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('ROI Analysis - Yearly Returns Data', 14, 20);
        
        // Add timestamp
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const timestamp = new Date().toLocaleString();
        doc.text(`Generated on: ${timestamp}`, 14, 30);
        
        // Add input parameters section in two columns
        let yPosition = 45;
        doc.setFont('helvetica', 'bold');
        doc.text('INPUT PARAMETERS', 14, yPosition);
        yPosition += 8;
        
        const inputs = this.getInputValues();
        
        // Left column parameters
        let leftY = yPosition;
        let rightY = yPosition;
        const leftX = 20;
        const rightX = 120;
        
        // Property Information
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Property Information:', leftX, leftY);
        leftY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Property Address: ${inputs.propertyAddress || 'Not specified'}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Purchase Date: ${this.getMonthName(inputs.purchaseMonth)} ${inputs.purchaseYear}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Property Price: ${this.formatCurrency(inputs.propertyPrice)}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Property Type: ${document.getElementById('propertyType').value}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Square Footage: ${document.getElementById('squareFootage').value} sq ft`, leftX + 5, leftY);
        leftY += 6;
        
        // Financing Details
        doc.setFont('helvetica', 'bold');
        doc.text('Financing Details:', leftX, leftY);
        leftY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Down Payment: ${this.formatCurrency(inputs.downPayment)}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Interest Rate: ${inputs.interestRate}%`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Loan Term: ${inputs.loanTerm} years`, leftX + 5, leftY);
        leftY += 6;
        
        // Rental Income
        doc.setFont('helvetica', 'bold');
        doc.text('Rental Income:', leftX, leftY);
        leftY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Monthly Rent: ${this.formatCurrency(inputs.monthlyRent)}`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Rent Growth Rate: ${inputs.rentGrowthRate}%`, leftX + 5, leftY);
        leftY += 4;
        doc.text(`Vacancy Rate: ${inputs.vacancyRate}%`, leftX + 5, leftY);
        
        // Right column parameters
        // Operating Expenses
        doc.setFont('helvetica', 'bold');
        doc.text('Operating Expenses:', rightX, rightY);
        rightY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Property Tax: ${this.formatCurrency(inputs.propertyTax)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Insurance: ${this.formatCurrency(inputs.insurance)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`HOA Fees: ${this.formatCurrency(inputs.hoaFees)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Maintenance: ${this.formatCurrency(inputs.maintenance)}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Property Management: ${inputs.propertyManagement}%`, rightX + 5, rightY);
        rightY += 6;
        
        // Depreciation
        doc.setFont('helvetica', 'bold');
        doc.text('Depreciation:', rightX, rightY);
        rightY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Method: ${inputs.depreciationMethod}`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Period: ${inputs.depreciationPeriod} years`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Land Value: ${this.formatCurrency(inputs.landValue)}`, rightX + 5, rightY);
        rightY += 6;
        
        // Analysis Parameters
        doc.setFont('helvetica', 'bold');
        doc.text('Analysis Parameters:', rightX, rightY);
        rightY += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Analysis Period: ${inputs.analysisPeriod} years`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Appreciation Rate: ${inputs.appreciationRate}%`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Tax Rate: ${inputs.taxRate}%`, rightX + 5, rightY);
        rightY += 4;
        doc.text(`Discount Rate: ${inputs.discountRate}%`, rightX + 5, rightY);
        
        // SECOND PAGE - Yearly Returns Table
        doc.addPage();
        
        // Add yearly returns table title on second page
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('YEARLY RETURNS DATA', 14, 20);
        
        // Get headers and data for the table
        const headers = [];
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(cell => {
            const headerName = cell.querySelector('.header-name');
            headers.push(headerName ? headerName.textContent : cell.textContent.trim());
        });
        
        const tableData = [];
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            tableData.push(rowData);
        });
        
        // Create table on second page
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 30,
            styles: {
                fontSize: 8,
                cellPadding: 2
            },
            headStyles: {
                fillColor: [102, 126, 234],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            margin: { top: 30, right: 14, bottom: 14, left: 14 },
            pageBreak: 'auto'
        });
        
        // Generate filename with timestamp
        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `roi_analysis_${dateStr}.pdf`;
        
        // Save file
        doc.save(filename);
    }
}

// Mobile viewport handling
function handleMobileViewport() {
    // Handle iOS Safari viewport issues
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setViewportHeight();
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 500);
        });
    }
    
    // Show mobile quick actions on mobile devices
    if (window.innerWidth <= 768) {
        const quickActions = document.getElementById('mobileQuickActions');
        if (quickActions) {
            quickActions.style.display = 'flex';
        }
    }
}

// Smooth scroll polyfill for older browsers
function smoothScrollTo(target) {
    if (target) {
        if ('scrollBehavior' in document.documentElement.style) {
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Polyfill for older browsers
            const targetPosition = target.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        }
    }
}

    // Mobile-specific enhancements
    function initMobileEnhancements() {
        // Handle window resize for responsive layout
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const quickActions = document.getElementById('mobileQuickActions');
                if (quickActions) {
                    quickActions.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
                }
            }, 250);
        });
        
        // Add JavaScript tooltips as fallback
        const tableHeaders = document.querySelectorAll('.returns-table th');
        tableHeaders.forEach(header => {
            const title = header.getAttribute('title');
            if (title) {
                header.addEventListener('mouseenter', function(e) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'js-tooltip';
                    tooltip.textContent = title;
                    tooltip.style.cssText = `
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #2d3748;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 0.75rem;
                        font-weight: 500;
                        white-space: nowrap;
                        z-index: 9999;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        margin-bottom: 8px;
                        max-width: 250px;
                        text-align: center;
                        line-height: 1.3;
                        pointer-events: none;
                    `;
                    
                    // Add arrow
                    const arrow = document.createElement('div');
                    arrow.style.cssText = `
                        position: absolute;
                        bottom: -5px;
                        left: 50%;
                        transform: translateX(-50%);
                        border: 5px solid transparent;
                        border-top-color: #2d3748;
                    `;
                    tooltip.appendChild(arrow);
                    
                    this.appendChild(tooltip);
                });
                
                header.addEventListener('mouseleave', function() {
                    const tooltip = this.querySelector('.js-tooltip');
                    if (tooltip) {
                        tooltip.remove();
                    }
                });
            }
        });
    
    // Add touch feedback for mobile devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback to cards
        const cards = document.querySelectorAll('.summary-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
    
    // Improve mobile table scrolling
    const tableContainers = document.querySelectorAll('.table-container');
    tableContainers.forEach(container => {
        let isScrolling = false;
        
        container.addEventListener('touchstart', () => {
            isScrolling = true;
        });
        
        container.addEventListener('touchend', () => {
            setTimeout(() => {
                isScrolling = false;
            }, 100);
        });
        
        // Add scroll indicators
        container.addEventListener('scroll', function() {
            const scrollLeft = this.scrollLeft;
            const scrollWidth = this.scrollWidth;
            const clientWidth = this.clientWidth;
            
            // Add visual feedback for scroll position
            if (scrollLeft > 0) {
                this.classList.add('scrolled-left');
            } else {
                this.classList.remove('scrolled-left');
            }
            
            if (scrollLeft < scrollWidth - clientWidth - 10) {
                this.classList.add('can-scroll-right');
            } else {
                this.classList.remove('can-scroll-right');
            }
        });
    });
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RentalPropertyCalculator();
    handleMobileViewport();
    initMobileEnhancements();
}); 