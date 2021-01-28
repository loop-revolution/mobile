import { MaterialCommunityIcons } from '@expo/vector-icons'
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
} from '@react-navigation/drawer'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Caption, Drawer, Title } from 'react-native-paper'
import Animated from 'react-native-reanimated'

export function DrawerContent(props: DrawerContentComponentProps) {
    return (
        <DrawerContentScrollView {...props}>
            <Animated.View
                style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <Title style={styles.title}>Salman Maredia</Title>
                    <Caption style={styles.caption}>@salmanaly</Caption>
                </View>
                <Drawer.Section style={styles.drawerSection}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons
                                name="account-outline"
                                color={color}
                                size={size} />
                        )}
                        label="Profile"
                        onPress={() => { }} />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons name="account-outline" color={color} size={size} />
                        )}
                        label="Option 2"
                        onPress={() => { }} />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons name="account-outline" color={color} size={size} />
                        )}
                        label="Option 3"
                        onPress={() => { }} />
                </Drawer.Section>
            </Animated.View>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        marginTop: 20,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    drawerSection: {
        marginTop: 5,
    }
})
