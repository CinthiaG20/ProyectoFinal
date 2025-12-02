import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getTournamentMatches, getTournamentGambles, postGamble } from '../api';
import { calculatePoints } from '../utils/score';

export default function TournamentScreen() {
  const route = useRoute();
  const { id, name } = route.params;
  const [matches, setMatches] = useState([]);
  const [gambles, setGambles] = useState([]);
  const [savingIds, setSavingIds] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, g] = await Promise.all([
          getTournamentMatches(id),
          getTournamentGambles(id),
        ]);
        setMatches(m || []);
        setGambles(g || []);
      } catch (e) {
        console.error('Error cargando torneo', e);
      }
    };
    load();
  }, [id]);

  const myUserId = useMemo(() => {
    const anyGamble = gambles[0];
    return anyGamble?.user || null;
  }, [gambles]);

  const enhancedMatches = useMemo(() => {
    return (matches || []).map(match => {
      const gamblesForMatch = gambles.filter(g => g.match === match.id);
      const myGamble = gamblesForMatch.find(g => g.user === myUserId) || null;

      let myPoints = 0;
      if (match.score && myGamble?.score) {
        myPoints = calculatePoints(match.score, myGamble.score);
      }

      return {
        ...match,
        gambles: gamblesForMatch,
        myGamble,
        myPoints,
      };
    });
  }, [matches, gambles, myUserId]);

  const totalMyPoints = enhancedMatches.reduce(
    (acc, m) => acc + (m.myPoints || 0),
    0
  );

  const handleSave = async (match, localScore) => {
    try {
      setSavingIds(prev => [...prev, match.id]);
      await postGamble(match.id, localScore);
      const updatedGambles = await getTournamentGambles(id);
      setGambles(updatedGambles || []);
    } catch (e) {
      console.error('Error guardando pronóstico', e);
    } finally {
      setSavingIds(prev => prev.filter(x => x !== match.id));
    }
  };

  const renderItem = ({ item: match }) => {
    const isPlayed = !!match.score;

    const teamIds = match.teams || [];
    const [team1, team2] = teamIds;

    const [localScore, setLocalScore] = useState(() => {
      const initial = {};
      teamIds.forEach(t => {
        initial[t] = match.myGamble?.score?.[t] ?? 0;
      });
      return initial;
    });

    const updateScore = (teamId, value) => {
      setLocalScore(prev => ({
        ...prev,
        [teamId]: Number(value) || 0,
      }));
    };

    const saving = savingIds.includes(match.id);

    return (
      <View style={styles.card}>
        <Text style={styles.matchTitle}>{match.title}</Text>
        <Text style={styles.matchDate}>
          {new Date(match.date).toLocaleString()}
        </Text>

        {isPlayed && (
          <Text style={styles.result}>
            Resultado oficial: {match.score[team1]} - {match.score[team2]}
          </Text>
        )}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Tu pronóstico</Text>
            <View style={styles.scoreRow}>
              {teamIds.map(t => (
                <View key={t} style={styles.scoreItem}>
                  <Text style={styles.teamLabel}>{t}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    defaultValue={String(localScore[t] ?? 0)}
                    onChangeText={value => updateScore(t, value)}
                  />
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.6 }]}
              onPress={() => handleSave(match, localScore)}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Guardando...' : 'Guardar pronóstico'}
              </Text>
            </TouchableOpacity>
          </View>

          {isPlayed && (
            <View style={styles.pointsBox}>
              <Text style={styles.pointsLabel}>Tus puntos</Text>
              <Text style={styles.pointsValue}>{match.myPoints}</Text>
            </View>
          )}
        </View>

        {isPlayed && match.gambles?.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Pronósticos de otros usuarios</Text>
            {match.gambles.slice(0, 3).map(g => (
              <Text key={g.id} style={styles.otherGamble}>
                Usuario {g.user}: {g.score[team1]} - {g.score[team2]}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>
        Gestioná tus pronósticos y mirá tus puntos en el torneo.
      </Text>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Puntos acumulados</Text>
        <Text style={styles.totalValue}>{totalMyPoints}</Text>
      </View>

      <FlatList
        data={enhancedMatches}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}
