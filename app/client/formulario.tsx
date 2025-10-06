import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { MoreVertical } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../api";
import styles from "../../styles/styles";

export default function ClientFormScreen() {
  const router = useRouter();
  const [nombrePlanta, setNombrePlanta] = useState("");
  const [especie, setEspecie] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [imagenUri, setImagenUri] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [estadoPlanta, setEstadoPlanta] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showTooltipCamera, setShowTooltipCamera] = useState(false);
  const [showTooltipGallery, setShowTooltipGallery] = useState(false);

  const tiposPlantas = [
    "Arbusto",
    "Capulin",
    "Malvon",
    "Ocote",
    "Pasto",
    "Pera",
    "Pino",
    "Trebol",
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos requeridos",
          "Se necesita acceso a la cámara para continuar"
        );
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("user_id").then((id) => setUserId(id));
  }, []);

  const validarCampos = () => {
    if (!estadoPlanta) {
      Alert.alert("Validación", "Selecciona el estado de la planta.");
      return false;
    }
    if (!nombrePlanta) {
      Alert.alert("Validación", "Selecciona el tipo de planta.");
      return false;
    }
    if (!especie.trim()) {
      Alert.alert("Validación", "Ingresa la especie.");
      return false;
    }
    if (!ubicacion.trim()) {
      Alert.alert("Validación", "Ingresa la ubicación.");
      return false;
    }
    return true;
  };

  const tomarFoto = async () => {
    if (!validarCampos()) return;
    try {
      setCargando(true);
      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!resultado.canceled && resultado.assets?.[0]) {
        const imagen = resultado.assets[0];
        setImagenUri(imagen.uri);

        const formData = new FormData();
        formData.append("image", {
          uri: imagen.uri,
          type: "image/jpeg",
          name: `clasificacion_${Date.now()}.jpg`,
        });

        const respuesta = await api.post(
          "/classify-tree/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (
          respuesta.data?.class &&
          respuesta.data.confidence !== undefined
        ) {
          const confianza = Math.round(respuesta.data.confidence * 100);
          setResultado({
            nombre: respuesta.data.class,
            confianza: confianza,
          });
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "No se pudo tomar o clasificar la foto"
      );
    } finally {
      setCargando(false);
    }
  };

  const cargarGaleria = async () => {
    if (!validarCampos()) return;
    try {
      setCargando(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const imagen = result.assets[0];
        setImagenUri(imagen.uri);

        const formData = new FormData();
        formData.append("image", {
          uri: imagen.uri,
          type: "image/jpeg",
          name: `clasificacion_${Date.now()}.jpg`,
        });

        const respuesta = await api.post(
          "/classify-tree/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (
          respuesta.data?.class &&
          respuesta.data.confidence !== undefined
        ) {
          const confianza = Math.round(respuesta.data.confidence * 100);
          setResultado({
            nombre: respuesta.data.class,
            confianza: confianza,
          });
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "No se pudo cargar o clasificar la imagen"
      );
    } finally {
      setCargando(false);
    }
  };

  const guardarPlanta = async () => {
    const formData = new FormData();
    formData.append("Nombre", nombrePlanta);
    formData.append("Especie", especie);
    formData.append("Ubicacion", ubicacion);
    formData.append("usuario", Number(userId));
    formData.append("estado", 1);
    formData.append("confianza", resultado?.confianza ?? 0);
    formData.append("imagen", {
      uri: imagenUri,
      type: "image/jpeg",
      name: `planta_${Date.now()}.jpg`,
    });

    try {
      setGuardando(true);
      const response = await api.post("/plantas/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Éxito", "Planta guardada correctamente.");
        // Solo resetea el formulario, no redirige a galería
        setNombrePlanta("");
        setEspecie("");
        setUbicacion("");
        setImagenUri(null);
        setResultado(null);
        setEstadoPlanta("");
      } else {
        Alert.alert("Error", "No se pudo guardar la planta.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert("Error", error.message || "No se pudo guardar la planta.");
    } finally {
      setGuardando(false);
    }
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

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5DC" }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Clasificar Planta</Text>
        <TouchableOpacity
          onPress={() => setMenuVisible(!menuVisible)}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <MoreVertical size={24} color="white" />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/client');
              }}
              style={styles.menuButton}
            >
              <Text style={styles.menuItem}>Ir al Inicio</Text>
            </TouchableOpacity>
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Estado de la planta:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={estadoPlanta}
              onValueChange={setEstadoPlanta}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona estado" value="" />
              <Picker.Item label="Sana" value="s" />
            </Picker>
          </View>

          <Text style={styles.label}>Tipo de planta:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={nombrePlanta}
              onValueChange={setNombrePlanta}
              style={styles.picker}
              enabled={!!estadoPlanta}
            >
              <Picker.Item label="Selecciona tipo" value="" />
              {tiposPlantas.map((tipo) => (
                <Picker.Item key={tipo} label={tipo} value={tipo} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Especie:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Pinus oocarpa"
            value={especie}
            onChangeText={setEspecie}
            editable={!!nombrePlanta}
          />

          <Text style={styles.label}>Ubicación:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Jardín trasero, zona 5"
            value={ubicacion}
            onChangeText={setUbicacion}
            editable={!!especie.trim()}
          />

          <View style={styles.botonesContainer}>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.iconButtonGreen}
                onPress={tomarFoto}
                onPressIn={() => setShowTooltipCamera(true)}
                onPressOut={() => setShowTooltipCamera(false)}
                disabled={
                  cargando ||
                  !estadoPlanta ||
                  !nombrePlanta ||
                  !especie.trim() ||
                  !ubicacion.trim()
                }
              >
                <Feather name="camera" size={26} color="#fff" />
              </TouchableOpacity>
              {showTooltipCamera && (
                <View style={styles.tooltipBox}>
                  <Text style={styles.tooltipText}>Tomar foto con la cámara</Text>
                </View>
              )}
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.iconButtonGreen}
                onPress={cargarGaleria}
                onPressIn={() => setShowTooltipGallery(true)}
                onPressOut={() => setShowTooltipGallery(false)}
                disabled={
                  cargando ||
                  !estadoPlanta ||
                  !nombrePlanta ||
                  !especie.trim() ||
                  !ubicacion.trim()
                }
              >
                <Feather name="image" size={26} color="#fff" />
              </TouchableOpacity>
              {showTooltipGallery && (
                <View style={styles.tooltipBox}>
                  <Text style={styles.tooltipText}>
                    Seleccionar imagen de la galería
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.cameraButton,
              styles.saveButton,
              (!imagenUri ||
                guardando ||
                cargando ||
                !estadoPlanta ||
                !nombrePlanta ||
                !especie.trim() ||
                !ubicacion.trim()) &&
                styles.cameraButtonDisabled,
            ]}
            onPress={guardarPlanta}
            disabled={
              !imagenUri ||
              guardando ||
              cargando ||
              !estadoPlanta ||
              !nombrePlanta ||
              !especie.trim() ||
              !ubicacion.trim()
            }
          >
            <Feather name="save" size={22} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.cameraButtonText}>
              {guardando ? "Guardando..." : "Guardar Planta"}
            </Text>
          </TouchableOpacity>

          {cargando && (
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <ActivityIndicator size="large" color="#3498db" />
            </View>
          )}

          {imagenUri && !cargando && (
            <View style={styles.resultadoContainer}>
              <Image
                source={{ uri: imagenUri }}
                style={{ width: 224, height: 224, borderRadius: 10, marginBottom: 15, borderWidth: 2, borderColor: '#2ecc71', alignSelf: 'center' }}
                resizeMode="cover"
              />
              {resultado && (
                <View style={styles.resultadoBox}>
                  <Feather
                    name="check-circle"
                    size={32}
                    color="#2ecc71"
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={styles.resultadoTitulo}>
                    ¡Clasificación exitosa!
                  </Text>
                  <Text style={styles.resultadoTexto}>
                    Planta clasificada como:{" "}
                    <Text style={{ fontWeight: "bold", color: "#006400" }}>
                      {resultado.nombre}
                    </Text>
                  </Text>
                  <Text style={styles.resultadoTexto}>
                    Confianza:{" "}
                    <Text style={{ fontWeight: "bold", color: "#1E88E5" }}>
                      {resultado.confianza}%
                    </Text>
                  </Text>
                  {/* NO incluir botón de corregir clasificación para clientes */}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}