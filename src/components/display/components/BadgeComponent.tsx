import { StyleSheet, View } from 'react-native'
import React from 'react'
import { BadgeArgs } from "display-api";
import { Chip } from 'react-native-paper';
import colors from '../../../utils/colors';

export const BadgeComponent = ({
    text,
    variant,
    color_scheme }: BadgeArgs) => {

    return <View style={styles().container}>
        <Chip
            textStyle={styles().textStyle}
            style={variant === 'Subtle' ? styles(color_scheme).subtleChip : styles(color_scheme).solidChip}
            mode={variant === 'Outline' ? 'outlined' : 'flat'}>
            {text}
        </Chip>
    </View>
}

const styles = (color = colors.primary) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        textStyle: {
            color: colors.white
        },
        solidChip: {
            backgroundColor: color,
        },
        subtleChip: {
            backgroundColor: color,
            opacity: 0.6,
        },

    })
