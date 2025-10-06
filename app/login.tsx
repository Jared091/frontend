import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }
    setError('');
    setLoading(true);

    try {
      console.log("Iniciando sesión con:", { email: email.toLowerCase().trim() });
      
      const response = await api.post("/login/", { 
        email: email.toLowerCase().trim(), 
        password 
      });
      
      console.log("Respuesta del servidor:", response.data);

      const { access, refresh, role, user_id, username, first_name } = response.data;

      await AsyncStorage.multiSet([
        ["access_token", access],
        ["refresh_token", refresh],
        ["user_role", role],
        ["user_id", user_id.toString()],
        ["user_username", username || ''],
        ["user_name", first_name || ''],
      ]);

      console.log("Datos almacenados correctamente");
      
      if (role === 'admin') {
        router.replace('/admin');
      } else if (role === 'staff') {
        router.replace('/researcher');
      } else {
        router.replace('/client');
      }

    } catch (error: any) {
      console.error("Error en login:", error);
      const errorMessage = error.response?.data?.error || "Error de conexión";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.header}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>Inicio de Sesión</Text>
      </View>
      
      <View style={styles.formContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico:</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Ingresa tu correo"
            placeholderTextColor="#A7C4A0"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#A7C4A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.push('/register')}
        >
          <Text style={styles.secondaryButtonText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.forgotPasswordButton}
          onPress={() => router.push('/forgot-password')}
        >
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.termsButton}
          onPress={() => setShowTermsModal(true)}
        >
          <Text style={styles.termsText}>Términos y Condiciones</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>
            
            <ScrollView style={styles.termsScroll}>
              <Text style={styles.termsContent}>
                <Text style={styles.termsSectionTitle}>1. ACEPTACIÓN DE LOS TÉRMINOS{"\n\n"}</Text>
                
                Al acceder y utilizar esta aplicación, usted acepta cumplir y estar sujeto a estos términos y condiciones de uso.{"\n\n"}

                <Text style={styles.termsSectionTitle}>2. USO DE LA APLICACIÓN{"\n\n"}</Text>
                
                2.1. La aplicación está diseñada para la clasificación y gestión de plantas.{"\n"}
                2.2. Usted se compromete a utilizar la aplicación únicamente para fines legales.{"\n"}
                2.3. Es responsable de mantener la confidencialidad de su cuenta y contraseña.{"\n\n"}

                <Text style={styles.termsSectionTitle}>3. PROPIEDAD INTELECTUAL{"\n\n"}</Text>
                
                3.1. Todo el contenido de la aplicación está protegido por derechos de autor.{"\n"}
                3.2. Las imágenes y datos subidos siguen siendo de su propiedad.{"\n\n"}

                <Text style={styles.termsSectionTitle}>4. PRIVACIDAD Y DATOS{"\n\n"}</Text>
                
                4.1. Respetamos su privacidad y protegemos sus datos personales.{"\n"}
                4.2. Sus datos solo se utilizarán para los fines de la aplicación.{"\n\n"}

                <Text style={styles.termsSectionTitle}>5. LIMITACIÓN DE RESPONSABILIDAD{"\n\n"}</Text>
                
                5.1. La aplicación se proporciona "tal cual" sin garantías de ningún tipo.{"\n"}
                5.2. No nos hacemos responsables por daños derivados del uso de la aplicación.{"\n\n"}

                <Text style={styles.termsSectionTitle}>6. MODIFICACIONES{"\n\n"}</Text>
                
                Nos reservamos el derecho de modificar estos términos en cualquier momento.{"\n\n"}

                <Text style={styles.termsSectionTitle}>7. CONTACTO{"\n\n"}</Text>
                
                Para cualquier consulta sobre estos términos, puede contactarnos a través de la aplicación.
              </Text>
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F5F5DC' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  logo: { 
    width: 100, 
    height: 100, 
    marginRight: 20, 
    borderRadius: 50 
  },
  title: { 
    color: '#8B7765', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  formContainer: { 
    backgroundColor: '#FFFFF0', 
    padding: 20, 
    borderRadius: 10, 
    width: '90%', 
    maxWidth: 400 
  },
  inputGroup: { 
    marginBottom: 15 
  },
  label: { 
    color: '#8B7765', 
    marginBottom: 5, 
    fontSize: 16 
  },
  input: { 
    backgroundColor: '#FFFFFF', 
    padding: 12, 
    borderRadius: 5, 
    color: '#333', 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#DDD' 
  },
  inputError: { 
    borderColor: '#FF6B6B' 
  },
  button: { 
    backgroundColor: '#D4A76A', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 20 
  },
  disabledButton: { 
    backgroundColor: '#CCCCCC' 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  secondaryButton: { 
    marginTop: 15, 
    alignItems: 'center' 
  },
  secondaryButtonText: { 
    color: '#C7875D', 
    fontSize: 16, 
    textDecorationLine: 'underline' 
  },
  forgotPasswordButton: { 
    marginTop: 10, 
    alignItems: 'center' 
  },
  forgotPasswordText: { 
    color: '#8B7765', 
    fontSize: 14 
  },
  termsButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  termsText: {
    color: '#8B7765',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  errorText: { 
    color: '#FF6B6B', 
    fontSize: 14, 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFF0',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    color: '#8B7765',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  termsScroll: {
    maxHeight: 400,
    marginBottom: 15,
  },
  termsContent: {
    color: '#8B7765',
    fontSize: 14,
    lineHeight: 20,
  },
  termsSectionTitle: {
    fontWeight: 'bold',
    color: '#D4A76A',
  },
  closeButton: {
    backgroundColor: '#D4A76A',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});