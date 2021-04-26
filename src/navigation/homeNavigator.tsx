import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { getFocusedRouteNameFromRoute, useTheme } from '@react-navigation/native'
import routes from './routes'
import { TabNavigator } from './tabNavigator'
import { Appbar } from 'react-native-paper'
import { globalStyles } from '../utils/styles'
import { CreateBlock } from '../screens/createBlock'
import { BlockPage } from '../screens/blockPage'
import { Search } from '../screens/search/search'
import { Profile } from '../screens/profile/profile'
import { EditProfile } from '../screens/profile/editProfile'
import { Permissions } from '../components/blockMenu/permissions'
import { ChangePassword } from '../screens/profile/changePassword'
import { ChangeEmail } from '../screens/profile/changeEmail'
import { ChangeDisplayName } from '../screens/profile/changeDisplayName'
import { ChangeUsername } from '../screens/profile/changeUsername'
import { BlockFilters } from '../screens/search/blockFilters'
import { Create } from '../screens/create'
import { BlockComments } from '../components/blockMenu/blockComments'
import { WhatsNew } from '../screens/whatsNew'

const Stack = createStackNavigator()

export const HomeNavigator = ({ navigation }: { navigation: any }) => {
	const theme = useTheme()

	const openDrawer = () => {
		navigation.openDrawer()
	}

	return (
		<Stack.Navigator
			initialRouteName={routes.HOME}
			headerMode='screen'
			screenOptions={{
				header: ({ scene, previous, navigation }: { scene: any; previous: any; navigation: any }) => {
					const { options } = scene.descriptor
					const isCustomTitle = typeof options.headerTitle === 'function'
					return (
						<Appbar.Header theme={theme}>
							{previous ? options.headerLeft ? options.headerLeft() :
                                <Appbar.BackAction onPress={navigation.goBack} /> :
                                <Appbar.Action icon='menu' onPress={openDrawer} /> }
							<Appbar.Content
								title={isCustomTitle ? options.headerTitle() : options.headerTitle}
								titleStyle={globalStyles.navBarTitle}
							/>
							{options.headerRight && options.headerRight()}
						</Appbar.Header>
					)
				},
			}}
		>
			<Stack.Screen
				name={routes.HOME}
				component={BlockPage}
				options={({ route }: { route: any }) => {
					const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home'
					return { headerTitle: routeName }
				}}
			/>
			<Stack.Screen
				name={routes.SEARCH}
				component={Search}
				options={({ route }) => {
					const routeName = getFocusedRouteNameFromRoute(route) ?? 'Search'
					return { headerTitle: routeName }
				}}
			/>
			<Stack.Screen name={routes.CREATE_BLOCK} component={CreateBlock} options={{ headerTitle: 'Create Block' }} />
			<Stack.Screen name={routes.BLOCK_PAGE} component={BlockPage} />
			<Stack.Screen name={routes.PROFILE} component={Profile} options={{ headerTitle: 'Profile' }} />
			<Stack.Screen name={routes.EDIT_PROFILE} component={EditProfile} options={{ headerTitle: 'Edit Profile' }} />
			<Stack.Screen name={routes.CHANGE_PASSWORD} component={ChangePassword} options={{ headerTitle: 'Change Password' }} />
			<Stack.Screen name={routes.CHANGE_EMAIL} component={ChangeEmail} options={{ headerTitle: 'Change Email' }} />
			<Stack.Screen name={routes.CHANGE_DISPLAY_NAME} component={ChangeDisplayName} options={{ headerTitle: 'Change Display Name' }} />
			<Stack.Screen name={routes.CHANGE_USER_NAME} component={ChangeUsername} options={{ headerTitle: 'Change Username' }} />
			<Stack.Screen name={routes.BLOCK_PERMISSIONS} component={Permissions} options={{ headerTitle: 'Permissions' }} />
			<Stack.Screen name={routes.BLOCK_COMMENTS} component={BlockComments} options={{ headerTitle: 'Comments' }} />
			<Stack.Screen name={routes.BLOCK_FILTERS} component={BlockFilters} options={{ headerTitle: 'Filters' }} />
			<Stack.Screen name={routes.CREATE} component={Create} options={{ headerTitle: 'Blocks' }} />
			<Stack.Screen name={routes.WHATS_NEW} component={WhatsNew} options={{ headerTitle: "What's New" }} />
		</Stack.Navigator>
	)
}
