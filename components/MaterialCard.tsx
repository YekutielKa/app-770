import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Material } from "../data/materials";

interface MaterialCardProps {
  item: Material;
  onPress: () => void;
  localImages: { [key: string]: any };
}

const MaterialCard = ({ item, onPress, localImages }: MaterialCardProps) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleLongPress = () => {
    rotation.value = withSpring(5, { damping: 5, stiffness: 100 });
    setTimeout(() => {
      rotation.value = withSpring(-5, { damping: 5, stiffness: 100 });
      setTimeout(() => {
        rotation.value = withSpring(0, { damping: 5, stiffness: 100 });
      }, 150);
    }, 150);
  };

  return (
    <Animated.View entering={FadeInUp.springify()}>
      <Animated.View style={animatedCardStyle}>
        <TouchableOpacity
          style={styles.card}
          onPress={onPress}
          onLongPress={handleLongPress}
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
              {item.date && <Text style={styles.cardDate}>{item.date}</Text>}
              <Text style={styles.more}>▶ Подробнее</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default MaterialCard;

const styles = StyleSheet.create({
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
    width: 100,
    height: 140,
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
