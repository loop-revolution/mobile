import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native'
import routes from './routes'
import { Appbar } from 'react-native-paper'
import { globalStyles } from '../utils/styles'
import { GlobalNotifications } from '../screens/globalNotifications'

const Stack = createStackNavigator()

export const NotifcationNavigator = ({ navigation }: { navigation: any }) => {
	const theme = useTheme()

	const openDrawer = () => {
		navigation.openDrawer()
	}

	return (
		<Stack.Navigator
			initialRouteName={routes.NOTIFICATIONS}
			headerMode='screen'
			screenOptions={{
				header: ({ scene, previous, navigation }: { scene: any; previous: any; navigation: any }) => {
					const { options } = scene.descriptor
					return (
						<Appbar.Header theme={theme}>
							{previous ? (
								options.headerLeft ? (
									options.headerLeft()
								) : (
									<Appbar.BackAction onPress={navigation.goBack} />
								)
							) : (
								<Appbar.Action icon='menu' onPress={openDrawer} />
							)}
							<Appbar.Content title={options.headerTitle} titleStyle={globalStyles.navBarTitle} />
							{options.headerRight && options.headerRight()}
						</Appbar.Header>
					)
				},
			}}
		>
			<Stack.Screen
				name={routes.NOTIFICATIONS}
				component={GlobalNotifications}
				options={({ route }: { route: any }) => {
					const routeName = getFocusedRouteNameFromRoute(route) ?? 'Notifications'
					return { headerTitle: routeName }
				}}
			/>
		</Stack.Navigator>
	)
}
