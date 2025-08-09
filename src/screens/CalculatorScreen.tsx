import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card, SegmentedButtons, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { PropertyInputs } from '../types';
import { RentalCalculator } from '../utils/calculations';

type RootStackParamList = {
  Home: undefined;
  Calculator: undefined;
  Results: { results: any };
};

type CalculatorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calculator'>;
type CalculatorScreenRouteProp = RouteProp<RootStackParamList, 'Calculator'>;

interface Props {
  navigation: CalculatorScreenNavigationProp;
  route: CalculatorScreenRouteProp;
}

const CalculatorScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [inputs, setInputs] = useState<PropertyInputs>({
    propertyPrice: 300000,
    propertyType: 'single-family',
    squareFootage: 1500,
    downPayment: 60000,
    downPaymentPercent: 20,
    loanAmount: 240000,
    interestRate: 4.5,
    loanTerm: 30,
    monthlyPayment: 1216,
    monthlyRent: 2000,
    rentGrowthRate: 2,
    vacancyRate: 5,
    propertyTax: 3600,
    insurance: 1200,
    hoaFees: 0,
    utilities: 0,
    maintenance: 150,
    propertyManagement: 8,
    analysisPeriod: 10,
    appreciationRate: 3,
    sellingCosts: 6,
    taxRate: 25,
    inflationRate: 2,
    discountRate: 8,
    depreciationMethod: 'straight-line',
    depreciationPeriod: 27.5,
  });

  const updateInput = (field: keyof PropertyInputs, value: string | number) => {
    const newInputs = { ...inputs, [field]: value };
    
    // Auto-calculate related fields
    if (field === 'propertyPrice') {
      const price = Number(value);
      const percent = newInputs.downPaymentPercent;
      newInputs.downPayment = (price * percent) / 100;
      newInputs.loanAmount = price - newInputs.downPayment;
      newInputs.monthlyPayment = calculateMonthlyPayment(newInputs.loanAmount, newInputs.interestRate, newInputs.loanTerm);
    } else if (field === 'downPaymentPercent') {
      const percent = Number(value);
      const price = newInputs.propertyPrice;
      newInputs.downPayment = (price * percent) / 100;
      newInputs.loanAmount = price - newInputs.downPayment;
      newInputs.monthlyPayment = calculateMonthlyPayment(newInputs.loanAmount, newInputs.interestRate, newInputs.loanTerm);
    } else if (field === 'downPayment') {
      const downPayment = Number(value);
      const price = newInputs.propertyPrice;
      newInputs.downPaymentPercent = price > 0 ? (downPayment / price) * 100 : 0;
      newInputs.loanAmount = price - downPayment;
      newInputs.monthlyPayment = calculateMonthlyPayment(newInputs.loanAmount, newInputs.interestRate, newInputs.loanTerm);
    } else if (field === 'loanAmount' || field === 'interestRate' || field === 'loanTerm') {
      newInputs.monthlyPayment = calculateMonthlyPayment(newInputs.loanAmount, newInputs.interestRate, newInputs.loanTerm);
    }
    
    setInputs(newInputs);
  };

  const calculateMonthlyPayment = (loanAmount: number, interestRate: number, loanTerm: number): number => {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    if (monthlyRate === 0) return loanAmount / totalPayments;
    
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
           (Math.pow(1 + monthlyRate, totalPayments) - 1);
  };

  const validateInputs = (): boolean => {
    if (inputs.propertyPrice <= 0) {
      Alert.alert('Error', 'Property price must be greater than 0');
      return false;
    }
    if (inputs.downPayment <= 0) {
      Alert.alert('Error', 'Down payment must be greater than 0');
      return false;
    }
    if (inputs.monthlyRent <= 0) {
      Alert.alert('Error', 'Monthly rent must be greater than 0');
      return false;
    }
    return true;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;
    
    try {
      const results = RentalCalculator.calculateInvestment(inputs);
      navigation.navigate('Results', { results });
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate investment. Please check your inputs.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Property Information */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Property Information</Text>
            
            <TextInput
              label="Purchase Price ($)"
              value={inputs.propertyPrice.toString()}
              onChangeText={(value) => updateInput('propertyPrice', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <SegmentedButtons
              value={inputs.propertyType}
              onValueChange={(value) => updateInput('propertyType', value)}
              buttons={[
                { value: 'single-family', label: 'Single Family' },
                { value: 'multi-family', label: 'Multi-Family' },
                { value: 'condo', label: 'Condo' },
              ]}
              style={styles.segmentedButton}
            />
            
            <TextInput
              label="Square Footage"
              value={inputs.squareFootage.toString()}
              onChangeText={(value) => updateInput('squareFootage', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Financing Details */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Financing Details</Text>
            
            <TextInput
              label="Down Payment ($)"
              value={inputs.downPayment.toString()}
              onChangeText={(value) => updateInput('downPayment', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Down Payment (%)"
              value={inputs.downPaymentPercent.toString()}
              onChangeText={(value) => updateInput('downPaymentPercent', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Interest Rate (%)"
              value={inputs.interestRate.toString()}
              onChangeText={(value) => updateInput('interestRate', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <SegmentedButtons
              value={inputs.loanTerm.toString()}
              onValueChange={(value) => updateInput('loanTerm', Number(value))}
              buttons={[
                { value: '15', label: '15 Years' },
                { value: '20', label: '20 Years' },
                { value: '30', label: '30 Years' },
              ]}
              style={styles.segmentedButton}
            />
            
            <TextInput
              label="Monthly Payment ($)"
              value={RentalCalculator.formatCurrency(inputs.monthlyPayment)}
              editable={false}
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Rental Income */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Rental Income</Text>
            
            <TextInput
              label="Monthly Rent ($)"
              value={inputs.monthlyRent.toString()}
              onChangeText={(value) => updateInput('monthlyRent', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Rent Growth Rate (%)"
              value={inputs.rentGrowthRate.toString()}
              onChangeText={(value) => updateInput('rentGrowthRate', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Vacancy Rate (%)"
              value={inputs.vacancyRate.toString()}
              onChangeText={(value) => updateInput('vacancyRate', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Operating Expenses */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Operating Expenses</Text>
            
            <TextInput
              label="Property Tax (Annual $)"
              value={inputs.propertyTax.toString()}
              onChangeText={(value) => updateInput('propertyTax', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Insurance (Annual $)"
              value={inputs.insurance.toString()}
              onChangeText={(value) => updateInput('insurance', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="HOA Fees (Monthly $)"
              value={inputs.hoaFees.toString()}
              onChangeText={(value) => updateInput('hoaFees', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Maintenance (Monthly $)"
              value={inputs.maintenance.toString()}
              onChangeText={(value) => updateInput('maintenance', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Property Management (%)"
              value={inputs.propertyManagement.toString()}
              onChangeText={(value) => updateInput('propertyManagement', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Investment Parameters */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Investment Parameters</Text>
            
            <TextInput
              label="Analysis Period (Years)"
              value={inputs.analysisPeriod.toString()}
              onChangeText={(value) => updateInput('analysisPeriod', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Appreciation Rate (%)"
              value={inputs.appreciationRate.toString()}
              onChangeText={(value) => updateInput('appreciationRate', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Tax Rate (%)"
              value={inputs.taxRate.toString()}
              onChangeText={(value) => updateInput('taxRate', Number(value) || 0)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleCalculate}
          style={styles.calculateButton}
          contentStyle={styles.buttonContent}
        >
          Calculate Investment Analysis
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  segmentedButton: {
    marginBottom: 12,
  },
  calculateButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default CalculatorScreen;

