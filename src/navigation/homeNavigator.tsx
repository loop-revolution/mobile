import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native'
import routes from './routes'
import { TabNavigator } from './tabNavigator'
import { Appbar } from 'react-native-paper'
import { globalStyles } from '../utils/styles'
import { CreateBlock } from '../screens/createBlock'

const Stack = createStackNavigator()

export const HomeNavigator = ({ navigation }) => {
    const theme = useTheme()

    const openDrawer = () => {
        navigation.openDrawer()
    }

    return (
        <Stack.Navigator
            initialRouteName={routes.HOME}
            headerMode="screen"
            screenOptions={{
                header: ({ scene, previous, navigation }) => {
                    const { options } = scene.descriptor
                    return (
                        <Appbar.Header theme={theme}>
                            {previous ?
                                <Appbar.BackAction onPress={navigation.goBack} /> :
                                <Appbar.Action icon="menu" onPress={openDrawer} />}
                            <Appbar.Content title={options.headerTitle} titleStyle={globalStyles.navBarTitle} />
                        </Appbar.Header>
                    )
                }
            }}>
            <Stack.Screen
                name={routes.HOME}
                component={TabNavigator}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home'
                    return { headerTitle: routeName }
                }}
            />
        </Stack.Navigator>
    )
}
