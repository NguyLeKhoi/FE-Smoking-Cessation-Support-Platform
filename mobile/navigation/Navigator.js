import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screen/HomeScreen';
import ProfileScreen from '../screen/ProfileScreen';
import LoginScreen from '../screen/LoginScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
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
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
      }}
    >
      <Drawer.Screen 
        name="TabNavigator" 
        component={TabNavigator}
        options={{
          title: 'Main Menu',
          drawerLabel: 'Main Menu',
        }}
      />
    </Drawer.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
