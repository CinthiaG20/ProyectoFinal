import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MyGamblesScreen from '../screens/MyGamblesScreen'; 
import TournamentsScreen from '../screens/TournamentsScreen';
import InvitationsScreen from '../screens/InvitationsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#020617' },
          headerTintColor: '#e5e7eb',
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MyGamblesScreen"  
          component={MyGamblesScreen}
          options={{ title: 'Mis Pronósticos' }}
        />
        <Stack.Screen 
          name="TournamentsScreen"  
          component={TournamentsScreen}
          options={{ title: 'Mis torneos' }}
        />
        <Stack.Screen 
          name="InvitationScreen"  
          component={InvitationsScreen}
          options={{ title: 'Mis invitaciones' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}