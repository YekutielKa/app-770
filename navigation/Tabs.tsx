import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ReaderScreen from "../screens/ReaderScreen";
import { Ionicons } from "@expo/vector-icons"; 

export type RootTabParamList = {
  Home: undefined;
  Reader: { id: number };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#0e1a2b",
          borderTopColor: "transparent",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#6cb4ff",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reader") {
            iconName = focused ? "book" : "book-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Главная" }} />

      <Tab.Screen
        name="Reader"
        component={ReaderScreen}
        options={{ title: "Чтение" }}
        initialParams={{ id: 1 }} // <-- добавляем начальные параметры
      />
    </Tab.Navigator>
  );
}
