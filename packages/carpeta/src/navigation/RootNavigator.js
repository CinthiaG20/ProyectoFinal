import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../auth/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import TournamentsScreen from '../screens/TournamentsScreen';
import TournamentScreen from '../screens/TournamentScreen';
import MyGamblesScreen from '../screens/MyGamblesScreen';
import InvitationsScreen from '../screens/InvitationsScreen';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#020617' },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';
          if (route.name === 'Torneos') iconName = 'trophy-outline';
          else if (route.name === 'MisPronosticos') iconName = 'list-outline';
          else if (route.name === 'Invitaciones') iconName = 'mail-unread-outline';
          return <Ionicons name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Torneos" component={TournamentsScreen} />
      <Tab.Screen
        name="MisPronosticos"
        component={MyGamblesScreen}
        options={{ title: 'Mis pronósticos' }}
      />
      <Tab.Screen
        name="Invitaciones"
        component={InvitationsScreen}
        options={{ title: 'Invitaciones' }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#020617' },
          headerTintColor: '#e5e7eb',
        }}
      >
        {!token ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={AppTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Tournament"
              component={TournamentScreen}
              options={{ title: 'Partidos' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}