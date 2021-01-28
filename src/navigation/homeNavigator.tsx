import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import routes from './routes'
import { Home } from '../screens/home'

const Stack = createStackNavigator()

export const HomeNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName={routes.HOME}
            headerMode="screen" >
            <Stack.Screen
                name={routes.HOME}
                component={Home}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home'
                    return { headerTitle: routeName }
                }}
            />
        </Stack.Navigator>
    )
}
