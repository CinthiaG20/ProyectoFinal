import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMyTournaments, getTournament } from '../api';
import { useAuth } from '../auth/AuthContext';
import { styles } from '../ui/Styles'; 

export default function TournamentsScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const loadData = async () => {
    try {
      const data = await getTournament();
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
