import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // ===== ESTILOS GENERALES =====
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },

  // ===== HEADER Y NAVEGACIÓN =====
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    backgroundColor: '#006400',
    paddingTop: Platform.OS === 'android' ? 40 : 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
  },
  userNameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // ===== MENÚ Y OVERLAYS =====
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'android' ? 70 : 60,
    paddingRight: 10,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
    minWidth: 180,
  },
  menuButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuItem: {
    fontSize: 16,
    color: '#004d00',
  },

  // ===== FORMULARIOS Y INPUTS =====
  formContainer: {
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#FFFFF0',
    padding: 22,
    borderRadius: 14,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    color: '#8B7765',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    color: '#4d4d4d',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    color: '#4d4d4d',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 100,
    textAlignVertical: 'top',
  },

  // ===== SELECT/PICKER ESTILOS =====
  pickerContainer: {
    marginBottom: 18,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    color: '#333',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  pickerItem: {
    fontSize: 16,
    color: '#333',
  },
  selectContainer: {
    marginBottom: 18,
    marginTop: 4,
  },
  selectLabel: {
    fontSize: 16,
    color: '#8B7765',
    marginBottom: 8,
    fontWeight: '500',
  },
  select: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },

  // ===== BOTONES =====
  button: {
    backgroundColor: '#006400',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
    minHeight: 50,
  },
  analyzeButton: {
    backgroundColor: '#1E88E5',
    marginTop: 15,
  },
  correctButton: {
    backgroundColor: '#3498db',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#27ae60',
    marginTop: 18,
    alignSelf: 'center',
    minWidth: 200,
  },
  cancelButton: {
    backgroundColor: '#8B0000',
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#006400',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 15,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },

  // ===== CÁMARA Y BOTONES DE CÁMARA =====
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 140,
  },
  cameraButtonDisabled: {
    backgroundColor: '#b2bec3',
    opacity: 0.7,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // ===== IMÁGENES Y SELECCIÓN =====
  imageContainer: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  touchableImageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  selectionBox: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
  },
  selectionText: {
    color: 'white',
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    padding: 2,
    fontSize: 12,
  },

  // ===== RESULTADOS Y ANÁLISIS =====
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultItem: {
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  resultValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 3,
  },
  resultadoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resultadoImagen: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  resultadoBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  resultadoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006400',
    marginBottom: 6,
  },
  resultadoTexto: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },

  // ===== GALERÍA DE IMÁGENES =====
  galleryContainer: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 10,
  },
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006400',
    textAlign: 'center',
    marginVertical: 20,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  galleryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
    width: (width - 40) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  galleryImage: {
    width: (width - 80) / 2,
    height: (width - 80) / 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  galleryImageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006400',
    textAlign: 'center',
    marginBottom: 4,
  },
  galleryImageDate: {
    fontSize: 12,
    color: '#8B7765',
    textAlign: 'center',
  },
  galleryImageType: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
  },
  galleryActionButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  galleryActionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 6,
    marginTop: 5,
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // ===== MODALES =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    padding: 20,
  },
  modalContentCentered: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalPicker: {
    width: '100%',
    marginBottom: 30,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  // ===== MODAL DE IMAGEN AMPLIADA =====
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContainer: {
    width: '95%',
    height: '80%',
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  enlargedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1000,
  },
  imageInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  imageInfoText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  imageInfoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  // ===== FILTROS Y BÚSQUEDA =====
  filterContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFF0',
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: '#006400',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  filterPicker: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFF0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  searchButton: {
    backgroundColor: '#006400',
    padding: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ===== USUARIOS Y LISTAS =====
  userItem: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#66BB6A',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    marginBottom: 2,
  },
  listContainer: {
    flexGrow: 1,
    padding: 20,
  },

  // ===== ESTADOS DE CARGA Y VACÍO =====
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#006400',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyGalleryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyGalleryText: {
    fontSize: 18,
    color: '#8B7765',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyGallerySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  galleryLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  galleryLoadingText: {
    fontSize: 16,
    color: '#006400',
    marginTop: 10,
  },

  // ===== HOME ESPECÍFICO =====
  homeScrollContainer: {
    padding: 20,
  },
  instructionsContainer: {
    backgroundColor: '#FFFFF0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionsTitle: {
    color: '#006400',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    color: '#8B7765',
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionsContainer: {
    backgroundColor: '#FFFFF0',
    padding: 20,
    borderRadius: 10,
  },
  quickActionsTitle: {
    color: '#006400',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  quickActionText: {
    color: '#006400',
    fontSize: 16,
    fontWeight: '500',
  },

  // ===== ICONOS Y TOOLTIPS =====
  iconButtonGreen: {
    backgroundColor: '#27ae60',
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  tooltipBox: {
    position: 'absolute',
    top: 54,
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    zIndex: 10,
    alignSelf: 'center',
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },

  // ===== PAGINACIÓN =====
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFF0',
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  paginationButton: {
    backgroundColor: '#006400',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  paginationButtonDisabled: {
    backgroundColor: '#CCC',
  },
  paginationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paginationInfo: {
    fontSize: 14,
    color: '#8B7765',
    marginHorizontal: 15,
  },

  // ===== BADGES Y ESTADOS =====
  statusBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 100, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // ===== CONFIRMACIÓN MODAL =====
  confirmModalContent: {
    backgroundColor: '#FFFFF0',
    padding: 25,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  confirmButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },

  // ===== CONTENEDORES ADICIONALES =====
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006400',
    marginVertical: 15,
    marginHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
});

export default styles;