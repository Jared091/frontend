import { Stack } from 'expo-router';

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      <Stack.Screen name="formulario" options={{ title: 'Clasificar Planta' }} />
      <Stack.Screen name="gallery" options={{ title: 'Galería' }} />
    </Stack>
  );
}