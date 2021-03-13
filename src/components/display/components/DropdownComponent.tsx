import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DropdownArgs, DropdownOption } from 'display-api'
import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Menu, Provider, Text, TouchableRipple } from 'react-native-paper'
import colors from '../../../utils/colors'
import { globalStyles } from '../../../utils/styles'

export const DropdownComponent = ({
    color_scheme,
    disabled,
    name,
    on_change,
    options,
    readonly,
    variant }: DropdownArgs) => {
    const [isVisible, setVisible] = React.useState(false)

    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)

    const menuOptions = options.map(({ icon, text }: DropdownOption) => (
        <Menu.Item
            icon={icon}
            title={text}
            onPress={() => { }} />
    ))

    const isOutlined = variant === 'Outline'
    const anchor = (
        <TouchableRipple
            disabled={disabled}
            style={[styles(color_scheme).anchor, isOutlined ? styles(color_scheme).outlined : styles(color_scheme).filled]}
            onPress={openMenu}>
            <View style={globalStyles.row}>
                <Text
                    style={styles(isOutlined ? color_scheme : colors.white).title}>
                    {name}
                </Text>
                <MaterialCommunityIcons
                    color={isOutlined ? color_scheme : colors.white}
                    size={20}
                    name={'chevron-down'} />
            </View>
        </TouchableRipple>
    )

    return (
        <Provider>
            <View style={styles().container}>
                <Menu
                    visible={isVisible}
                    onDismiss={closeMenu}
                    anchor={anchor}>
                    {menuOptions}
                </Menu>
            </View>
        </Provider>
    )
}

const styles = (color = colors.text) =>
    StyleSheet.create({
        container: {
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        anchor: {
            borderColor: color,
            padding: 10,
            borderRadius: 5,
        },
        filled: {
            backgroundColor: color
        },
        outlined: {
            borderColor: color,
            borderWidth: 1
        },
        title: {
            color: color
        }
    })
