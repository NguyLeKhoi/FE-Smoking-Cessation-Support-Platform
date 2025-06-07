import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import BlogScreen from '../screen/BlogScreen';
import ProfileScreen from '../screen/ProfileScreen';
import LoginScreen from '../screen/LoginScreen';
import SignUpScreen from '../screen/SignUpScreen';
import ForgotPasswordScreen from '../screen/ForgotPasswordScreen';
import AiChatbox from '../screen/AiChatbox';
import { isAuthenticated } from '../service/authService';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'BlogTab') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'AiChatboxTab') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.6)',
        tabBarStyle: { backgroundColor: '#ffffff', borderTopWidth: 0, elevation: 0 },
        tabBarLabelStyle: { textAlign: 'center' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="BlogTab" component={BlogScreen} options={{ title: 'Blog' }} />
      <Tab.Screen name="AiChatboxTab" component={AiChatbox} options={{ title: 'AI Coach' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNavigator"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#000000',
        },
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 240,
        },
        drawerInactiveTintColor: 'rgba(0, 0, 0, 0.6)',
        drawerActiveTintColor: '#000000',
        drawerLabelStyle: {
          color: '#000000',
        },
      }}
    >
      <Drawer.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          title: 'Zerotine',
          drawerLabel: 'Blog',
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const authenticated = await isAuthenticated();
      setIsUserAuthenticated(authenticated);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setIsUserAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isUserAuthenticated ? "MainApp" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
