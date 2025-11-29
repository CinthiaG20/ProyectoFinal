import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { borrarTorneo, crearTorneo, listaTorneos, logout, MyTournaments, useLogin } from "../api";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ name, setName]=useState("")
  const [ description, setDescription]=useState("")
  const [ beginning, setBeginning]=useState("")
  const [ ending, setEnding]=useState("")
  const [id,setId]=useState("")

  const handleLogin= async ()=> useLogin(email,password)
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
  onPress={handleLogin}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  label: {
    fontSize: 13,
    color: '#e5e7eb',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#e5e7eb',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0b1120',
    fontWeight: '600',
    fontSize: 15,
  },
  testButton: {
    marginTop: 12,
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  testButtonText: {
    color: '#9ca3af',
    fontWeight: '500',
    fontSize: 14,
  },
  error: {
    marginTop: 8,
    color: '#f97373',
    fontSize: 13,
  },
  testInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  testInfoText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});