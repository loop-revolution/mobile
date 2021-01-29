import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { useTheme } from 'react-native-paper'

import routes from './routes'
import { Login } from '../screens/auth/login'
import { Signup } from '../screens/auth/signup'
import { VerifyEmail } from '../screens/auth/verifyEmail'

const Stack = createStackNavigator()

export const LoginNavigator = () => {
    const theme = useTheme()

    return (
        <Stack.Navigator initialRouteName={routes.LOGIN}>
            <Stack.Screen
                name={routes.LOGIN}
                component={Login}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Login'
                    return { headerTitle: routeName }
                }} />
            <Stack.Screen
                name={routes.SIGNUP}
                component={Signup}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Signup'
                    return { headerTitle: routeName }
                }} />
            <Stack.Screen
                name={routes.VERIFY_EMAIL}
                component={VerifyEmail}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Verify Email'
                    return { headerTitle: routeName }
                }} />
        </Stack.Navigator>
    )
}
