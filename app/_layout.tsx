import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        const userRole = await AsyncStorage.getItem('user_role');
        
        if (!token) {
          if (segments[0] !== 'login' && segments[0] !== 'register' && segments[0] !== 'forgot-password') {
            router.replace('/login');
          }
          return;
        }

        if (userRole === 'admin' && segments[0] !== 'admin') {
          router.replace('/admin');
        } else if (userRole === 'staff' && segments[0] !== 'researcher') {
          router.replace('/researcher');
        } else if (userRole === 'usuario' && segments[0] !== 'client') {
          router.replace('/client');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="client" />
      <Stack.Screen name="researcher" />
      <Stack.Screen name="index" redirect href="/login" />
    </Stack>
  );
}