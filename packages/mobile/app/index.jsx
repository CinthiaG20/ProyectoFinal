import { Text, View } from 'react-native';
import { styles } from '../ui/styles';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Desarrollo Web y Mobile - Proyecto 2025 sem 2
      </Text>

      <Text style={styles.bodyText}>
        Por favor, lea el archivo README.md para más información.
      </Text>
    </View>
  );
}
