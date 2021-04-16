import React from 'react'
import { TextArgs } from 'display-api'
import { Text, Title } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import colors from '../../../utils/colors'

export const TextComponent = ({ text, color, preset }: TextArgs, { isLink = false }: { isLink?: boolean }) => {
	color = color || colors.text

	if (preset === 'Heading') {
		return <Title style={[styles(color).headline, isLink ? styles().link : null]}>{text}</Title>
	}
	return <Text style={[styles(color).text, isLink ? styles().link : null]}>{text}</Text>
}

const styles = (color = colors.text) =>
	StyleSheet.create({
		headline: {
			color: color,
		},
		text: {
			marginVertical: 10,
			color: color,
			fontSize: 13,
			fontWeight: '400',
			lineHeight: 18,
		},
		link: {
			textDecorationLine: 'underline',
		},
	})
