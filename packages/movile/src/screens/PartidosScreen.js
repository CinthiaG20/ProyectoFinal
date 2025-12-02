import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { MyTournaments, getMyMaches } from '../api_Gamblers';
import { styles } from '../ui/Styles';

export default function PartidosScreen() {
  const [allMatches, setAllMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const loadAllMatches = async () => {
    try {
      setRefreshing(true);
      
      const tournaments = await MyTournaments();
      
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
      console.log('Error general:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllMatches();
  }, []);

  const onRefresh = () => {
    loadAllMatches();
  };

  const renderItem = ({ item }) => {
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
        <Text style={styles.title}>Mis partidos</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Partidos de todos tus torneos
      </Text>

      <FlatList
        data={allMatches}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 12 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#22c55e"
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={styles.empty}>No hay partidos</Text>
            <TouchableOpacity
              style={[styles.button, { marginTop: 16 }]}
              onPress={() => navigation.navigate('TournamentsScreen')}
            >
              <Text style={styles.buttonText}>Ir a torneos</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}