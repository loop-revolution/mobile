import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, TextInput, Text, HelperText, Title, Snackbar } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from 'urql'
import { UPDATE_DISPLAY_NAME, UPDATE_USER_NAME, UPDATE_PROFILE } from '../../api/gql'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getRules, InputType } from '../../utils/validation'
import lodash from 'lodash'
import { User } from '../../api/types'

type UpdateProfileResult = { user: User }
type UpdateProfileRequest = { newUsername?: string; password?: string; newDisplayName?: string }

export const EditProfile = ({ route }: { route: any }) => {
	const [isLoading, setLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState(null)

	const [, updateDisplayName] = useMutation<UpdateProfileResult, UpdateProfileRequest>(UPDATE_DISPLAY_NAME)
	const [, updateUserName] = useMutation<UpdateProfileResult, UpdateProfileRequest>(UPDATE_USER_NAME)
	const [, updateUserProfile] = useMutation<UpdateProfileResult, UpdateProfileRequest>(UPDATE_PROFILE)

	const user = route.params?.user

	const textInput = (
		type: InputType,
		hasError: boolean,
		defaultValue: string = null,
		disabled: boolean = false,
		isPasswordInput = false,
	) => {
		const label: string = lodash.startCase(type)
		return (
			<Controller
				control={control}
				render={({ onChange, value }) => (
					<View style={styles.inputText}>
						<TextInput
							mode='outlined'
							label={label}
							onChangeText={value => {
								onChange(value)
								if (type === InputType.username) {
									handleUserNameOnChange(value)
								}
							}}
							value={value}
							disabled={disabled}
							error={hasError}
							autoCapitalize='none'
							secureTextEntry={isPasswordInput}
						/>
						{hasError && <HelperText type='error'>This is required.</HelperText>}
					</View>
				)}
				name={type}
				rules={getRules(type)}
				defaultValue={defaultValue}
			/>
		)
	}

	const handleUserNameOnChange = (value: string) => {
		if (value !== user.username) {
			setShowPassword(true)
		} else {
			setShowPassword(false)
		}
	}

	const onSubmit = (formData: any) => {
		setLoading(true)

		const isUsernameUpdated: boolean = formData.username !== user.username
		const isDisplayNameUpdated: boolean = formData.displayName !== user.displayName
		let request: UpdateProfileRequest = {}

		if (isUsernameUpdated && isDisplayNameUpdated) {
			request = {
				newUsername: formData.username,
				password: formData.password,
				newDisplayName: formData.displayName,
			}
			updateUserProfile(request).then(async ({ data, error }) => {
				setLoading(false)
				if (data != undefined) {
					setSnackbarVisible(true)
				}
				setError(error)
			})
		} else if (isUsernameUpdated) {
			request = {
				newUsername: formData.username,
				password: formData.password,
			}
			updateUserName(request).then(async ({ data, error }) => {
				setLoading(false)
				if (data != undefined) {
					setSnackbarVisible(true)
				}
				setError(error)
			})
		} else if (isDisplayNameUpdated) {
			request = {
				newDisplayName: formData.displayName,
			}
			updateDisplayName(request).then(async ({ data, error }) => {
				setLoading(false)
				if (data != undefined) {
					setSnackbarVisible(true)
				}
				setError(error)
			})
		}
	}

	return (
		<>
			<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
				<SafeAreaView>
					<Title style={styles.title}>Update your information below</Title>

					{textInput(InputType.displayName, errors.displayName, user.displayName)}
					{textInput(InputType.username, errors.username, user.username)}
					{showPassword && textInput(InputType.password, errors.password, null, false, true)}

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
					{error && <Text style={globalStyles.error}>{error.message.replace(/\[\w+\]/g, '')}</Text>}
				</SafeAreaView>
			</ScrollView>
			<Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
				Profile updated successfully
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
	caption: {
		marginBottom: 10,
	},
	button: {
		marginTop: 20,
	},
	inputText: {
		marginTop: 10,
	},
})
