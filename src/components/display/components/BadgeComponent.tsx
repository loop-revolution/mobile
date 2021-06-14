import { StyleSheet, View } from 'react-native'
import React from 'react'
import { BadgeArgs } from 'display-api'
import { Chip } from 'react-native-paper'
import colors from '../../../utils/colors'

export const BadgeComponent = ({ text, variant, color_scheme }: BadgeArgs) => {
	const color = color_scheme ?? colors.text
	return (
		<View style={styles().container}>
			<Chip
				textStyle={variant === 'Outline' ? styles(color).outlineTextStyle : styles(color).textStyle}
				style={
					variant === 'Subtle'
						? styles(color).subtleChip
						: variant === 'Solid'
						? styles(color).solidChip
						: styles(color).outlineChip
				}
				mode='outlined'
			>
				{text}
			</Chip>
		</View>
	)
}

const styles = (color = colors.primary) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
			flex: 1,
		},
		textStyle: {
			color: color,
			fontSize: 10,
			marginVertical: 0,
		},
		outlineTextStyle: {
			color: color,
			fontSize: 10,
			marginVertical: 0,
		},
		solidChip: {
			backgroundColor: color,
		},
		subtleChip: {
			backgroundColor: color,
			opacity: 0.6,
		},
		outlineChip: {
			borderColor: color,
		},
	})
