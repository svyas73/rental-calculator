import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, DataTable, useTheme } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { InvestmentResults } from '../types';
import { RentalCalculator } from '../utils/calculations';

type RootStackParamList = {
  Home: undefined;
  Calculator: undefined;
  Results: { results: InvestmentResults };
};

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

interface Props {
  route: ResultsScreenRouteProp;
}

const ResultsScreen: React.FC<Props> = ({ route }) => {
  const theme = useTheme();
  const { results } = route.params;

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primary }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.summaryTitle, { color: 'white' }]}>
            Cash-on-Cash ROI
          </Text>
          <Text variant="headlineSmall" style={[styles.summaryValue, { color: 'white' }]}>
            {RentalCalculator.formatPercentage(results.cashOnCashRoi)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.summaryCard, { backgroundColor: theme.colors.secondary }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.summaryTitle, { color: 'white' }]}>
            IRR
          </Text>
          <Text variant="headlineSmall" style={[styles.summaryValue, { color: 'white' }]}>
            {RentalCalculator.formatPercentage(results.irr)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.summaryCard, { backgroundColor: theme.colors.success }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.summaryTitle, { color: 'white' }]}>
            Monthly Cash Flow
          </Text>
          <Text variant="headlineSmall" style={[styles.summaryValue, { color: 'white' }]}>
            {RentalCalculator.formatCurrency(results.monthlyCashFlow.cashFlow)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.summaryCard, { backgroundColor: theme.colors.info }]}>
        <Card.Content>
          <Text variant="titleMedium" style={[styles.summaryTitle, { color: 'white' }]}>
            Break-Even
          </Text>
          <Text variant="headlineSmall" style={[styles.summaryValue, { color: 'white' }]}>
            {results.breakEven > 0 ? `${results.breakEven} years` : 'Never'}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  const renderMonthlyCashFlow = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>Monthly Cash Flow</Text>
        
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Item</DataTable.Title>
            <DataTable.Title numeric>Amount</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Gross Rent</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.monthlyCashFlow.grossRent)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Vacancy Loss</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.monthlyCashFlow.vacancyLoss)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Effective Rent</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.monthlyCashFlow.effectiveRent)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Total Expenses</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.monthlyCashFlow.totalExpenses)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Net Operating Income</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.monthlyCashFlow.netOperatingIncome)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Debt Service</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.monthlyCashFlow.debtService)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell><Text style={{ fontWeight: 'bold' }}>Cash Flow</Text></DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={{ fontWeight: 'bold', color: results.monthlyCashFlow.cashFlow >= 0 ? theme.colors.success : theme.colors.error }}>
                {RentalCalculator.formatCurrency(results.monthlyCashFlow.cashFlow)}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </Card.Content>
    </Card>
  );

  const renderYearlyReturns = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>Yearly Returns Summary</Text>
        
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Year</DataTable.Title>
            <DataTable.Title numeric>Cash Flow</DataTable.Title>
            <DataTable.Title numeric>ROI</DataTable.Title>
            <DataTable.Title numeric>Cumulative ROI</DataTable.Title>
          </DataTable.Header>

          {results.yearlyReturns.slice(0, 5).map((return_, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{return_.year}</DataTable.Cell>
              <DataTable.Cell numeric>{RentalCalculator.formatCurrency(return_.cashFlow)}</DataTable.Cell>
              <DataTable.Cell numeric>{RentalCalculator.formatPercentage(return_.roi)}</DataTable.Cell>
              <DataTable.Cell numeric>{RentalCalculator.formatPercentage(return_.cumulativeRoi)}</DataTable.Cell>
            </DataTable.Row>
          ))}

          {results.yearlyReturns.length > 5 && (
            <DataTable.Row>
              <DataTable.Cell>...</DataTable.Cell>
              <DataTable.Cell numeric>...</DataTable.Cell>
              <DataTable.Cell numeric>...</DataTable.Cell>
              <DataTable.Cell numeric>...</DataTable.Cell>
            </DataTable.Row>
          )}

          {results.yearlyReturns.length > 5 && (
            <DataTable.Row>
              <DataTable.Cell>{results.yearlyReturns[results.yearlyReturns.length - 1].year}</DataTable.Cell>
              <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.yearlyReturns[results.yearlyReturns.length - 1].cashFlow)}</DataTable.Cell>
              <DataTable.Cell numeric>{RentalCalculator.formatPercentage(results.yearlyReturns[results.yearlyReturns.length - 1].roi)}</DataTable.Cell>
              <DataTable.Cell numeric>{RentalCalculator.formatPercentage(results.yearlyReturns[results.yearlyReturns.length - 1].cumulativeRoi)}</DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable>
      </Card.Content>
    </Card>
  );

  const renderInvestmentMetrics = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>Investment Metrics</Text>
        
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Metric</DataTable.Title>
            <DataTable.Title numeric>Value</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Net Present Value</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.npv)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Total Capital Gain</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.totalCapitalGain)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Total Interest Paid</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.totalInterestPaid)}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Total Equity Component</DataTable.Cell>
            <DataTable.Cell numeric>{RentalCalculator.formatCurrency(results.totalEquityComponent)}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {renderSummaryCards()}
        {renderMonthlyCashFlow()}
        {renderYearlyReturns()}
        {renderInvestmentMetrics()}
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
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: '48%',
    marginBottom: 8,
  },
  summaryTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  summaryValue: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ResultsScreen;

