import AsyncStorage from '@react-native-async-storage/async-storage';
import { Material } from '../data/materials';

// ✅ Твоя GitHub-ссылка на RAW JSON
const REMOTE_URL = 'https://raw.githubusercontent.com/YekutielKa/770-content/main/materials.json';

/**
 * Загружает материалы с GitHub и сохраняет в AsyncStorage
 */
export const fetchAndStoreMaterials = async (): Promise<Material[]> => {
  try {
    const response = await fetch(REMOTE_URL);
    const data: Material[] = await response.json();
    await AsyncStorage.setItem('materials', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Ошибка загрузки материалов:', error);
    throw error;
  }
};

/**
 * Загружает материалы из AsyncStorage (если оффлайн)
 */
export const loadStoredMaterials = async (): Promise<Material[]> => {
  const data = await AsyncStorage.getItem('materials');
  return data ? JSON.parse(data) : [];
};
