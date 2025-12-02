import { Text, TouchableOpacity, View } from 'react-native';
//import { getMyGambles, MyTournaments } from '../api';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../ui/Styles';

export default function MyGamblesScreen() {
  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>  navigation.navigate('TournamentsScreen')}
        >
          <Text>Torneos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PartidosScreen')}
        >
          <Text>Partidos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('InvitationScreen')}
        >
          <Text>Mis invitaciones </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//    onPress={() => MyTournaments()}
//   navigation.navigate('TournamentsScreen')