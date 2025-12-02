import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { styles } from '../ui/Styles';

export default function PartidosScreen() {
  const [tournaments, setTournaments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { signOut } = useAuth();
  

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis partidos</Text>
        <Text style={styles.title}>Mis shjsidiasd</Text>
        </View>
    </View>
  );
}
