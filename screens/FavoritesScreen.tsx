import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigation } from "@react-navigation/native";
import { Material } from "../data/materials";
import { loadStoredMaterials } from "../utils/loadMaterials";
import Animated, { FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const localImages: { [key: string]: any } = {
  "cover-22-28-nisan": require("../assets/images/cover-22-28-nisan.jpg"),
};

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const navigation = useNavigation<any>();
  const [favoriteMaterials, setFavoriteMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const all = await loadStoredMaterials();
      const filtered = all.filter((m) => favorites.includes(m.id));
      setFavoriteMaterials(filtered);
    };
    loadFavorites();
  }, [favorites]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>⭐ Избранное</Text>

      {favoriteMaterials.length === 0 ? (
        <Text style={styles.empty}>Пока нет сохранённых материалов</Text>
      ) : (
        <FlatList
          data={favoriteMaterials}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.delay(index * 100).springify()} // Анимация появления
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("Reader" as never, { id: item.id } as never)
                }
                activeOpacity={0.85}
              >
                <View style={styles.cardContent}>
                  {item.image && (
                    <Image
                      source={
                        item.image.startsWith("local/")
                          ? localImages[item.image.replace("local/", "")]
                          : { uri: item.image }
                      }
                      style={styles.image}
                    />
                  )}
                  <View style={styles.textBlock}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.date && (
                      <Text style={styles.cardDate}>{item.date}</Text>
                    )}
                    <Text style={styles.more}>▶ Подробнее</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: "#aaa",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#1f2e45",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: width * 0.25,
    height: width * 0.35,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  textBlock: {
    flex: 1,
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 13,
    color: "#bbb",
    marginBottom: 8,
  },
  more: {
    fontSize: 14,
    color: "#6cb4ff",
    marginTop: 4,
  },
});
