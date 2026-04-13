import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { getPriceHistory } from '../services/api';

const screenWidth = Dimensions.get('window').width;

export default function ChartScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For MVP, hardcoding SJC. In a real scenario, allow users to select symbol
    getPriceHistory('SJC').then((history) => {
      // Map history to GiftedCharts format
      const chartData = history.map((item: any) => ({
        value: item.buyPrice,
        label: new Date(item.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
      }));
      setData(chartData);
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SJC Price Trend (Buy)</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" />
      ) : data.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            width={screenWidth - 60}
            height={250}
            color="#D4AF37"
            thickness={3}
            dataPointsColor="#f44336"
            dataPointsRadius={4}
            yAxisColor="#333"
            xAxisColor="#333"
            yAxisTextStyle={{ color: '#888', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#888', fontSize: 10, width: 40 }}
            noOfSections={5}
            yAxisLabelSuffix="" // omit to keep simple
            curved
            isAnimated
            hideDataPoints={data.length > 30}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>No historical data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 30,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 30,
    paddingRight: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
  }
});
