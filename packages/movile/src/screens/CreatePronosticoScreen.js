import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { crear_actualizarPronostico } from '../api_Gamblers';
import { styles } from '../ui/Styles';

export default function CreatePronosticoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { match } = route.params || {};
  
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [loading, setLoading] = useState(false);
  

  const handleSave = async () => {
    if (!homeScore || !awayScore) {
      Alert.alert('Error', 'Por favor ingresa ambos resultados');
      return;
    }

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      Alert.alert('Error', 'Los resultados deben ser números');
      return;
    }

    try {
      setLoading(true);
      await crear_actualizarPronostico(
        match.id,
        homeScoreNum,
        awayScoreNum,
        match.homeTeam,
        match.awayTeam
      );
      Alert.alert('Éxito', 'Pronóstico guardado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error guardando pronóstico:', error);
      Alert.alert('Error', 'No se pudo guardar el pronóstico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear pronóstico</Text>
      
      {match && (
        <View style={styles.form}>
          <Text style={styles.label}>Partido: {match.title}</Text>
          <Text style={styles.cardDesc}>
            {new Date(match.date).toLocaleDateString()}
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Marcador local</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={homeScore}
                onChangeText={setHomeScore}
                placeholder="0"
                placeholderTextColor="#6b7280"
              />
            </View>
            
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.label}>Marcador visitante</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={awayScore}
                onChangeText={setAwayScore}
                placeholder="0"
                placeholderTextColor="#6b7280"
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Guardando...' : 'Guardar pronóstico'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.testButton, { marginTop: 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.testButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}