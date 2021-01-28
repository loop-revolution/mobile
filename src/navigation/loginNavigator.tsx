import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'

import routes from './routes'
import { Login } from '../screens/login'

const Stack = createStackNavigator()

export const LoginNavigator = () => {
    const theme = useTheme()

    return (
        <Stack.Navigator
            initialRouteName={routes.LOGIN}
            headerMode="screen" >
            <Stack.Screen
                name={routes.LOGIN}
                component={Login}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Login'
                    return { headerTitle: routeName }
                }} />
        </Stack.Navigator>
    )
}
