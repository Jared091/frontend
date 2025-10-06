import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Search, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getImageUrl } from '../../api/index';
import api from '../../api/index.js';
import styles from '../../styles/styles';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 60) / 2;

export default function GalleryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imagenes, setImagenes] = useState([]);
  const [filteredImagenes, setFilteredImagenes] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(params.search ? String(params.search) : '');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserData();
    fetchImagenes();
  }, []);

  useEffect(() => {
    filterImagenes();
  }, [searchQuery, imagenes]);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('user_name');
      const username = await AsyncStorage.getItem('user_username');
      setUserName(name || username || 'Investigador');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchImagenes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/imagenes/');
      setImagenes(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las imágenes');
    } finally {
      setLoading(false);
    }
  };

  const filterImagenes = () => {
    if (!searchQuery.trim()) {
      setFilteredImagenes(imagenes);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = imagenes.filter(imagen => 
      imagen.Nombre?.toLowerCase().includes(query) ||
      imagen.Especie?.toLowerCase().includes(query) ||
      imagen.Ubicacion?.toLowerCase().includes(query) ||
      imagen.fecha_creacion?.toLowerCase().includes(query) ||
      imagen.confianza?.toString().includes(query)
    );
    setFilteredImagenes(filtered);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "access_token",
      "refresh_token",
      "user_role",
      "user_id",
    ]);
    router.replace('/login');
  };

  const renderItem = ({ item }) => {
    const imageUrl = getImageUrl(item.imagen);

    return (
      <View style={styles.galleryItem}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.galleryImage}
          resizeMode="cover"
        />
        <View style={styles.galleryInfo}>
          <Text style={styles.galleryPlantName}>{item.Nombre}</Text>
          <Text style={styles.gallerySpecies}>{item.Especie}</Text>
          <Text style={styles.galleryLocation}>{item.Ubicacion}</Text>
          <Text style={styles.galleryConfidence}>
            Confianza: {item.confianza}%
          </Text>
          {item.fecha_creacion && (
            <Text style={styles.galleryDate}>
              {new Date(item.fecha_creacion).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.welcomeText}>Galería de Plantas</Text>
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
                router.push('/researcher');
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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, especie, ubicación, fecha o confianza..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#A7C4A0"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.resultsCounter}>
        <Text style={styles.resultsText}>
          {filteredImagenes.length} {filteredImagenes.length === 1 ? 'imagen encontrada' : 'imágenes encontradas'}
          {searchQuery && ` para "${searchQuery}"`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={styles.loadingText}>Cargando imágenes...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredImagenes}
          keyExtractor={item => item.Id_Planta.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.galleryList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No se encontraron imágenes que coincidan con la búsqueda' : 'No hay imágenes disponibles'}
              </Text>
            </View>
          }
          refreshing={loading}
          onRefresh={fetchImagenes}
        />
      )}
    </View>
  );
}