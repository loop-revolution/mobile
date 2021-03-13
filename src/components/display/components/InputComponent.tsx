import React, { useState } from 'react'
import { InputArgs } from 'display-api'
import { Button, TextInput } from 'react-native-paper'
import { StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { blockMethod, setMethodVariable } from '../method'
import { multiply } from 'react-native-reanimated'

export const InputComponent = ({
	initial_value,
	name,
	label,
	mask,
	confirm_cancel,
	disabled,
	size }: InputArgs) => {
	const [value, setValue] = useState<string>(initial_value)
	const [error, setError] = useState<string>(null)
	const [isFocused, setFocused] = useState<boolean>(false)
	const [isLoading, setLoading] = useState(false)

	const onChange = (value: string) => {
		setValue(value)
		name && setMethodVariable(name, value)
	}

	const onConfirm = async () => {
		setLoading(true)
		const response = await blockMethod(confirm_cancel.on_confirm.method)
		setLoading(false)
		if (response.error) {
			setError(response.error.message.replace(/\[\w+\]/g, ''))
		}
	}

	const onCancel = () => {
		setValue(initial_value)
	}

	let inputStyle: Array<any> = [styles.input]
	if (size === 'MultiLine') {
		inputStyle.push(styles.multiline)
	} else if (size === 'Small') {
		inputStyle.push(styles.small)
	}

	return (
		<View>
			<TextInput
				mode='outlined'
				disabled={disabled}
				style={inputStyle}
				multiline={size === 'MultiLine' || size === 'Flexible'}
				label={label}
				placeholder={label}
				onChangeText={value => onChange(value)}
				value={value}
				theme={!isFocused && mask ? { colors: { placeholder: 'transparent', background: 'transparent' } } : undefined}
				autoCapitalize='none'
				onFocus={() => {
					setFocused(true)
				}}
				onBlur={() => {
					setFocused(false)
				}}
			/>
			{
				confirm_cancel?.enabled && value !== initial_value && (
					<View style={styles.buttonsContainer}>
						<Button
							onPress={onConfirm}
							loading={isLoading}
							contentStyle={globalStyles.buttonContentStyle}
							mode='contained'
							icon='check'
							labelStyle={{ color: 'white' }}
						>
							Confirm
					</Button>
						<Button
							onPress={onCancel}
							contentStyle={globalStyles.buttonContentStyle}
							style={styles.button}
							mode='contained'
							icon='close'
							labelStyle={{ color: 'white' }}
						>
							Cancel
					</Button>
					</View>
				)
			}
			{ error && <Text style={globalStyles.error}>{error}</Text>}
		</View >
	)
}

const styles = StyleSheet.create({
	buttonsContainer: {
		flexDirection: 'row',
		marginVertical: 10,
		justifyContent: 'flex-end',
	},
	button: {
		marginLeft: 10,
	},
	input: {
		marginTop: 10,
	},
	small: {
		width: '50%'
	},
	multiline: {
		height: 150,
	}
})
