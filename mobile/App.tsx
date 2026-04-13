import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import ChartScreen from './src/screens/ChartScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import { useColorScheme } from 'react-native';

const Tab = createBottomTabNavigator();

const PremiumDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#D4AF37', // Gold
    background: '#0a0a0a',
    card: '#1a1a1a',
    text: '#ffffff',
    border: '#333333',
    notification: '#ff453a',
  },
};

export default function App() {
  const scheme = useColorScheme();
  
  return (
    <NavigationContainer theme={scheme === 'dark' ? PremiumDarkTheme : PremiumDarkTheme}>
      <Tab.Navigator
        screenOptions={{ 
          headerStyle: { backgroundColor: '#1a1a1a', shadowColor: 'transparent', elevation: 0 },
          headerTitleStyle: { color: '#D4AF37', fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#1a1a1a', borderTopColor: '#333' },
          tabBarActiveTintColor: '#D4AF37',
          tabBarInactiveTintColor: '#888'
        }}
      >
        <Tab.Screen name="Live Prices" component={HomeScreen} />
        <Tab.Screen name="History" component={ChartScreen} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
