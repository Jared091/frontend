import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, User } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import styles from "../../styles/styles";

export default function ResearcherGalleryTypeScreen() {
  const { type } = useLocalSearchParams();
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadUserData();
    fetchImagenes();
  }, [type]);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("user_name");
      const username = await AsyncStorage.getItem("user_username");
      setUserName(name || username || "Investigador");
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const fetchImagenes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/imagenes/");
      let allImages = response.data;

      // Filtrar por tipo específico
      if (type) {
        allImages = allImages.filter(
          (img: any) => img.Nombre === type || img.Especie === type
        );
      }

      // Normalizar campos y construir URL completa
      const normalized = allImages.map((img: any, index: number) => ({
        id: img.Id_Planta ?? index,
        Nombre: img.Nombre ?? "Desconocido",
        Especie: img.Especie ?? "Sin especie",
        Ubicacion: img.Ubicacion ?? "No especificada",
        Confianza: img.confianza ?? 0,
        ImagenURL: img.imagen?.startsWith('http') 
          ? img.imagen 
          : `http://192.168.1.65:8000/media/${img.imagen}`,
        ...img,
      }));

      setImagenes(normalized);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      Alert.alert("Error", "No se pudieron cargar las imágenes");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "access_token",
      "refresh_token",
      "user_role",
      "user_id",
    ]);
    router.replace("/login");
  };

  const renderImage = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() =>
        router.push({
          pathname: "/researcher/imageDetailScreen",
          params: { 
            id: item.id,
            imagen: item.ImagenURL,
            nombre: item.Nombre,
            especie: item.Especie,
            ubicacion: item.Ubicacion,
            confianza: item.Confianza,
          },
        })
      }
    >
      <Image
        source={{ uri: item.ImagenURL }}
        style={styles.galleryImage}
        resizeMode="cover"
      />
      <Text style={styles.galleryImageName}>{item.Nombre}</Text>
      <Text style={styles.galleryImageType}>{item.Especie}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.welcomeText}>{type || "Galería"}</Text>
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
                router.push("/researcher");
              }}
              style={styles.menuButton}
            >
              <Text style={styles.menuItem}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
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

      {/* Galería de imágenes */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Cargando imágenes...</Text>
        </View>
      ) : (
        <FlatList
          data={imagenes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderImage}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay imágenes de {type} en la galería
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}