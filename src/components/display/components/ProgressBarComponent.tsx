import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { ProgressArgs } from 'display-api'
import ProgressCircle from 'react-native-progress-circle'
import colors from '../../../utils/colors'

export const ProgressBarComponent = ({ value, max = 100, inner_label, thickness = '5', color }: ProgressArgs) => {
	const percentage = (100 * value) / max

	return (
		<ProgressCircle
			percent={percentage}
			radius={40}
			borderWidth={parseInt(thickness)}
			color={color}
			shadowColor='#E8E8E8'
		>
			<Text style={styles(color).text}>{inner_label}</Text>
			<Text style={styles(color).percentageText}>{percentage}</Text>
		</ProgressCircle>
	)
}

const styles = (color = colors.text) =>
	StyleSheet.create({
		text: {
			color: color,
			fontSize: 12,
			fontWeight: '400',
		},
		percentageText: {
			color: color,
			fontSize: 20,
			fontWeight: '500',
		},
	})
