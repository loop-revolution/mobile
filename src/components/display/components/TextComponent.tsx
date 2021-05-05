import React from 'react'
import { TextArgs } from 'display-api'
import { Text, Title } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import colors from '../../../utils/colors'

export const TextComponent = (
	{ text, color, preset, bold, underline, italic, strikethrough }: TextArgs,
	{ isLink = false }: { isLink?: boolean },
) => {
	color = color || colors.text

	if (preset === 'Heading') {
		return (
			<Title numberOfLines={0} style={[styles(color).headline, isLink ? styles().link : null]}>
				{text}
			</Title>
		)
	}

	const componentStyle = {}

	if (bold) {
		componentStyle.fontWeight = 'bold'
	}
	if (underline) {
		componentStyle.textDecorationLine = 'underline'
	}
	if (italic) {
		componentStyle.fontStyle = 'italic'
	}
	if (strikethrough) {
		componentStyle.textDecorationLine = 'line-through'
		componentStyle.textDecorationStyle = 'solid'
	}
	if (isLink && underline !== false) {
		componentStyle.textDecorationLine = 'underline'
	}

	return (
		<Text numberOfLines={0} style={[styles(color).text, componentStyle]}>
			{text}
		</Text>
	)
}

const styles = (color = colors.text) =>
	StyleSheet.create({
		headline: {
			color: color,
		},
		text: {
			marginVertical: 8,
			color: color,
			fontSize: 14,
			fontWeight: '400',
			lineHeight: 18,
		},
		link: {
			textDecorationLine: 'underline',
		},
	})
