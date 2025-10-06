import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, Info, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../../styles/styles';

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('user_name');
      const username = await AsyncStorage.getItem('user_username');
      setUserName(name || username || 'Usuario');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "user_role",
        "user_id",
        "user_name",
        "user_username"
      ]);
      router.replace('/login');
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.userNameText}>{userName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <User size={24} color="white" />
        </TouchableOpacity>
        
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/client/gallery');
              }}
              style={styles.menuButton}
            >
              <Text style={styles.menuItem}>Galería de Imágenes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
              style={styles.menuButton}
            >
              <Text style={styles.menuItem}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.homeScrollContainer}>
        <View style={styles.instructionsContainer}>
          <Info size={32} color="#006400" style={{ marginBottom: 10 }} />
          <Text style={styles.instructionsTitle}>¿Cómo usar la aplicación?</Text>
          <Text style={styles.instructionsText}>
            1. Toma una foto de la planta que quieres identificar{'\n'}
            2. La aplicación clasificará automáticamente la planta{'\n'}
            3. Revisa los resultados y confianza de la clasificación{'\n'}
            4. Guarda la planta en tu colección personal{'\n'}
            5. Explora la galería para ver todas las plantas registradas
          </Text>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/client/formulario')}
          >
            <Camera size={20} color="#006400" style={{ marginRight: 8 }} />
            <Text style={styles.quickActionText}>Clasificar Nueva Planta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/client/gallery')}
          >
            <ImageIcon size={20} color="#006400" style={{ marginRight: 8 }} />
            <Text style={styles.quickActionText}>Explorar Galería</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}