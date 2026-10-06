// ---------------------------------------------------------------------------
// App.js — entry point. Wires up data, navigation and screens.
//
// Navigation layout:
//   Stack
//   ├── Tabs (Home | History | Profile)   <- main app
//   └── NewCollection (modal)             <- opened from Home
// ---------------------------------------------------------------------------

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { DataProvider } from './src/DataContext';
import { colors } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NewCollectionScreen from './src/screens/NewCollectionScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Icon + label for each bottom tab. Add a tab here to add a screen.
const TAB_ICONS = { Home: 'home', History: 'list', Profile: 'person' };

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="NewCollection"
            component={NewCollectionScreen}
            options={{ title: 'New collection', presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}