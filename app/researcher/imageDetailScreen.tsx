import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, View, Pressable } from "react-native";
import styles from "../../styles/styles";

const ResearcherImageDetailScreen = () => {
  const { 
    imagen, 
    nombre, 
    especie, 
    ubicacion, 
    confianza
  } = useLocalSearchParams();

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#ffffff" size={24} />
        </Pressable>
        <Text style={styles.headerText}>Detalles de la Planta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Imagen principal */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imagen as string }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Información */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Información de la Planta</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{nombre || "Desconocido"}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Especie:</Text>
            <Text style={styles.value}>{especie || "No especificada"}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Ubicación:</Text>
            <Text style={styles.value}>{ubicacion || "No registrada"}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Confianza de clasificación:</Text>
            <Text style={styles.value}>
              {confianza ? `${confianza}%` : "N/A"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResearcherImageDetailScreen;