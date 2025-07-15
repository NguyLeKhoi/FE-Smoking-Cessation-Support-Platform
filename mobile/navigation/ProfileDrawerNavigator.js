import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/profile/ProfileScreen';
// Placeholder screens, bạn sẽ thay bằng màn hình thực tế sau
const MyPostsScreen = () => null;
const AchievementsScreen = () => null;

const ProfileDrawer = createDrawerNavigator();

const ProfileDrawerNavigator = () => (
  <ProfileDrawer.Navigator
    initialRouteName="ProfileInfo"
    screenOptions={{
      drawerPosition: 'left',
      drawerType: 'slide',
      drawerStyle: { width: 240 },
      headerShown: true,
    }}
  >
    <ProfileDrawer.Screen name="ProfileInfo" component={ProfileScreen} options={{ title: 'Personal Information' }} />
    <ProfileDrawer.Screen name="MyPosts" component={MyPostsScreen} options={{ title: 'My posts' }} />
    <ProfileDrawer.Screen name="Achievements" component={AchievementsScreen} options={{ title: 'Achievements' }} />
  </ProfileDrawer.Navigator>
);

export default ProfileDrawerNavigator; 