import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MyBlogScreen from '../screens/blog/MyBlogScreen';

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
  </ProfileDrawer.Navigator>
);

export default ProfileDrawerNavigator; 