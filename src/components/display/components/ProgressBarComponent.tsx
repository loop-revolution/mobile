import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { ProgressArgs } from 'display-api'
import ProgressCircle from 'react-native-progress-circle'
import colors from '../../../utils/colors'

export const ProgressBarComponent = ({ value, max = 100, inner_label, thickness = '5', color }: ProgressArgs) => {
	const max_score = max ? max : 100
	const percentage = value ? (100 * value) / max_score : 0
	const borderThickness = thickness ? parseInt(thickness) : 5
	const progressColor = color ? (color.includes('#') ? color : `${color}`) : colors.primary

	return (
		<ProgressCircle
			percent={percentage}
			radius={40}
			borderWidth={borderThickness}
			color={progressColor}
			shadowColor='#E8E8E8'
		>
			<Text style={styles(progressColor).text}>{inner_label}</Text>
			<Text style={styles(progressColor).percentageText}>{percentage}</Text>
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
