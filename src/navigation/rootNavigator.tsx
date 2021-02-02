import React, { useContext, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DrawerNavigator } from './drawerNavigator'
import routes from './routes'
import { DefaultNavigationTheme } from '../utils/theme'
import { LoginNavigator } from './loginNavigator'
import { View } from 'react-native'
import { UserContext } from '../context/userContext'

const Stack = createStackNavigator()

export const RootNavigator = () => {
    const [isLoggedIn, setLoggedIn] = useState(null)
    const { setUserLoggedIn } = useContext(UserContext)

    AsyncStorage.getItem('token')
        .then((value) => {
            setLoggedIn(value !== null)
            setUserLoggedIn(value !== null)
        })

    if(isLoggedIn === null) {
        return <View />
    }

    return (
        <NavigationContainer theme={DefaultNavigationTheme}>
            <Stack.Navigator
                initialRouteName={isLoggedIn ? routes.HOME : routes.LOGIN}
                headerMode="none">
                <Stack.Screen
                    name={routes.LOGIN}
                    component={LoginNavigator} />
                <Stack.Screen
                    name={routes.HOME}
                    component={DrawerNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
