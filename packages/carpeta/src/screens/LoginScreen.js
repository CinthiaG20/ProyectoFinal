import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { borrarTorneo, crearTorneo, listaTorneos, logout, MyTournaments, useLogin } from "../api";
import { styles } from '../ui/Styles'; 

// Importar useNavigation de React Navigation
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ name, setName]=useState("")
  const [ description, setDescription]=useState("")
  const [ beginning, setBeginning]=useState("")
  const [ ending, setEnding]=useState("")
  const [id,setId]=useState("")

  // Obtener la navegación
  const navigation = useNavigation();

  const handleLogin= async ()=> {useLogin(email,password);
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
  );//07f3a466-45d9-4008-b59b-632a7f315af8
}


/*
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { borrarTorneo, crearTorneo, listaTorneos, logout, MyTournaments, useLogin } from "../api";
import { styles } from '../ui/Styles'; 

// Importar useNavigation de React Navigation
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ name, setName]=useState("")
  const [ description, setDescription]=useState("")
  const [ beginning, setBeginning]=useState("")
  const [ ending, setEnding]=useState("")
  const [id,setId]=useState("")

  // Obtener la navegación
  const navigation = useNavigation();

  const handleLogin= async ()=> {useLogin(email,password);
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
         
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={name}
          onChangeText={setName}
          placeholder="nombre"
          placeholderTextColor="#6b7280"
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={description}
          onChangeText={setDescription}
          placeholder="descripcion"
          placeholderTextColor="#6b7280"
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={beginning}
          onChangeText={setBeginning}
          placeholder="inicio"
          placeholderTextColor="#6b7280"
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={ending}
          onChangeText={setEnding}
          placeholder="fin"
          placeholderTextColor="#6b7280"
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={id}
          onChangeText={setId}
          placeholder="id para borrar"
          placeholderTextColor="#6b7280"
        />
        <TouchableOpacity
  style={styles.button}
  onPress={handleLogin }
>
  <Text>Login</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={logout}
>
  <Text>Logout</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => crearTorneo(name, description, beginning, ending)}
>
  <Text>Crear torneo</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={listaTorneos}
>
  <Text>Listar torneos</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => borrarTorneo(id)}
>
  <Text>Borrar torneo</Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.button}
  onPress={() => MyTournaments()}
>
  <Text>listar mis torneos</Text>
</TouchableOpacity>
      </View>
    </View>
  );//07f3a466-45d9-4008-b59b-632a7f315af8
}



*/