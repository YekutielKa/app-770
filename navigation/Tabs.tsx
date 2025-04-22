import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ReaderScreen from '../screens/ReaderScreen';

export type RootTabParamList = {
  Home: undefined;
  Reader: { id: number }; // при переходе будем передавать ID материала
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reader" component={ReaderScreen} />
    </Tab.Navigator>
  );
}
