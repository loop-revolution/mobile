import { StyleSheet, View } from 'react-native'
import React from 'react'
import { BadgeArgs } from 'display-api'
import { Chip } from 'react-native-paper'
import colors from '../../../utils/colors'

export const BadgeComponent = ({ text, variant, color_scheme }: BadgeArgs) => {
	return (
		<View style={styles().container}>
			<Chip
				textStyle={variant === 'Outline' ? styles(color_scheme).outlineTextStyle : styles().textStyle}
				style={
					variant === 'Subtle'
						? styles(color_scheme).subtleChip
						: variant === 'Solid'
						? styles(color_scheme).solidChip
						: styles(color_scheme).outlineChip
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
		},
		textStyle: {
			color: colors.white,
		},
		outlineTextStyle: {
			color: color,
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
