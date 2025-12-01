import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { token, useLogin } from "../api_Usuarios-Admins";
import { styles } from '../ui/Styles';
// Importar useNavigation de React Navigation
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Obtener la navegación
  const navigation = useNavigation();

  const handleLogin= async ()=> {useLogin(email,password);console.log(token);
  
    navigation.navigate('MyGamblesScreen'); }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pencas · DWYM</Text>
      <Text style={styles.subtitle}>Iniciá sesión para ver tus torneos</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="usuario@ejemplo.com"
          placeholderTextColor="#6b7280"
        />
        
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#6b7280"
        />
        
        <TouchableOpacity style={styles.button}
          onPress={handleLogin }>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}