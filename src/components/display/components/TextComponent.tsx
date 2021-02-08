import React from 'react'
import { TextArgs } from "display-api"
import { Text, Title } from "react-native-paper"
import { StyleSheet } from 'react-native'
import colors from '../../../utils/colors'

export const TextComponent = ({ text, color, preset }: TextArgs) => {

    color = color || colors.text

    if (preset === "Heading") {
        return <Title style={styles({ color }).headline}>{text}</Title>
    }
    return <Text style={styles({ color }).text}>{text}</Text>
}

const styles = ({ color }) => StyleSheet.create({
    headline: {
        color: color,
    },
    text: {
        color: color,
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18
    },
})