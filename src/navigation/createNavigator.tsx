import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native'
import routes from './routes'
import { Appbar } from 'react-native-paper'
import { globalStyles } from '../utils/styles'
import { CreateBlock } from '../screens/createBlock'
import { Create } from '../screens/create'

const Stack = createStackNavigator()

export const CreateNavigator = ({ navigation }: { navigation: any }) => {
	const theme = useTheme()

	const openDrawer = () => {
		navigation.openDrawer()
	}

	return (
		<Stack.Navigator
			initialRouteName={routes.CREATE}
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
				name={routes.CREATE}
				component={Create}
				options={({ route }: { route: any }) => {
					const routeName = getFocusedRouteNameFromRoute(route) ?? 'Create'
					return { headerTitle: routeName }
				}}
			/>
			<Stack.Screen name={routes.CREATE_BLOCK} component={CreateBlock} options={{ headerTitle: 'Create Block' }} />
		</Stack.Navigator>
	)
}
