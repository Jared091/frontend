import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { MoreVertical, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../api/index';
import styles from '../../styles/styles';

export default function AdminScreen() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  // Estado para nuevo usuario
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'usuario'
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/getUsers/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data);
      const errorMessage = error.response?.data?.error || "Error en el servidor";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalVisible(true);
  };

  const handleChangeRole = async () => {
    if (!newRole) {
      Alert.alert("Error", "Debes seleccionar un rol");
      return;
    }

    try {
      await api.put(`/updateUser/${selectedUser.id}/`, { role: newRole });
      Alert.alert("Éxito", "Rol actualizado correctamente");
      await fetchUsers();
      setModalVisible(false);
    } catch (error) {
      console.error("Error:", error.response?.data);
      const errorMessage = error.response?.data?.error || "Error al actualizar el rol";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // Intentar con la ruta de DRF que probablemente existe
      await api.delete(`/users/${selectedUser.id}/`);
      Alert.alert("Éxito", "Usuario eliminado correctamente");
      await fetchUsers();
      setDeleteModalVisible(false);
      setModalVisible(false);
    } catch (error: any) {
      console.error("Error:", error.response?.data);
      const errorMessage = error.response?.data?.error ||
        error.response?.data?.detail ||
        "Error al eliminar el usuario";
      Alert.alert("Error", errorMessage);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    return emailRegex.test(email);
  };

  const handleCreateUser = async () => {
    // Validar campos requeridos
    if (!newUser.username || !newUser.email || !newUser.password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos marcados con * son obligatorios');
      return;
    }

    if (!validateEmail(newUser.email)) {
      Alert.alert('Error', 'Correo electrónico no válido');
      return;
    }

    if (newUser.password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setCreateLoading(true);

    try {
      console.log("📝 Creando nuevo usuario...", {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      });

      // 1. Crear usuario básico con signup
      const signupResponse = await api.post("/signup/", {
        username: newUser.username.trim(),
        first_name: newUser.first_name.trim(),
        last_name: newUser.last_name.trim(),
        email: newUser.email.trim().toLowerCase(),
        role: 'usuario',  // Crear siempre como 'usuario' inicialmente
        password: newUser.password,
        confirm_password: confirmPassword,
      });

      console.log("✅ Usuario base creado:", signupResponse.data);

      // 2. Si el rol no es 'usuario', actualizar el rol
      if (signupResponse.status === 201 && newUser.role !== 'usuario') {
        console.log("🔄 Actualizando rol a:", newUser.role);

        // Esperar un poco para que el usuario se cree en la base de datos
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Obtener todos los usuarios para encontrar el ID del nuevo usuario
        const usersResponse = await api.get("/getUsers/");
        const newUserFromServer = usersResponse.data.find(
          (u: any) => u.username === newUser.username.trim()
        );

        if (newUserFromServer) {
          console.log("🎯 Actualizando usuario ID:", newUserFromServer.id);
          await api.put(`/updateUser/${newUserFromServer.id}/`, {
            role: newUser.role
          });
          console.log("✅ Rol actualizado correctamente");
        } else {
          console.warn("⚠️ No se pudo encontrar el usuario recién creado para actualizar el rol");
        }
      }

      Alert.alert(
        '✅ Éxito',
        `Usuario creado correctamente ${newUser.role !== 'usuario' ? 'con rol ' + newUser.role : ''}`,
        [{
          text: 'OK', onPress: () => {
            setCreateModalVisible(false);
            fetchUsers();
          }
        }]
      );

      // Resetear formulario
      setNewUser({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'usuario'
      });
      setConfirmPassword('');

    } catch (error: any) {
      console.error("❌ Error creando usuario:", {
        message: error.message,
        response: error.response?.data,
        code: error.code
      });

      let errorMessage = "Error en el servidor";
      if (error.message.includes("Network Error")) {
        errorMessage = "No se pudo conectar al servidor. Verifica tu conexión.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.username) {
        errorMessage = `Username: ${error.response.data.username[0]}`;
      } else if (error.response?.data?.email) {
        errorMessage = `Email: ${error.response.data.email[0]}`;
      } else if (error.response?.data?.password) {
        errorMessage = `Contraseña: ${error.response.data.password[0]}`;
      }

      Alert.alert('❌ Error', errorMessage);
    } finally {
      setCreateLoading(false);
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "user_role",
        "user_id",
      ]);
      router.replace('/login');
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleEditUser(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userType}>Nombre: {item.first_name} {item.last_name}</Text>
        <Text style={styles.userType}>Correo: {item.email}</Text>
        <Text style={[styles.userType, { color: getRoleColor(item.role) }]}>
          Rol: {item.role}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => confirmDelete(item)}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#FFD700';
      case 'staff': return '#1E90FF';
      default: return '#BDBDBD';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Panel de Administrador</Text>
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
                router.push('/admin/researcher');
              }}
              style={styles.menuButton}
            >
              <Text style={styles.menuItem}>Modo Investigador</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push('/admin/galeria');
              }}
              style={styles.menuButton}
            >
              <Text style={styles.menuItem}>Galería de Imágenes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
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

      {/* Botón para agregar nuevo usuario */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Plus size={20} color="white" />
        <Text style={styles.addButtonText}>Agregar Usuario</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay usuarios registrados</Text>
            </View>
          }
          refreshing={loading}
          onRefresh={fetchUsers}
        />
      )}

      {/* Modal para cambiar rol */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Modificar Usuario: {selectedUser?.username}
            </Text>

            <Text style={styles.modalSubtitle}>Cambiar Rol:</Text>
            <Picker
              selectedValue={newRole}
              onValueChange={(itemValue) => setNewRole(itemValue)}
              style={styles.picker}
              dropdownIconColor="#006400"
            >
              <Picker.Item label="Administrador" value="admin" />
              <Picker.Item label="Staff" value="staff" />
              <Picker.Item label="Usuario" value="usuario" />
            </Picker>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButtonModal]}
                onPress={() => confirmDelete(selectedUser)}
              >
                <Trash2 size={18} color="white" />
                <Text style={styles.modalButtonText}>Eliminar Usuario</Text>
              </TouchableOpacity>

              <View style={styles.modalActionButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleChangeRole}
                >
                  <Text style={styles.modalButtonText}>Actualizar Rol</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
            <Text style={styles.deleteText}>
              ¿Estás seguro de que quieres eliminar al usuario {'"'}
              {selectedUser?.username}
              {'"'}? Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteUser}
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para crear usuario*/}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: '90%', width: '90%' }]}>
            <Text style={styles.modalTitle}>Crear Nuevo Usuario</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre de usuario *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el username"
                value={newUser.username}
                onChangeText={(text) => setNewUser({ ...newUser, username: text })}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Correo electrónico *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el email"
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa la contraseña"
                value={newUser.password}
                onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirmar contraseña *</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirma la contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el nombre"
                value={newUser.first_name}
                onChangeText={(text) => setNewUser({ ...newUser, first_name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el apellido"
                value={newUser.last_name}
                onChangeText={(text) => setNewUser({ ...newUser, last_name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rol</Text>
              <Picker
                selectedValue={newUser.role || 'usuario'} // Forzar valor por defecto
                onValueChange={(itemValue) => setNewUser({ ...newUser, role: itemValue })}
                style={styles.picker}
                dropdownIconColor="#006400"
              >
                <Picker.Item label="Usuario" value="usuario" />
                <Picker.Item label="Staff" value="staff" />
                <Picker.Item label="Administrador" value="admin" />
              </Picker>
            </View>

            <View style={styles.modalActionButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setCreateModalVisible(false);
                  setNewUser({
                    username: '',
                    email: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    role: 'usuario'
                  });
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton, createLoading && styles.disabledButton]}
                onPress={handleCreateUser}
                disabled={createLoading}
              >
                {createLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalButtonText}>Crear Usuario</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.requiredNote}>* Campos obligatorios</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}