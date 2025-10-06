import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const userRole = await AsyncStorage.getItem('user_role');
        
        if (!token) {
          router.replace('/login');
          return;
        }

        switch (userRole) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'staff':
            router.replace('/researcher');
            break;
          case 'usuario':
            router.replace('/client');
            break;
          default:
            router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.replace('/login');
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5DC' }}>
      <ActivityIndicator size="large" color="#006400" />
      <Text style={{ marginTop: 10, color: '#006400' }}>Cargando...</Text>
    </View>
  );
}