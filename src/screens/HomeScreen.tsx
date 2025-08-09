import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Calculator: undefined;
  Results: { results: any };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const features = [
    {
      title: 'Property Analysis',
      description: 'Comprehensive analysis of rental property investments',
      icon: '🏠'
    },
    {
      title: 'ROI Calculator',
      description: 'Calculate cash-on-cash ROI and internal rate of return',
      icon: '💰'
    },
    {
      title: 'Cash Flow Analysis',
      description: 'Detailed monthly and yearly cash flow projections',
      icon: '📊'
    },
    {
      title: 'Sensitivity Testing',
      description: 'Test how changes in rent and appreciation affect returns',
      icon: '📈'
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
          Rental Property Calculator
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Make informed real estate investment decisions
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Card key={index} style={styles.featureCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.featureIcon}>
                {feature.icon}
              </Text>
              <Text variant="titleMedium" style={styles.featureTitle}>
                {feature.title}
              </Text>
              <Text variant="bodyMedium" style={styles.featureDescription}>
                {feature.description}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Calculator')}
          style={styles.startButton}
          contentStyle={styles.buttonContent}
        >
          Start Analysis
        </Button>
      </View>

      <View style={styles.infoContainer}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              How to Use
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              1. Enter property details and financing information{'\n'}
              2. Add rental income and operating expenses{'\n'}
              3. Set investment parameters and analysis period{'\n'}
              4. Review comprehensive results and projections
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  featuresContainer: {
    padding: 20,
  },
  featureCard: {
    marginBottom: 16,
    elevation: 2,
  },
  featureIcon: {
    textAlign: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    padding: 20,
  },
  startButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  infoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    elevation: 1,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    lineHeight: 20,
  },
});

export default HomeScreen;

