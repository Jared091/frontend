import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ArrowLeft, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../styles/styles";

// Datos estáticos de los tipos de plantas
const PLANT_TYPES = [
  { id: '1', name: 'Arbusto', image: require('../../assets/arbusto.jpg') },
  { id: '2', name: 'Capulin', image: require('../../assets/capulin.jpg') },
  { id: '3', name: 'Malvon', image: require('../../assets/malvon.jpg') },
  { id: '4', name: 'Ocote', image: require('../../assets/ocote.jpg') },
  { id: '5', name: 'Pasto', image: require('../../assets/pasto.jpeg') },
  { id: '6', name: 'Pera', image: require('../../assets/pera.jpg') },
  { id: '7', name: 'Pino', image: require('../../assets/pino.png') },
  { id: '8', name: 'Trebol', image: require('../../assets/trebol.webp') },
];

export default function PlantMenuScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem("user_name");
      const username = await AsyncStorage.getItem("user_username");
      setUserName(name || username || "Administrador");
    } catch (error) {
      console.error("Error loading user data:", error);
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

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.galleryItem}
      onPress={() =>
        router.push({
          pathname: "/admin/GaleryScreen", // Aseguramos que coincide con el nombre de archivo del layout
          params: { type: item.name },
        })
      }
    >
      <Image
        source={item.image}
        style={styles.galleryImage}
        resizeMode="cover"
      />
      <Text style={styles.galleryImageName}>{item.name}</Text>
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
          <Text style={styles.welcomeText}>Tipos de Plantas</Text>
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
                router.push("/admin");
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

      {/* Galería de tipos de plantas */}
      <FlatList
        data={PLANT_TYPES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 15 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}