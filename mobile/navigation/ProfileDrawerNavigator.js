import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MyBlogScreen from '../screens/blog/MyBlogScreen';
import SmokingHabitManagementScreen from '../screens/profile/SmokingHabitManagementScreen';
import AchievementsScreen from '../screens/achievements/AchievementsScreen';

const ProfileDrawer = createDrawerNavigator();

const ProfileDrawerNavigator = () => (
  <ProfileDrawer.Navigator
    initialRouteName="ProfileInfo"
    screenOptions={{
      drawerPosition: 'left',
      drawerType: 'slide',
      drawerStyle: { width: 240 },
      headerShown: false, // Hide header of profile drawer
    }}
  >
    <ProfileDrawer.Screen name="ProfileInfo" component={ProfileScreen} options={{ title: 'Personal Information' }} />
    <ProfileDrawer.Screen name="MyPosts" component={MyBlogScreen} options={{ title: 'My posts' }} />
    <ProfileDrawer.Screen 
      name="SmokingHabit" 
      component={SmokingHabitManagementScreen} 
      options={{ title: 'Smoking Habit' }} 
    />
    <ProfileDrawer.Screen 
      name="Achievements" 
      component={AchievementsScreen} 
      options={{ title: 'Achievements' }} 
    />
  </ProfileDrawer.Navigator>
);

export default ProfileDrawerNavigator; 