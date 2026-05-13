import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import TodayScreen from './screens/TodayScreen';
import HabitsScreen from './screens/HabitsScreen';
import SleepScreen from './screens/SleepScreen';
import JournalScreen from './screens/JournalScreen';
import CalendarScreen from './screens/CalendarScreen';
import StatsScreen from './screens/StatsScreen';

import { COLORS } from './components/theme';
import { getDatabase } from './db/database';
import { getSettings } from './db/settingsQueries';
import {
  requestNotificationPermissions,
  scheduleAllNotifications,
} from './notifications/notificationService';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Hoy: ['today', 'today-outline'],
  Hábitos: ['checkmark-circle', 'checkmark-circle-outline'],
  Sueño: ['moon', 'moon-outline'],
  Diario: ['journal', 'journal-outline'],
  Calendario: ['calendar', 'calendar-outline'],
  Stats: ['bar-chart', 'bar-chart-outline'],
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name] || ['ellipse', 'ellipse-outline'];
          return (
            <Ionicons name={focused ? icons[0] : icons[1]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Hoy" component={TodayScreen} />
      <Tab.Screen name="Hábitos" component={HabitsScreen} />
      <Tab.Screen name="Sueño" component={SleepScreen} />
      <Tab.Screen name="Diario" component={JournalScreen} />
      <Tab.Screen name="Calendario" component={CalendarScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    async function init() {
      try {
        await getDatabase();
        const granted = await requestNotificationPermissions();
        if (granted) {
          const settings = await getSettings();
          await scheduleAllNotifications(settings);
        }
      } catch (e) {
        console.warn('Init error:', e);
      }
    }
    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: COLORS.accent,
              background: COLORS.background,
              card: COLORS.surface,
              text: COLORS.text,
              border: COLORS.border,
              notification: COLORS.accent,
            },
          }}
        >
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
