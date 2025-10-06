import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerifyEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, ingresa tu correo electrónico.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('verify-email/', { email });
      if (response.data.exists) {
        setStep(2);
      } else {
        Alert.alert('Error', 'No existe una cuenta con este correo electrónico.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al verificar el correo. Inténtalo de nuevo.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa ambos campos de contraseña.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('change-password/', {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (response.data.success) {
        Alert.alert(
          'Éxito',
          'Tu contraseña ha sido actualizada correctamente.',
          [{ text: 'OK', onPress: () => router.replace('/login') }]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al cambiar la contraseña';
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {step === 1 ? (
            <>
              <Text style={styles.title}>Recuperar Contraseña</Text>
              <Text style={styles.subtitle}>
                Ingresa tu correo electrónico para cambiar tu contraseña.
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu correo electrónico"
                  placeholderTextColor="#A7C4A0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleVerifyEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Verificar correo</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Nueva Contraseña</Text>
              <Text style={styles.subtitle}>
                Estás cambiando la contraseña para: {email}
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nueva contraseña:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nueva contraseña"
                  placeholderTextColor="#A7C4A0"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar contraseña:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor="#A7C4A0"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleChangePassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Cambiar contraseña</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.secondaryButtonText}>Cambiar correo</Text>
              </TouchableOpacity>
            </>
          )}
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
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
  },
  formContainer: {
    backgroundColor: '#FFFFF0',
    padding: 25,
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    color: '#8B7765',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8B7765',
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#8B7765',
    marginBottom: 8,
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
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#228B22',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#8B7765',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});