# Rental Calculator Mobile App

A comprehensive React Native mobile application for analyzing rental property investments with detailed ROI and IRR calculations, cash flow analysis, and investment metrics.

## Features

### 📱 Mobile-Optimized Interface
- **Responsive Design**: Optimized for both Android and iOS devices
- **Touch-Friendly**: Large buttons and easy-to-use form inputs
- **Native Performance**: Built with React Native for smooth performance
- **Offline Capable**: Works without internet connection

### 📊 Investment Analysis
- **Property Information**: Purchase price, property type, square footage
- **Financing Details**: Down payment, loan amount, interest rate, loan term
- **Rental Income**: Monthly rent, rent growth rate, vacancy rate
- **Operating Expenses**: Property tax, insurance, HOA fees, maintenance, property management
- **Investment Parameters**: Analysis period, appreciation rate, tax rate

### 📈 Advanced Calculations
- **Cash-on-Cash ROI**: Annual return on initial investment
- **Internal Rate of Return (IRR)**: Time-weighted rate of return
- **Net Present Value (NPV)**: Present value of all cash flows
- **Break-Even Analysis**: Time to recover initial investment
- **Monthly Cash Flow**: Detailed income and expense breakdown

### 📋 Results Display
- **Summary Cards**: Key metrics at a glance
- **Monthly Cash Flow Table**: Detailed breakdown of income and expenses
- **Yearly Returns Summary**: Annual performance metrics
- **Investment Metrics**: NPV, capital gains, interest paid, equity component

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RentalCalculatorMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Web (for testing)
```bash
npm run web
```

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Publishing to App Stores

#### Google Play Store
1. Build the APK using `expo build:android`
2. Upload to Google Play Console
3. Follow Google Play Store guidelines

#### Apple App Store
1. Build the IPA using `expo build:ios`
2. Upload to App Store Connect
3. Follow Apple App Store guidelines

## Project Structure

```
RentalCalculatorMobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CalculatorScreen.tsx
│   │   └── ResultsScreen.tsx
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── calculations.ts
│   └── theme.ts            # App theme configuration
├── App.tsx                 # Main app component
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Key Components

### HomeScreen
- Welcome screen with app features overview
- Navigation to calculator
- Usage instructions

### CalculatorScreen
- Comprehensive form for property details
- Real-time calculations
- Input validation
- Auto-calculation of related fields

### ResultsScreen
- Investment analysis results
- Summary cards with key metrics
- Detailed tables for cash flow and returns
- Investment metrics breakdown

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Screen navigation
- **React Native Paper**: Material Design components
- **Custom Calculations**: Advanced financial algorithms

## Financial Calculations

The app includes sophisticated financial calculations:

### Cash-on-Cash ROI
```
Cash-on-Cash ROI = (Annual Cash Flow / Initial Investment) × 100
```

### Internal Rate of Return (IRR)
Uses Newton-Raphson method to find the discount rate that makes NPV = 0

### Net Present Value (NPV)
```
NPV = Σ(Cash Flow / (1 + Discount Rate)^n) - Initial Investment
```

### Monthly Cash Flow
```
Cash Flow = Net Operating Income - Debt Service
Net Operating Income = Effective Rent - Total Expenses
```

## Customization

### Theme
Modify `src/theme.ts` to customize colors, fonts, and styling.

### Calculations
Update `src/utils/calculations.ts` to modify financial algorithms.

### UI Components
Edit components in `src/screens/` and `src/components/` to change the interface.

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run e2e
```

## Deployment

### Expo Application Services (EAS)
1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform all`

### Manual Build
1. Eject from Expo: `expo eject`
2. Follow React Native CLI build instructions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Disclaimer

This calculator is for educational and planning purposes only. Actual investment results may vary due to market conditions, unexpected expenses, and other factors. Always consult with financial professionals before making investment decisions.

---

**Happy Investing! 🏠💰📱** 