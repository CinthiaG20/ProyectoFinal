import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { getMyMaches, MyTournaments } from '../api_Gamblers';
import { styles } from '../ui/Styles';
import { listaPartidos } from "../api_Managers";

export default function PartidosScreen() {
  const [myMatches, setMyMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { signOut } = useAuth();

  // partidos a los que tengo acceso
  const loadMyMatches = async () => {
    try {
      // Obtener mis torneos primero
      const misTorneos = await MyTournaments();
      
      if (!misTorneos || misTorneos.length === 0) {
        setMyMatches([]);
        return;
      }
      
      let misPartidos = [];
      
      for (let i = 0; i < misTorneos.length; i++) {
        const torneo = misTorneos[i];
        try {
          const partidos = await getMyMaches(torneo.id);
          
          if (partidos && partidos.length > 0) {
            const partidosConTorneo = partidos.map(partido => ({
              ...partido,
              tournamentName: torneo.name,
              tournamentId: torneo.id
            }));
            
            misPartidos = [...misPartidos, ...partidosConTorneo];
          }
        } catch (error) {
          console.log('Error en torneo ' + torneo.id + ':', error);
        }
      }
      
      setMyMatches(misPartidos);
      
    } catch (error) {
      console.log('Error cargando mis partidos:', error);
    }
  };

  // Cargar TODOS los partidos
  const loadAllMatches = async () => {
    try {
      const tournaments = await listaPartidos();
      
      if (!tournaments || tournaments.length === 0) {
        setAllMatches([]);
        return;
      }
      
      let todosLosPartidos = [];
      
      for (let i = 0; i < tournaments.length; i++) {
        const torneo = tournaments[i];
        try {
          const partidos = await getMyMaches(torneo.id);
          
          if (partidos && partidos.length > 0) {
            const partidosConTorneo = partidos.map(partido => ({
              ...partido,
              tournamentName: torneo.name,
              tournamentId: torneo.id
            }));
            
            todosLosPartidos = [...todosLosPartidos, ...partidosConTorneo];
          }
        } catch (error) {
          console.log('Error en torneo ' + torneo.id + ':', error);
        }
      }
      
      setAllMatches(todosLosPartidos);
      
    } catch (error) {
      console.log('Error cargando todos los partidos:', error);
    }
  };

  const loadData = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        loadMyMatches(),
        loadAllMatches()
      ]);
    } catch (error) {
      console.log('Error general:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    loadData();
  };

  const renderMatchItem = ({ item }) => {
    const fecha = new Date(item.date);
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          navigation.navigate('Tournament', {
            id: item.tournamentId,
            name: item.tournamentName
          });
        }}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>
          {fecha.toLocaleDateString()} • {item.tournamentName}
        </Text>
        
        {item.score ? (
          <Text style={{ color: '#9ca3af', fontSize: 14 }}>
            Resultado: {item.score[item.homeTeam]} - {item.score[item.awayTeam]}
          </Text>
        ) : (
          <Text style={{ color: '#9ca3af', fontSize: 14 }}>
            Sin resultado
          </Text>
        )}
        
        <Text style={styles.cardLink}>Ver detalles ➜</Text>
      </TouchableOpacity>
    );
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Partidos</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#22c55e"
          />
        }
      >
        {/* Sección: Mis Partidos */}
        <Text style={styles.sectionTitle}>Mis partidos</Text>
        <Text style={styles.subtitle}>
          Partidos de los torneos a los que tengo acceso
        </Text>

        {myMatches.length > 0 ? (
          <FlatList
            data={myMatches}
            keyExtractor={item => `my_${item.id}`}
            renderItem={renderMatchItem}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay partidos en tus torneos</Text>
            }
          />
        ) : (
          <Text style={styles.empty}>No hay partidos en tus torneos</Text>
        )}

        {/* Sección: Todos los Partidos */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Todos los partidos</Text>
        <Text style={styles.subtitle}>
          Lista completa de partidos disponibles
        </Text>

        {allMatches.length > 0 ? (
          <FlatList
            data={allMatches}
            keyExtractor={item => `all_${item.id}`}
            renderItem={renderMatchItem}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay partidos disponibles</Text>
            }
          />
        ) : (
          <Text style={styles.empty}>No hay partidos disponibles</Text>
        )}

        {/* Botón Ir a Torneos */}
        <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 24 }}>
          <TouchableOpacity
            style={[styles.button, { width: '80%' }]}
            onPress={() => navigation.navigate('TournamentsScreen')}
          >
            <Text style={styles.buttonText}>Ir a torneos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}