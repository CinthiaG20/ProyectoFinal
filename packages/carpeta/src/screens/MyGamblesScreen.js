import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getMyGambles } from '../api';

export default function MyGamblesScreen() {
  const [gambles, setGambles] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyGambles();
        setGambles(data || []);
      } catch (e) {
        console.error('Error cargando mis pronósticos', e);
      }
    };
    load();
  }, []);

  const renderItem = ({ item }) => {
    const teamIds = Object.keys(item.score || {});
    const [t1, t2] = teamIds;
    return (
      <View style={styles.card}>
        <Text style={styles.label}>Partido: {item.match}</Text>
        <Text style={styles.value}>
          Pronóstico: {t1 && t2 ? `${item.score[t1]} - ${item.score[t2]}` : 'N/D'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis pronósticos</Text>
      <Text style={styles.subtitle}>
        Resumen rápido de todos los pronósticos que cargaste.
      </Text>

      <FlatList
        data={gambles}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Todavía no hiciste pronósticos.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  label: {
    fontSize: 13,
    color: '#e5e7eb',
  },
  value: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  empty: {
    color: '#9ca3af',
    marginTop: 40,
    textAlign: 'center',
  },
});