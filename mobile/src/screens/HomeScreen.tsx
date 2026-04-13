import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { getLatestPrices } from '../services/api';

export default function HomeScreen() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPrices = async () => {
    try {
      const data = await getLatestPrices();
      setPrices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPrices();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchPrices().finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <View style={styles.pricesContainer}>
        <View style={styles.priceColumn}>
          <Text style={styles.priceLabel}>Buy</Text>
          <Text style={styles.buyPrice}>{item.buyPrice?.toLocaleString()} VND</Text>
        </View>
        <View style={styles.priceColumn}>
          <Text style={styles.priceLabel}>Sell</Text>
          <Text style={styles.sellPrice}>{item.sellPrice?.toLocaleString()} VND</Text>
        </View>
      </View>
      <Text style={styles.timestamp}>Last update: {new Date(item.recordedAt).toLocaleString()}</Text>
      <Text style={styles.source}>Source: {item.source}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
      ) : (
        <FlatList
          data={prices}
          keyExtractor={(item) => item.symbol}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />}
          ListEmptyComponent={<Text style={styles.emptyText}>No rates available</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  symbol: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37', // Gold color
  },
  category: {
    fontSize: 12,
    color: '#aaa',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pricesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceColumn: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  buyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50', // Green
  },
  sellPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336', // Red
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  source: {
    fontSize: 12,
    color: '#D4AF37',
    marginTop: 4,
    fontWeight: '600'
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  }
});
