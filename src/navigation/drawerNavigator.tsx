import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerContent } from './drawerContent'
import routes from './routes'
import { TabNavigator } from './tabNavigator'

const Drawer = createDrawerNavigator()

export const DrawerNavigator = () => {
	return (
		<Drawer.Navigator drawerType='slide' drawerContent={props => <DrawerContent {...props} />}>
			<Drawer.Screen name={routes.HOME} component={TabNavigator} />
		</Drawer.Navigator>
	)
}
