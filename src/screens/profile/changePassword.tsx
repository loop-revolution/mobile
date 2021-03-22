import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, HelperText, Snackbar, Text, TextInput, Title } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User } from '../../api/types'
import { globalStyles } from '../../utils/styles'
import lodash from 'lodash'
import { getRules, InputType } from '../../utils/validation'
import { UPDATE_PASSWORD } from '../../api/gql'
import { useMutation } from 'urql'

type UpdateResult = { user: User }
type UpdateRequest = { password: string; newPassword: string }

export const ChangePassword = () => {
	const [isLoading, setLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { control, handleSubmit, errors, watch } = useForm()
	const [updatePasswordResponse, updatePassword] = useMutation<UpdateResult, UpdateRequest>(UPDATE_PASSWORD)

	const textInput = (type: InputType, errors: any, defaultValue: string = '', disabled: boolean = false) => {
		return (
			<Controller
				control={control}
				render={({ onChange, value }) => (
					<View style={styles.inputText}>
						<TextInput
							mode='outlined'
							label={lodash.startCase(type)}
							onChangeText={value => onChange(value)}
							value={value}
							disabled={disabled}
							secureTextEntry={true}
							error={errors}
							autoCapitalize='none'
						/>
						{errors && (
							<HelperText type='error'>{errors.message != '' ? errors.message : 'This is required.'}</HelperText>
						)}
					</View>
				)}
				name={type}
				rules={type === InputType.confirmPassword ? getConfirmPasswordRules() : getRules(type)}
				defaultValue={defaultValue}
			/>
		)
	}

	const getConfirmPasswordRules = () => {
		return { required: true, validate: value => value === watch('newPassword') || "Passwords don't match." }
	}

	const onSubmit = (formData: any) => {
		setLoading(true)
		const request: UpdateRequest = {
			newPassword: formData.newPassword,
			password: formData.password,
		}
		updatePassword(request).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				setSnackbarVisible(true)
			}
		})
	}

	return (
		<>
			<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
				<SafeAreaView>
					<Title style={styles.title}>Update your password below</Title>

					{textInput(InputType.password, errors.password)}
					{textInput(InputType.newPassword, errors.newPassword)}
					{textInput(InputType.confirmPassword, errors.confirmPassword)}

					<Button
						onPress={handleSubmit(onSubmit)}
						style={styles.button}
						contentStyle={globalStyles.buttonContentStyle}
						mode='contained'
						loading={isLoading}
						labelStyle={{ color: 'white' }}
					>
						Update
					</Button>
					{updatePasswordResponse.error && (
						<Text style={globalStyles.error}>{updatePasswordResponse.error.message.replace(/\[\w+\]/g, '')}</Text>
					)}
				</SafeAreaView>
			</ScrollView>
			<Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
				Password updated successfully
			</Snackbar>
		</>
	)
}

const styles = StyleSheet.create({
	scrollViewContent: {
		flex: 1,
		paddingHorizontal: 30,
	},
	title: {
		marginTop: 10,
	},
	button: {
		marginTop: 20,
	},
	inputText: {
		marginTop: 10,
	},
})
