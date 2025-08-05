# Rental Property Investment Calculator

A comprehensive web-based tool for analyzing rental property investments with detailed ROI and IRR calculations, cash flow analysis, and sensitivity testing.

## Features

### 📊 Comprehensive Input Parameters
- **Property Information**: Purchase price, property type, square footage
- **Financing Details**: Down payment, loan amount, interest rate, loan term
- **Rental Income**: Monthly rent, rent growth rate, vacancy rate
- **Operating Expenses**: Property tax, insurance, HOA fees, utilities, maintenance, property management
- **Investment Parameters**: Analysis period, appreciation rate, selling costs, tax rate, inflation rate, discount rate

### 📈 Advanced Calculations
- **Cash-on-Cash ROI**: Annual return on initial investment
- **Internal Rate of Return (IRR)**: Time-weighted rate of return
- **Net Present Value (NPV)**: Present value of all cash flows
- **Break-Even Analysis**: Time to recover initial investment
- **Monthly Cash Flow**: Detailed income and expense breakdown

### 📋 Detailed Output Tables
- **Yearly Returns Analysis**: Comprehensive table showing:
  - Property value appreciation
  - Annual rental income
  - Operating expenses
  - Net operating income
  - Debt service
  - Cash flow
  - ROI percentage
  - Cumulative ROI

### 🎯 Sensitivity Analysis
- **Rent Variation Impact**: How changes in rent affect cash flow, ROI, and IRR
- **Appreciation Impact**: How property appreciation affects total returns and IRR

### 📊 Visual Analytics
- **IRR Chart**: Visual representation of cash flow over time
- **Summary Cards**: Key metrics at a glance
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## How to Use

1. **Open the Calculator**: Open `index.html` in your web browser
2. **Enter Property Details**: Fill in all the input fields with your property information
3. **Adjust Parameters**: Modify financing, expenses, and investment parameters as needed
4. **Calculate**: Click the "Calculate Investment Analysis" button
5. **Review Results**: Analyze the comprehensive results and sensitivity tables

## Key Metrics Explained

### Cash-on-Cash ROI
```
Cash-on-Cash ROI = (Annual Cash Flow / Initial Investment) × 100
```
This shows the annual return on your initial down payment investment.

### Internal Rate of Return (IRR)
The discount rate that makes the net present value of all cash flows equal to zero. It's a comprehensive measure of investment performance that considers the time value of money.

### Net Present Value (NPV)
The present value of all future cash flows minus the initial investment, discounted at your specified discount rate.

### Break-Even Point
The number of years it takes for cumulative cash flow to become positive, indicating when your investment starts generating positive returns.

## Input Parameters Guide

### Property Information
- **Purchase Price**: Total cost to acquire the property
- **Property Type**: Affects potential appreciation and rental demand
- **Square Footage**: Used for cost per square foot analysis

### Financing Details
- **Down Payment**: Initial cash investment (20% recommended)
- **Interest Rate**: Annual mortgage interest rate
- **Loan Term**: Length of mortgage (15, 20, or 30 years)

### Rental Income
- **Monthly Rent**: Expected rental income
- **Rent Growth Rate**: Annual percentage increase in rent
- **Vacancy Rate**: Percentage of time property may be vacant

### Operating Expenses
- **Property Tax**: Annual property tax assessment
- **Insurance**: Annual property insurance premium
- **HOA Fees**: Monthly homeowners association fees
- **Utilities**: Monthly utility costs (if paid by owner)
- **Maintenance**: Monthly maintenance and repair costs
- **Property Management**: Percentage fee for property management

### Investment Parameters
- **Analysis Period**: Number of years to analyze (1-30)
- **Appreciation Rate**: Annual property value increase
- **Selling Costs**: Percentage of sale price for closing costs
- **Tax Rate**: Marginal tax rate for tax calculations
- **Inflation Rate**: Annual inflation rate for expense growth
- **Discount Rate**: Required rate of return for NPV calculations

## Sample Analysis

### Example Property
- Purchase Price: $300,000
- Down Payment: $60,000 (20%)
- Monthly Rent: $2,000
- Interest Rate: 4.5%
- Analysis Period: 10 years

### Results
- **Cash-on-Cash ROI**: 8.5%
- **IRR**: 12.3%
- **NPV**: $45,000
- **Break-Even**: 3.2 years
- **Monthly Cash Flow**: $350

## Technical Details

### Built With
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Object-oriented programming with classes
- **Canvas API**: Custom chart rendering
- **Font Awesome**: Icons and visual elements

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Responsive Design
- Desktop: Full two-column layout
- Tablet: Stacked layout with optimized spacing
- Mobile: Single-column layout with touch-friendly inputs

## File Structure
```
rental-calculator/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript calculations
└── README.md           # This documentation
```

## Getting Started

1. Download or clone the files to your local machine
2. Open `index.html` in your web browser
3. Start analyzing your rental property investments!

## Tips for Best Results

1. **Use Realistic Numbers**: Base your inputs on actual market data
2. **Consider All Expenses**: Don't forget maintenance, vacancies, and management fees
3. **Test Scenarios**: Use sensitivity analysis to understand risk factors
4. **Compare Properties**: Run multiple analyses to compare different investments
5. **Update Regularly**: Revisit your analysis as market conditions change

## Disclaimer

This calculator is for educational and planning purposes only. Actual investment results may vary due to market conditions, unexpected expenses, and other factors. Always consult with financial professionals before making investment decisions.

---

**Happy Investing! 🏠💰** 