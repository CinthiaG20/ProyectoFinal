import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMyTournaments, getTournament, logout } from '../api';
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
        </View>
    </View>
  );
}
