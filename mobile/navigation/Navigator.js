import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import BlogScreen from '../screens/blog/BlogScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AiChatbox from '../screens/chat/AiChatbox';
import { isAuthenticated } from '../service/authService';
import BlogDetailScreen from '../screens/blog/BlogDetailScreen';
import CreateBlogScreen from '../screens/blog/CreateBlogScreen';
import EditBlogScreen from '../screens/blog/EditBlogScreen';
import MembershipPlansScreen from '../screens/membership/MembershipPlansScreen';
import SubscriptionScreen from '../screens/membership/SubscriptionScreen';
import PaymentSuccessScreen from '../screens/membership/PaymentSuccessScreen';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';


// Add new screens
import SmokingQuizScreen from '../screens/quiz/SmokingQuizScreen';
import QuitPlanListScreen from '../screens/quit-plan/QuitPlanListScreen';
import QuitPlanDetailScreen from '../screens/quit-plan/QuitPlanDetailScreen';
import PhaseRecordScreen from '../screens/quit-plan/PhaseRecordScreen';
import ProfileDrawerNavigator from '../navigation/ProfileDrawerNavigator';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



// Custom Drawer Content with additional menu items
const CustomDrawerContent = (props) => {
  const currentRoute = props.state?.routes[props.state.index];
  const isBlogActive = currentRoute?.name === 'TabNavigator';
  
  return (
  <DrawerContentScrollView {...props}>
      {/* Custom Blog item with icon */}
      <TouchableOpacity
        style={[
          styles.drawerItem,
          isBlogActive && styles.drawerItemActive
        ]}
        onPress={() => {
          props.navigation.navigate('TabNavigator');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons 
          name="newspaper" 
          size={24} 
          color={isBlogActive ? "#000000" : "#3f332b"} 
          style={styles.drawerIcon} 
        />
        <Text style={[
          styles.drawerItemText,
          isBlogActive && styles.drawerItemTextActive
        ]}>Homepage</Text>
      </TouchableOpacity>
    
    {/* Additional menu items */}
    <View style={styles.drawerSection}>
      <Text style={styles.drawerSectionTitle}>Health Tools</Text>
      
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('SmokingQuiz');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="medical" size={24} color="#3f332b" style={styles.drawerIcon} />
        <Text style={styles.drawerItemText}>Smoking Assessment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate('QuitPlanList');
          props.navigation.closeDrawer();
        }}
      >
        <Ionicons name="flag" size={24} color="#3f332b" style={styles.drawerIcon} />
        <Text style={styles.drawerItemText}>Quit Plans</Text>
      </TouchableOpacity>
    </View>
  </DrawerContentScrollView>
);
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNavigator"
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
        headerShown: true, // Bật header
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#000000',
          fontSize: 20,
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
          drawerItemStyle: { display: 'none' }, // Ẩn default drawer item
        }}
      />
    </Drawer.Navigator>
  );
};

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
      <Tab.Screen name="ProfileTab" component={ProfileDrawerNavigator} options={{ title: 'Profile' }} />
    </Tab.Navigator>
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
        <Stack.Screen 
          name="BlogDetail" 
          component={BlogDetailScreen}
          options={{
            headerShown: true,
            title: 'Blog Detail',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="CreateBlog" 
          component={CreateBlogScreen}
          options={{
            headerShown: true,
            title: 'Create Blog',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="EditBlog" 
          component={EditBlogScreen}
          options={{
            headerShown: true,
            title: 'Edit Blog',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="MembershipPlans" 
          component={MembershipPlansScreen}
          options={{
            headerShown: true,
            title: 'Membership Plans',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="Subscription" 
          component={SubscriptionScreen}
          options={{
            headerShown: true,
            title: 'Subscription',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="PaymentSuccess" 
          component={PaymentSuccessScreen}
          options={{
            headerShown: true,
            title: 'Payment Success',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        
        {/* Add new screens */}
        <Stack.Screen 
          name="SmokingQuiz" 
          component={SmokingQuizScreen}
          options={{
            headerShown: true,
            title: 'Smoking Assessment',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="QuitPlanList" 
          component={QuitPlanListScreen}
          options={{
            headerShown: true,
            title: 'Quit Plans',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="QuitPlanDetail" 
          component={QuitPlanDetailScreen}
          options={{
            headerShown: true,
            title: 'Plan Details',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen 
          name="PhaseRecord" 
          component={PhaseRecordScreen}
          options={{
            headerShown: true,
            title: 'Phase Records',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 18,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  drawerSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f332b',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerItemActive: {
    backgroundColor: '#f5f5f5',
  },
  drawerIcon: {
    marginRight: 12,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#3f332b',
    fontWeight: '500',
  },
  drawerItemTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default Navigator;
