import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Material } from "../data/materials";
import MaterialCard from "../components/MaterialCard";

const { width } = Dimensions.get("window");

const localImages: { [key: string]: any } = {
  "cover-22-28-nisan": require("../assets/images/cover-22-28-nisan.jpg"),
  "cover-15-21-nisan": require("../assets/images/cover-15-21-nisan.jpg"),
};

const data: Material[] = [
  {
    id: 1,
    title: "Беседа Ребе — Песах 5711",
    date: "20 апреля 2025",
    image: "local/cover-22-28-nisan",
  },
  {
    id: 2,
    title: "Беседа Ребе — Песах 5711 (копия)",
    date: "20 апреля 2025",
    image: "local/cover-15-21-nisan",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [lastReadId, setLastReadId] = useState<number>(1); // По умолчанию первая книга

  const handleReadPress = () => {
    navigation.navigate('Reader', { id: lastReadId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>770</Text>
      </View>

      <Text style={styles.subheading}>Мобильная библиотека</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MaterialCard
            item={item}
            onPress={() => {
              setLastReadId(item.id); // обновляем последнее прочитанное
              navigation.navigate('Reader', { id: item.id });
            }}
            localImages={localImages}
          />
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1a2b",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    paddingBottom: 100, // Оставляем место под кнопку "Читать"
  },
  readButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#6cb4ff",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  readButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
