import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'
import { Home } from '../screens/home'
import { Create } from '../screens/create'
import { Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { color } from 'react-native-reanimated'
import Images from '../utils/images'
import route from 'color-convert/route'
import routes from './routes'
import { CreateBlock } from '../screens/createBlock'
import { CreateBlockNavigator } from './createBlockNavigator'

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
                component={CreateBlockNavigator}
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
