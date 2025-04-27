import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./navigation/Tabs"; // твои вкладки Home и Favorites
import ReaderScreen from "./screens/ReaderScreen"; // экран для чтения
import FavoritesProvider from './context/FavoritesContext'; // правильный путь к FavoritesContext


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Tabs">
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Reader"
            component={ReaderScreen}
            options={{ title: "Чтение" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
