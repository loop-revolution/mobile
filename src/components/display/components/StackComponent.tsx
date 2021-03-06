import React from 'react'
import { StackArgs } from 'display-api'
import { ComponentDelegate } from '../ComponentDelegate'
import { View, StyleSheet } from 'react-native'

// eslint-disable-next-line react/prop-types
export const StackComponent = ({ direction = 'Vertical', items, align_x, align_y }: StackArgs) => {
	// eslint-disable-next-line react/prop-types
	const content = items.map(({ component }: { component: any }, index: number) => (
		<View key={index?.toString()} style={{ marginHorizontal: 2 }}>
			<ComponentDelegate component={component} />
		</View>
	))
	switch (direction) {
		case 'Horizontal':
			return <View style={[styles.horizontal, { alignItems: flexLang(align_y) }]}>{content}</View>
		case 'Fit':
			return <View style={[styles.fit, { alignItems: flexLang(align_y) }]}>{content}</View>
		default:
			return <View style={[styles.vertical, { alignItems: flexLang(align_x) }]}>{content}</View>
	}
}

function flexLang(s?: string) {
	if (s == 'Middle') {
		return 'center'
	}
	if (s == 'Bottom' || s == 'Right') {
		return 'flex-end'
	}
	return 'stretch'
}

const styles = StyleSheet.create({
	horizontal: {
		flexDirection: 'row',
	},
	vertical: {
		width: 'auto',
	},
	fit: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
	},
})
