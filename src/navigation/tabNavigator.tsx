import React, { useContext } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'
import { Create } from '../screens/create'
import { Image } from 'react-native'
import Images from '../utils/images'
import { Search } from '../screens/search/search'
import { BlockPage } from '../screens/blockPage'
import { GlobalNotifications } from '../screens/globalNotifications'

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
                component={BlockPage}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabHome} style={{ tintColor: color }} />
                    ),
                }} />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabSearch} style={{ tintColor: color }} />
                    ),
                }} />
            <Tab.Screen
                name="Create"
                component={Create}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabAdd} style={{ tintColor: color }} />
                    )
                }} />
            <Tab.Screen
                name="Notifications"
                component={GlobalNotifications}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Image source={Images.tabNotification} style={{ tintColor: color }} />
                    ),
                }} />
        </Tab.Navigator>
    )
}
