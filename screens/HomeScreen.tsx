import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Material } from '../data/materials';
import { fetchAndStoreMaterials, loadStoredMaterials } from '../utils/loadMaterials';

export default function HomeScreen() {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const load = async () => {
      try {
        const loaded = await fetchAndStoreMaterials();
        setData(loaded);
      } catch {
        const fallback = await loadStoredMaterials();
        setData(fallback);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Список материалов</Text>
      {loading ? (
        <Text>⏳ Загрузка...</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('Reader' as never, { id: item.id } as never)}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 6,
  },
  itemTitle: {
    fontSize: 16,
  },
});
