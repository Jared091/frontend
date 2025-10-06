import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
  
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Correo electrónico no válido');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
  
    setIsLoading(true);
  
    try {
      console.log("Enviando datos al servidor...");
      const response = await api.post('signup/', {
        username: username.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirm_password: confirmPassword,
      });
  
      console.log("Respuesta del servidor:", response.data);
      
      if (response.status === 201) {
        Alert.alert('Éxito', 'Cuenta creada correctamente', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      } else {
        throw new Error(response.data.error || "Error desconocido");
      }
    } catch (error: any) {
      console.error("Error completo:", {
        message: error.message,
        response: error.response?.data,
        code: error.code
      });
      
      let errorMessage = "Error en el servidor";
      if (error.message.includes("Network Error")) {
        errorMessage = "No se pudo conectar al servidor. Verifica tu conexión.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={require('../assets/logo.jpg')} style={styles.logo} />
          <Text style={styles.title}>Registro de Usuario</Text>
        </View>
        
        <View style={styles.formContainer}>
          {[
            { label: "Nombre de usuario", value: username, setter: setUsername },
            { label: "Nombre", value: firstName, setter: setFirstName },
            { label: "Apellido", value: lastName, setter: setLastName },
            { label: "Correo electrónico", value: email, setter: setEmail, keyboardType: "email-address" },
            { label: "Contraseña", value: password, setter: setPassword, secureTextEntry: true },
            { label: "Confirmar contraseña", value: confirmPassword, setter: setConfirmPassword, secureTextEntry: true }
          ].map(({ label, value, setter, keyboardType, secureTextEntry }, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text style={styles.label}>{label}:</Text>
              <TextInput
                style={styles.input}
                placeholder={`Ingresa tu ${label.toLowerCase()}`}
                placeholderTextColor="#A7C4A0"
                value={value}
                onChangeText={setter}
                autoCapitalize={label === "Correo electrónico" ? "none" : "words"}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
              />
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 50,
  },
  title: {
    color: '#8B7765',
    fontSize: 24,
    fontWeight: 'bold',
    maxWidth: 200,
  },
  formContainer: {
    backgroundColor: '#FFFFF0',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#8B7765',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    color: '#4d4d4d',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#D4A76A',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#A7C4A0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#8B7765',
    fontSize: 16,
    marginRight: 5,
  },
  loginLink: {
    color: '#C7875D',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});