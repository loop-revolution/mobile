import React from 'react'
import { StackArgs } from 'display-api'
import { ComponentDelegate } from '../ComponentDelegate'
import { View, StyleSheet } from 'react-native'

// eslint-disable-next-line react/prop-types
export const StackComponent = ({ direction = 'Vertical', items, align_x, align_y }: StackArgs) => {
	// eslint-disable-next-line react/prop-types
	const content = items.map(({ component }: { component: any }, index: number) => (
		<ComponentDelegate component={component} key={index?.toString()} />
	))
	switch (direction) {
		case 'Horizontal':
			return <View style={[styles.horizontal, { justifyContent: flexLang(align_y) }]}>{content}</View>
		case 'Fit':
			return <View style={[styles.fit, { justifyContent: flexLang(align_x) }]}>{content}</View>
		default:
			return <View style={[styles.vertical, { justifyContent: flexLang(align_x) }]}>{content}</View>
	}
}

function flexLang(s?: string) {
	if (s == "Middle") {
		return "center"
	}
	if (s == "Bottom" || s == "Right") {
		return "flex-end"
	}
	return "flex-start"
}

const styles = StyleSheet.create({
	horizontal: {
		flexDirection: 'row',
	},
	vertical: {
		flexDirection: 'column',
		width: "auto",
		minWidth: 50,
	},
	fit: {
		flexDirection: 'column',
	},
})
