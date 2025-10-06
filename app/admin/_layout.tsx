import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Administrador' }} />
      <Stack.Screen name="researcher" options={{ title: 'Gestión Investigadores' }} />
      <Stack.Screen name="galeria" options={{ title: 'Galería' }} />
    </Stack>
  );
}