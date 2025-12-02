import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { logout } from '../api_Usuarios-Admins';
import { MyTournaments } from '../api_Gamblers';
import { listaTorneos } from "../api_Managers";
import { useAuth } from '../auth/AuthContext';
import { styles } from '../ui/Styles';

export default function TournamentsScreen() {
  const [myTournaments, setMyTournaments] = useState([]);
  const [allTournaments, setAllTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { signOut } = useAuth();
  
  const loadData = async () => {
    try {
      setRefreshing(true);
      
      // torneos del gambler a los que tiene acceso
      const misTorneos = await MyTournaments();
      setMyTournaments(misTorneos || []);
      
      //  todos los torneos
      const todosTorneos = await listaTorneos();
      setAllTournaments(todosTorneos || []);
      
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

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Torneos</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mis torneos</Text>
      <Text style={styles.subtitle}>
        Torneos a los que fuiste invitado como Gambler.
      </Text>

      {myTournaments.length > 0 ? (
        <FlatList
          data={myTournaments}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No tenés torneos asignados.</Text>
          }
        />
      ) : (
        <Text style={styles.empty}>No tenés torneos asignados.</Text>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Todos los torneos</Text>
      <Text style={styles.subtitle}>
        Lista completa de torneos disponibles.
      </Text>

      {allTournaments.length > 0 ? (
        <FlatList
          data={allTournaments}
          keyExtractor={item => `all_${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay torneos disponibles.</Text>
          }
        />
      ) : (
        <Text style={styles.empty}>No hay torneos disponibles.</Text>
      )}
    </View>
  );
}