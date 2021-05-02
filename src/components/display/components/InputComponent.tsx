import React, { useState } from 'react'
import { DropdownOption, InputArgs } from 'display-api'
import { Button, TextInput } from 'react-native-paper'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { blockMethod, setMethodVariable } from '../method'
import DateTimePicker from '@react-native-community/datetimepicker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../../../utils/colors'
import moment from 'moment'
import { DropdownComponent } from './DropdownComponent'

export const InputComponent = ({
	initial_value,
	name,
	label,
	mask,
	confirm_cancel,
	disabled,
	size,
	type,
}: InputArgs) => {
	const [value, setValue] = useState<string>(initial_value)
	const [frequency, setFrequency] = useState<string | null>('Days')
	const [error, setError] = useState<string>(null)
	const [isLoading, setLoading] = useState(false)
	const [inputShown, setInputShown] = useState(mask == undefined ? true : false)

	const [date, setDate] = useState(new Date())
	const [time, setTime] = useState(new Date())
	const [showDate, setShowDate] = useState(false)
	const [showTime, setShowTime] = useState(false)
	

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
		} else {
			setInputShown(false)
		}
	}

	const onCancel = () => {
		setValue(initial_value)
		setInputShown(false)
	}

	const inputStyle: Array<any> = [styles.input]
	if (size === 'MultiLine') {
		inputStyle.push(styles.multiline)
	} else if (size === 'Small') {
		inputStyle.push(styles.small)
	}

	const textInput = () => {
		if (mask && !inputShown) {
			return (
				<Text
					onPress={() => setInputShown(true)}
					numberOfLines={3}
					style={{
						fontWeight: mask.preset === "Heading" ? "bold" : "normal",
						fontSize: mask.preset === "Heading" ? 20 : undefined,
						color: mask.color ?? colors.text
					}}
				>
					{mask.text || label || "Data" }
				</Text>
			)
		}
		return (
			<TextInput
				mode='outlined'
				disabled={disabled}
				style={inputStyle}
				multiline={size === 'MultiLine' || size === 'Flexible'}
				label={label}
				placeholder={label}
				onChangeText={value => onChange(value)}
				value={value}
				keyboardType={type === 'Number' ? 'numeric' : 'default'}
				autoCapitalize='none'
				onFocus={() => {
					setInputShown(true)
				}}
			/>
		)
	}

	const frequencyInput = () => {
		const options: DropdownOption[] = [{ text: 'Days' }, { text: 'Weeks' }, { text: 'Months' }, { text: 'Years' }]
		const onSelectFrequency = (index: number) => {
			if (index != undefined) {
				setFrequency(options[index].text)
				name && setMethodVariable(name, `${value} ${frequency}`)
			}
		}
		const updateNumber = (number: string) => {
			setValue(number)
			name && setMethodVariable(name, `${number} ${frequency}`)
		}

		return (
			<View style={globalStyles.row}>
				<TextInput
					mode='outlined'
					style={[inputStyle, styles.frequencyInput]}
					placeholder=''
					onChangeText={value => updateNumber(value)}
					autoCapitalize='none'
					keyboardType='numeric'
				/>
				<DropdownComponent variant={'Outline'} default={0} options={options} onSelect={onSelectFrequency} />
			</View>
		)
	}

	const datePicker = () => {
		const rightView = () => (
			<TextInput.Icon
				name={() => <MaterialCommunityIcons color={colors.primary} name={'calendar'} size={25} />}
				onPress={() => {
					setShowDate(!showDate)
				}}
			/>
		)

		const onChangeDatePicker = (event: any, selectedDate: Date) => {
			const currentDate = selectedDate || date
			setShowDate(Platform.OS === 'ios')
			setDate(currentDate)
		}

		return (
			<>
				<TextInput
					mode='outlined'
					right={rightView()}
					disabled={disabled}
					style={inputStyle}
					label='Date'
					placeholder='Date'
					editable={false}
					value={moment(date).format('MMM DD, YYYY')}
				/>
				{showDate && (
					<DateTimePicker
						value={date}
						mode='date'
						display={Platform.OS === 'ios' ? 'inline' : 'default'}
						textColor='red'
						style={styles.input}
						onChange={onChangeDatePicker}
					/>
				)}
			</>
		)
	}

	const timePicker = () => {
		const rightView = () => (
			<TextInput.Icon
				name={() => <MaterialCommunityIcons color={colors.primary} name={'clock'} size={25} />}
				onPress={() => {
					setShowTime(!showTime)
				}}
			/>
		)

		const onChangeTimePicker = (event: any, selectedTime: Date) => {
			const currentTime = selectedTime || time
			setShowTime(Platform.OS === 'ios')
			setTime(currentTime)
		}

		return (
			<>
				<TextInput
					mode='outlined'
					right={rightView()}
					disabled={disabled}
					style={inputStyle}
					label='Date'
					placeholder='Date'
					editable={false}
					value={moment(time).format('hh:mm A')}
				/>
				{showTime && (
					<DateTimePicker
						value={time}
						mode='time'
						display={Platform.OS === 'ios' ? 'inline' : 'default'}
						onChange={onChangeTimePicker}
					/>
				)}
			</>
		)
	}

	return (
		<View style={{ zIndex: 10 }}>
			{type === 'Date'
				? datePicker()
				: type === 'Time'
					? timePicker()
					: type === 'Frequency'
						? frequencyInput()
						: textInput()}
			{confirm_cancel?.enabled && value !== initial_value && (
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
			)}
			{error && <Text style={globalStyles.error}>{error}</Text>}
		</View>
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
		marginStart: 0,
		paddingTop: 0,
		top: 0,
		paddingVertical: 0,
		marginVertical: 0,
	},
	small: {
		width: '50%',
	},
	multiline: {
		height: 150,
	},
	frequencyInput: {
		width: '15%',
		marginRight: 10,
	},
})
