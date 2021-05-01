import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme } from 'react-native-paper'
import { Image } from 'react-native'
import Images from '../utils/images'
import { HomeNavigator } from './homeNavigator'
import { SearchNavigator } from './searchNavigator'
import { CreateNavigator } from './createNavigator'
import { NotifcationNavigator } from './notificationNavigator'

const Tab = createMaterialBottomTabNavigator()

export const TabNavigator = () => {
	const theme = useTheme()

	return (
		<Tab.Navigator
			initialRouteName='Home'
			backBehavior='initialRoute'
			shifting={true}
			labeled={false}
			activeColor={theme.colors.primary}
			inactiveColor='#fff'
			barStyle={{ backgroundColor: '#2F3437' }}
			sceneAnimationEnabled={false}
		>
			<Tab.Screen
				name='Home'
				component={HomeNavigator}
				options={{
					tabBarIcon: ({ color }: { color: string }) => <Image source={Images.tabHome} style={{ tintColor: color }} />,
				}}
			/>
			<Tab.Screen
				name='Search'
				component={SearchNavigator}
				options={{
					tabBarIcon: ({ color }: { color: string }) => (
						<Image source={Images.tabSearch} style={{ tintColor: color }} />
					),
				}}
			/>
			<Tab.Screen
				name='Create'
				component={CreateNavigator}
				options={{
					tabBarIcon: ({ color }: { color: string }) => <Image source={Images.tabAdd} style={{ tintColor: color }} />,
				}}
			/>
			<Tab.Screen
				name='Notifications'
				component={NotifcationNavigator}
				options={{
					tabBarIcon: ({ color }: { color: string }) => (
						<Image source={Images.tabNotification} style={{ tintColor: color }} />
					),
				}}
			/>
		</Tab.Navigator>
	)
}
