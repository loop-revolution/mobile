import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native'
import routes from './routes'
import { TabNavigator } from './tabNavigator'
import { Appbar } from 'react-native-paper'
import { globalStyles } from '../utils/styles'
import { CreateBlock } from '../screens/createBlock'
import { BlockPage } from '../screens/blockPage'
import { BreadcrumbHeader } from '../components/breadcrumbHeader'
import { Profile } from '../screens/profile'

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
                    const isCustomTitle = typeof (options.headerTitle) === 'function'
                    return (
                        <Appbar.Header theme={theme}>
                            {previous ?
                                <Appbar.BackAction onPress={navigation.goBack} /> :
                                <Appbar.Action icon="menu" onPress={openDrawer} />}
                            <Appbar.Content title={isCustomTitle ? options.headerTitle() : options.headerTitle} titleStyle={globalStyles.navBarTitle} />
                            {options.headerRight && options.headerRight()}
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
                }} />
            <Stack.Screen
                name={routes.CREATE_BLOCK}
                component={CreateBlock}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Create Block'
                    return { headerTitle: routeName }
                }} />
            <Stack.Screen
                name={routes.BLOCK_PAGE}
                component={BlockPage} />
            <Stack.Screen
                name={routes.PROFILE}
                component={Profile}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Profile'
                    return { headerTitle: routeName }
                }} />
        </Stack.Navigator>
    )
}
