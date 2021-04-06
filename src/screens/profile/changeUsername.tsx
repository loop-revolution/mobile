import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, HelperText, Snackbar, Text, TextInput, Title } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User } from '../../api/types'
import { globalStyles } from '../../utils/styles'
import lodash from 'lodash'
import { getRules, InputType } from '../../utils/validation'
import { UPDATE_USER_NAME } from '../../api/gql'
import { useMutation } from 'urql'
import { UserContext } from '../../context/userContext'
import routes from '../../navigation/routes'

type UpdateUsernameResponse = { updateUsername: User }
type UpdateUsernameRequest = { newUsername?: string; password?: string }

export const ChangeUsername = ({ route, navigation }: { route: any; navigation: any }) => {
	const currentUser = useContext(UserContext)

	const [isLoading, setLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [showPassword, setShowPassword] = useState(false)
	const [updateUsernameResponse, updateUserName] = useMutation<UpdateUsernameResponse, UpdateUsernameRequest>(
		UPDATE_USER_NAME,
	)

	const user: User = route.params?.user

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
									setShowPassword(value !== user.username)
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

	const onSubmit = (formData: any) => {
		setLoading(true)
		const request: UpdateUsernameRequest = {
			newUsername: formData.username,
			password: formData.password,
		}
		updateUserName(request).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				// setSnackbarVisible(true)
				currentUser.user = data.updateUsername
				navigation.navigate(routes.EDIT_PROFILE, { user: data.updateUsername })
			}
		})
	}

	return (
		<>
			<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
				<SafeAreaView>
					<Title style={styles.title}>Update your username below</Title>
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
					{updateUsernameResponse.error && (
						<Text style={globalStyles.error}>{updateUsernameResponse.error.message.replace(/\[\w+\]/g, '')}</Text>
					)}
				</SafeAreaView>
			</ScrollView>
			<Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
				Username updated successfully
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
