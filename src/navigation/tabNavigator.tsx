import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'
import { Home } from '../screens/home'
import { Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { color } from 'react-native-reanimated'
import Images from '../utils/images'

const Tab = createMaterialBottomTabNavigator()

export const TabNavigator = () => {

    const theme = useTheme()

    return (
        <Tab.Navigator
            initialRouteName="Home"
            backBehavior="initialRoute"
            shifting={true}
            labeled={false}
            activeColor={theme.colors.primary}
            inactiveColor='#fff'
            barStyle={{ backgroundColor: '#2F3437' }}
            sceneAnimationEnabled={false}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabHome} style={{ tintColor: color }} />
                    ),
                }} />
            <Tab.Screen
                name="Search"
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabSearch} style={{ tintColor: color }} />
                    ),
                }} />
            <Tab.Screen
                name="Add"
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabAdd} style={{ tintColor: color }} />
                    ),
                }} />
            <Tab.Screen
                name="Notifications"
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabNotification} style={{ tintColor: color }} />
                    ),
                }} />
        </Tab.Navigator>
    )
}
