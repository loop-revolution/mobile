import React from 'react'
import { StackArgs } from 'display-api'
import { ComponentDelegate } from '../ComponentDelegate'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

// eslint-disable-next-line react/prop-types
export const StackComponent = ({ direction = 'Vertical', items }: StackArgs) => {
	// eslint-disable-next-line react/prop-types
	const content = items.map(({ component }: { component: any }) => (
		<ComponentDelegate component={component} key={JSON.stringify(component)} />
	))

	switch (direction) {
		case 'Horizontal':
			return <ScrollView style={styles.horizontal}>{content}</ScrollView>
		case 'Fit':
			return <ScrollView style={styles.fit}>{content}</ScrollView>
		default:
			return <View style={styles.vertical}>{content}</View>
	}
}

const styles = StyleSheet.create({
	horizontal: {
		flexDirection: 'row',
	},
	vertical: {
		flexDirection: 'column',
	},
	fit: {
		flexDirection: 'column',
	},
})
