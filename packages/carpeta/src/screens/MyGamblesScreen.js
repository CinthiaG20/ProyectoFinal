import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getMyGambles, MyTournaments } from '../api';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../ui/Styles'; 

export default function MyGamblesScreen() {
  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis pronósticos</Text>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>  navigation.navigate('TournamentsScreen')}
        >
          <Text>torneos a los que tiene acceso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => getGambleID()}
        >
          <Text>partidos a los que tiene acceso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TournamentsScreen')}
        >
          <Text>Mis invitaciones </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//    onPress={() => MyTournaments()}
//   navigation.navigate('TournamentsScreen')