import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'
import { Login } from '../screens/auth/login'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DrawerNavigator } from './drawerNavigator'
import routes from './routes'
import { DefaultNavigationTheme } from '../utils/theme'

const Stack = createStackNavigator()

export const RootNavigator = () => {
    const theme = useTheme()
    const token = AsyncStorage.getItem('token')
    const initialRouteName = !token ? routes.HOME : routes.LOGIN

    return (
        <NavigationContainer theme={DefaultNavigationTheme}>
            <Stack.Navigator
                initialRouteName={initialRouteName}
                headerMode="none">
                <Stack.Screen
                    name={routes.LOGIN}
                    component={Login} />
                <Stack.Screen
                    name={routes.HOME}
                    component={DrawerNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
