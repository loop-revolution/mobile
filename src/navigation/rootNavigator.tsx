import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { DefaultTheme, DarkTheme } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'
import { Login } from '../screens/login'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DrawerNavigator } from './drawerNavigator'
import routes from './routes'

const Stack = createStackNavigator()

export const RootNavigator = () => {
    const theme = useTheme()
    const navigationTheme = theme.dark ? DarkTheme : DefaultTheme
    const token = AsyncStorage.getItem('token')
    const initialRouteName = !token ? routes.HOME : routes.LOGIN

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen
                    name={routes.HOME}
                    component={DrawerNavigator} />
                <Stack.Screen
                    name={routes.LOGIN}
                    component={Login} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
