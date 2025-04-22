import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootTabParamList } from '../navigation/Tabs';
import { Material } from '../data/materials';
import { useFavorites } from '../context/FavoritesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';

type ReaderRouteProp = RouteProp<RootTabParamList, 'Reader'>;

export default function ReaderScreen() {
  const route = useRoute<ReaderRouteProp>();
  const { id } = route.params;

  const { isFavorite, toggleFavorite } = useFavorites();
  const scrollViewRef = useRef<ScrollView>(null);
  const [initialScroll, setInitialScroll] = useState(0);
  const [material, setMaterial] = useState<Material | null>(null);

  // Загрузка одного материала по id из AsyncStorage
  useEffect(() => {
    const loadMaterial = async () => {
      try {
        const json = await AsyncStorage.getItem('materials');
        if (json) {
          const all: Material[] = JSON.parse(json);
          const found = all.find((m) => m.id === id);
          setMaterial(found || null);
        }
      } catch (e) {
        console.warn('Ошибка загрузки материала:', e);
      }
    };
    loadMaterial();
  }, [id]);

  // Загрузка прогресса чтения
  useEffect(() => {
    AsyncStorage.getItem(`progress_${id}`).then((val) => {
      if (val) setInitialScroll(Number(val));
    });
  }, [id]);

  // Автопрокрутка после загрузки
  useEffect(() => {
    if (initialScroll > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: initialScroll, animated: false });
      }, 100);
    }
  }, [initialScroll]);

  // Сохранение scroll-позиции
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    AsyncStorage.setItem(`progress_${id}`, String(y));
  };

  // Печать / экспорт в PDF
  const handlePrint = async () => {
    if (!material) return;

    const htmlContent = material.content.replace(/\n/g, '<br/>');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { font-size: 24px; }
            p { font-size: 16px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <h1>${material.title}</h1>
          <p>${htmlContent}</p>
        </body>
      </html>
    `;

    await Print.printAsync({ html });
  };

  if (!material) {
    return (
      <View style={styles.container}>
        <Text>⏳ Загрузка материала...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={100}
      ref={scrollViewRef}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{material.title}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(material.id)}>
          <Text style={styles.favorite}>
            {isFavorite(material.id) ? '❌ Удалить' : '⭐ В избранное'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handlePrint}>
        <Text style={styles.print}>🖨️ Печать</Text>
      </TouchableOpacity>

      <Text style={styles.content}>{material.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  favorite: {
    fontSize: 14,
    color: '#007aff',
    paddingLeft: 10,
  },
  print: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
