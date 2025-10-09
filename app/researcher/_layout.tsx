import { Stack } from 'expo-router';

export default function ResearcherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Inicio' }} />
      <Stack.Screen name="formulario" options={{ title: 'Clasificar Planta' }} />
      <Stack.Screen name="gallery" options={{ title: 'Galería' }} />
      <Stack.Screen name="GaleryScreen" options={{ title: 'Tipo de Planta' }} />
      <Stack.Screen name="imageDetailScreen" options={{ title: 'Detalle de Imagen' }} />
    </Stack>
  );
}