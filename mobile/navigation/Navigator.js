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
import MyBlogScreen from '../screens/blog/MyBlogScreen';

// Add new screens
import SmokingQuizScreen from '../screens/quiz/SmokingQuizScreen';
import QuitPlanListScreen from '../screens/quit-plan/QuitPlanListScreen';
import QuitPlanDetailScreen from '../screens/quit-plan/QuitPlanDetailScreen';
import PhaseRecordScreen from '../screens/quit-plan/PhaseRecordScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder screens
const MyPostsScreen = () => null;
const AchievementsScreen = () => null;

// Custom Drawer Content with additional menu items
const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
    
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

const ProfileDrawer = createDrawerNavigator();
const ProfileDrawerNavigator = () => (
  <ProfileDrawer.Navigator
    initialRouteName="ProfileInfo"
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerPosition: 'left',
      drawerType: 'front',
      drawerStyle: { width: 220 },
      headerShown: false, // Ẩn header của drawer bên trong
      swipeEdgeWidth: 40,
    }}
  >
    <ProfileDrawer.Screen name="ProfileInfo" component={ProfileScreen} options={{ title: 'Personal Information' }} />
    <ProfileDrawer.Screen name="MyBlog" component={MyBlogScreen} options={{ title: 'Bài viết của tôi' }} />
    <ProfileDrawer.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Achievements' }} />
  </ProfileDrawer.Navigator>
);

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

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="TabNavigator"
      drawerContent={props => <CustomDrawerContent {...props} />}
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
        <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
        <Stack.Screen name="CreateBlog" component={CreateBlogScreen} />
        <Stack.Screen name="EditBlog" component={EditBlogScreen} />
        <Stack.Screen name="MembershipPlans" component={MembershipPlansScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        
        {/* Add new screens */}
        <Stack.Screen name="SmokingQuiz" component={SmokingQuizScreen} />
        <Stack.Screen name="QuitPlanList" component={QuitPlanListScreen} />
        <Stack.Screen name="QuitPlanDetail" component={QuitPlanDetailScreen} />
        <Stack.Screen name="PhaseRecord" component={PhaseRecordScreen} />
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
  drawerIcon: {
    marginRight: 12,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#3f332b',
    fontWeight: '500',
  },
});

export default Navigator;
