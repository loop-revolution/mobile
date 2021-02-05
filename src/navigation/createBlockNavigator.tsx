import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native'
import { Appbar } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import routes from './routes'
import { Login } from '../screens/auth/login'
import { Signup } from '../screens/auth/signup'
import { VerifyEmail } from '../screens/auth/verifyEmail'
import { Create } from '../screens/create'
import { CreateBlock } from '../screens/createBlock'

const Stack = createStackNavigator()

export const CreateBlockNavigator = () => {
    const theme = useTheme()

    return (
        <Stack.Navigator
            initialRouteName={routes.CREATE}
            headerMode="none">
            <Stack.Screen
                name={routes.CREATE}
                component={Create}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Create'
                    return { headerTitle: routeName }
                }} />
            <Stack.Screen
                name={routes.CREATE_BLOCK}
                component={CreateBlock}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Create Block'
                    return { headerTitle: routeName }
                }} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    navBarTitle: {
        fontSize: 18,
        fontWeight: '500',
    }
})
