import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';

const LeaderboardStack = createNativeStackNavigator();

const LeaderboardStackNavigator = () => {
    return (
        <LeaderboardStack.Navigator>
            <LeaderboardStack.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{
                    headerShown: false
                }}
            />
        </LeaderboardStack.Navigator>
    );
};

export default LeaderboardStackNavigator;
