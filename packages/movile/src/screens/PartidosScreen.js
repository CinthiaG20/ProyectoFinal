import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
<<<<<<< HEAD:packages/carpeta/src/screens/PartidosScreen.js
import { getMyTournaments, getTournament, logout } from '../api_Gamblers';
=======
import { getMyTournaments, getTournament, logout } from '../api';
>>>>>>> 46319f3e3c0dfa165b944232827ed78115ae6693:packages/movile/src/screens/PartidosScreen.js
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
<<<<<<< HEAD:packages/carpeta/src/screens/PartidosScreen.js
        <Text style={styles.title}>Mis shjsidiasd</Text>
=======
>>>>>>> 46319f3e3c0dfa165b944232827ed78115ae6693:packages/movile/src/screens/PartidosScreen.js
        </View>
    </View>
  );
}
