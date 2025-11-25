import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { logout, useLogin } from "../api";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
                  style={[styles.testButton, loading && { opacity: 0.7 }]}
                  //onPress={fillTestCredentials}
                  disabled={loading}
                  activeOpacity={0.7}
                ></TouchableOpacity>
          <Text style={styles.testButtonText}>
            {loading ? 'Ingresando con credenciales de prueba...' : 'Usar credenciales de prueba'}
          </Text>
      
      <TouchableOpacity onPress={logout} style={[styles.testButton, loading && { opacity: 0.7 }]}>logout</TouchableOpacity>
      </View>
    </View>
  );
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