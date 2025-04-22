import AsyncStorage from '@react-native-async-storage/async-storage';
import { Material } from '../data/materials';

// 🌐 Ссылка на твой RAW materials.json в GitHub
const REMOTE_URL = 'https://raw.githubusercontent.com/YekutielKa/770-content/main/materials.json';

/**
 * Загружает материалы с GitHub и сохраняет в AsyncStorage
 */
export const fetchAndStoreMaterials = async (): Promise<Material[]> => {
  try {
    const response = await fetch(REMOTE_URL);
    if (!response.ok) throw new Error('Ошибка загрузки');
    const data: Material[] = await response.json();
    await AsyncStorage.setItem('materials', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Ошибка при fetchAndStoreMaterials:', error);
    throw error;
  }
};

/**
 * Загружает сохранённые материалы из AsyncStorage
 */
export const loadStoredMaterials = async (): Promise<Material[]> => {
  try {
    const json = await AsyncStorage.getItem('materials');
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (error) {
    console.warn('Ошибка при loadStoredMaterials:', error);
    return [];
  }
};
