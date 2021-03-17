import React from 'react'
import { CheckboxArgs } from 'display-api'
import { ActivityIndicator, Checkbox } from 'react-native-paper'
import { View } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { ComponentDelegate } from '../ComponentDelegate'
import { blockMethod, setMethodVariable } from '../method'

export const CheckboxComponent = ({
	color_scheme,
	variant,
	readonly,
	disabled,
	name,
	value,
	text,
	on_change,
}: CheckboxArgs) => {
	const [checked, setChecked] = React.useState(value)
	const [isLoading, setLoading] = React.useState(false)

	const onPress = async () => {
		if (variant === 'Cancel') {
			setChecked(checked === 0 ? 1 : checked === 1 ? 2 : 0)
		} else {
			setChecked(checked === 0 ? 1 : 0)
		}
		if (on_change) {
			name && setMethodVariable(name, checked.toString())
			setLoading(true)
			const response = await blockMethod(on_change?.method)
			setLoading(false)
			if (response.error) {
				//TODO: handle error based on usage
			}
		}
	}

	return (
		<View style={globalStyles.row}>
			<Checkbox.Android
				disabled={disabled || readonly}
				color={color_scheme}
				uncheckedColor={color_scheme}
				status={checked === 0 ? 'unchecked' : checked === 1 ? 'checked' : 'indeterminate'}
				onPress={() => {
					onPress()
				}}
			/>

			{text && <ComponentDelegate component={text} />}
			{isLoading && <ActivityIndicator {...null} color={color_scheme} />}
		</View>
	)
}
