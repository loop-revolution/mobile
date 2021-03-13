import React, { Component } from 'react'
import { CheckboxArgs, TextArgs } from 'display-api'
import { Checkbox, Text, Title } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import colors from '../../../utils/colors'
import { globalStyles } from '../../../utils/styles'
import { CheckboxAndroid } from 'react-native-paper/lib/typescript/src/components/Checkbox/CheckboxAndroid'
import { TextComponent } from './TextComponent'
import { ComponentDelegate } from '../ComponentDelegate'

export const CheckboxComponent = ({
    color_scheme,
    color,
    variant,
    readonly,
    disabled,
    name,
    value,
    text,
    on_change }: CheckboxArgs) => {
    color = color || colors.text

    const [checked, setChecked] = React.useState(value)

    const onPress = () => {
        if (variant === 'Default') {
            setChecked(checked === 0 ? 1 : 0)
        } else {
            // TODO: handle the cancel check state
            setChecked(checked === 0 ? 1 : 0)
        }
    }

    return (
        <View style={globalStyles.row}>
            <Checkbox
                disabled={disabled || readonly}
                color={color_scheme}
                status={checked === 0 ? 'unchecked' : 'checked'}
                onPress={() => { onPress() }} />

            {text ? <ComponentDelegate component={text} /> :
                <Text style={styles(color).text}>
                    {name}
                </Text>
            }
        </View>
    )
}

const styles = (color = colors.text) =>
    StyleSheet.create({
        text: {
            padding: 10,
            color: color,
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 18,
        }
    })
