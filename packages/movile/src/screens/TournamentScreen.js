import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMyMaches, getMyGambles, crear_actualizarPronostico } from '../api_Gamblers';
import { calculatePoints } from '../utils/score';
import { styles } from '../ui/Styles';

export default function TournamentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, name } = route.params;
  const [matches, setMatches] = useState([]);
  const [gambles, setGambles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matchesData, gamblesData] = await Promise.all([
        getMyMaches(id),
        getMyGambles(id)
      ]);
      setMatches(matchesData || []);
      setGambles(gamblesData || []);
    } catch (error) {
      console.error('Error cargando datos del torneo:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del torneo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSavePronostico = async (matchId, homeScore, awayScore, equipo1Id, equipo2Id) => {
    try {
      await crear_actualizarPronostico(matchId, homeScore, awayScore, equipo1Id, equipo2Id);
      Alert.alert('Éxito', 'Pronóstico guardado');
      loadData();
    } catch (error) {
      console.error('Error guardando pronóstico:', error);
      Alert.alert('Error', 'No se pudo guardar el pronóstico');
    }
  };

  const renderMatchItem = ({ item: match }) => {
    const miPronostico = gambles.find(g => g.match === match.id);

    const puntos = match.score && miPronostico?.score
      ? calculatePoints(match.score, miPronostico.score)
      : 0;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{match.title}</Text>
        <Text style={styles.cardDesc}>
          {new Date(match.date).toLocaleDateString()}
        </Text>

        {match.score && (
          <Text style={styles.info}>
            Resultado: {match.score[match.homeTeam]} - {match.score[match.awayTeam]}
          </Text>
        )}

        {miPronostico && (
          <Text style={styles.info}>
            Tu pronóstico: {miPronostico.score[match.homeTeam]} - {miPronostico.score[match.awayTeam]}
          </Text>
        )}

        {puntos > 0 && (
          <Text style={styles.cardLink}>Puntos obtenidos: {puntos}</Text>
        )}

        {!match.score && (
          <TouchableOpacity
            style={[styles.button, { marginTop: 8 }]}
            onPress={() => {
              navigation.navigate('CreatePronostico', { match });
            }}
          >
            <Text style={styles.buttonText}>Hacer pronóstico</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>
        Partidos del torneo
      </Text>

      <FlatList
        data={matches}
        keyExtractor={item => item.id}
        renderItem={renderMatchItem}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay partidos en este torneo.</Text>
        }
      />
    </View>
  );
}
