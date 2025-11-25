import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMyTournaments } from '../api';
import { useAuth } from '../auth/AuthContext';

export default function TournamentsScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const loadData = async () => {
    try {
      const data = await getMyTournaments();
      setTournaments(data || []);
    } catch (e) {
      console.error('Error cargando torneos', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('Tournament', {
          id: item.id,
          name: item.name,
        })
      }
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <Text style={styles.cardLink}>Ver partidos ➜</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis torneos</Text>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Torneos a los que fuiste invitado como Gambler.
      </Text>

      <FlatList
        data={tournaments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No tenés torneos asignados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  logout: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  cardDesc: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    marginBottom: 8,
  },
  cardLink: {
    fontSize: 13,
    color: '#22c55e',
    fontWeight: '500',
  },
  empty: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});