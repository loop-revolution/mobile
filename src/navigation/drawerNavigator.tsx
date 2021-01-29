import React from 'react'
import { createDrawerNavigator } from "@react-navigation/drawer"
import { DrawerContent } from './drawerContent'
import { HomeNavigator } from "./homeNavigator"
import routes from "./routes"

const Drawer = createDrawerNavigator()

export const DrawerNavigator = () => {
    return (
        <Drawer.Navigator drawerType="slide" drawerContent={props => <DrawerContent {...props} />}>
            <Drawer.Screen name={routes.HOME} component={HomeNavigator} />
        </Drawer.Navigator>)
}