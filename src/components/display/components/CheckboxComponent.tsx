import React from 'react'
import { CheckboxArgs } from 'display-api'
import { ActivityIndicator, Checkbox, Text } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import colors from '../../../utils/colors'
import { globalStyles } from '../../../utils/styles'
import { ComponentDelegate } from '../ComponentDelegate'
import { blockMethod, setMethodVariable } from '../method'

export const CheckboxComponent = ({
	color_scheme,
	color,
	variant,
	readonly,
	disabled,
	name,
	value,
	text,
	on_change,
}: CheckboxArgs) => {
	color = color || colors.text

	const [checked, setChecked] = React.useState(value)
	const [isLoading, setLoading] = React.useState(false)

	const onPress = async () => {
		if (variant === 'Default') {
			setChecked(checked === 0 ? 1 : 0)
		} else {
			// TODO: handle the cancel check state
			setChecked(checked === 0 ? 1 : 0)
		}
		name && setMethodVariable(name, checked.toString())
		setLoading(true)
		const response = await blockMethod(on_change.method)
		setLoading(false)
		if (response.error) {
			//TODO: handle error based on usage
		}
	}

	return (
		<View style={globalStyles.row}>
			<Checkbox
				disabled={disabled || readonly}
				color={color_scheme}
				status={checked === 0 ? 'unchecked' : 'checked'}
				onPress={() => {
					onPress()
				}}
			/>

			{text ? <ComponentDelegate component={text} /> : <Text style={styles(color).text}>{name}</Text>}
			{isLoading && <ActivityIndicator {...null} color={color_scheme} />}
		</View>
	)
}

const styles = (color = colors.text) =>
	StyleSheet.create({
		text: {
			padding: 10,
			color: color,
			fontSize: 14,
			fontWeight: '400',
			lineHeight: 18,
		},
	})
