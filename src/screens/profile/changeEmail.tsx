import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, HelperText, Snackbar, TextInput, Title, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User } from '../../api/types'
import { globalStyles } from '../../utils/styles'
import lodash from 'lodash'
import { getRules, InputType } from '../../utils/validation'
import { useMutation } from 'urql'
import { CONFIRM_UPDATE_EMAIL, UPDATE_EMAIL } from '../../api/gql'
import routes from '../../navigation/routes'
import { UserContext } from '../../context/userContext'

type UpdateEmailResult = { updateEmail: { sessionCode: string } }
type UpdateEmailRequest = { newEmail: string }

type ConfirmUpdateEmailResult = { confirmUpdateEmail: User }
type ConfirmUpdateEmailRequest = { sessionCode: string; verificationCode: string }

export const ChangeEmail = ({ route, navigation }: { route: any; navigation: any }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [showVerificationCode, setShowVerificationCode] = useState(false)
	const [disabledEmailFeild, setDisabledEmailField] = useState(false)
	const [disabledSubmitButton, setDisabledSubmitButton] = useState(true)
	const [sessionCode, setSessionCode] = useState('')

	const [updateEmailResponse, updateEmail] = useMutation<UpdateEmailResult, UpdateEmailRequest>(UPDATE_EMAIL)
	const [confirmUpdateEmailResult, confirmUpdateEmail] = useMutation<
		ConfirmUpdateEmailResult,
		ConfirmUpdateEmailRequest
	>(CONFIRM_UPDATE_EMAIL)

	const user: User = route.params?.user
	const currentUser = useContext(UserContext)

	const textInput = (type: InputType, errors: any, defaultValue: string = '', disabled: boolean = false) => {
		return (
			<Controller
				control={control}
				render={({ onChange, value }) => (
					<View style={styles.inputText}>
						<TextInput
							mode='outlined'
							label={lodash.startCase(type)}
							onChangeText={value => {
								onChange(value)
								setDisabledSubmitButton(value === user.email)
							}}
							value={value}
							disabled={disabled}
							error={errors}
							autoCapitalize='none'
						/>

						{errors && (
							<HelperText type='error'>{errors.message != '' ? errors.message : 'This is required.'}</HelperText>
						)}
					</View>
				)}
				name={type}
				rules={getRules(type)}
				defaultValue={defaultValue}
			/>
		)
	}

	const onSubmit = (formData: any) => {
		setIsLoading(true)
		if (formData.email) {
			const request: UpdateEmailRequest = { newEmail: formData.email }
			updateEmail(request).then(({ data }) => {
				setIsLoading(false)
				if (data != undefined) {
					const code = data.updateEmail.sessionCode
					setSessionCode(code)
					setDisabledEmailField(true)
					setShowVerificationCode(true)
				}
			})
		}
		if (formData.verificationCode) {
			const request: ConfirmUpdateEmailRequest = {
				sessionCode: sessionCode,
				verificationCode: formData.verificationCode,
			}
			confirmUpdateEmail(request).then(({ data }) => {
				setIsLoading(false)
				if (data != undefined) {
					currentUser.user = data.confirmUpdateEmail
					navigation.navigate(routes.EDIT_PROFILE, { user: data.confirmUpdateEmail })
				}
			})
		}
	}

	return (
		<>
			<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
				<SafeAreaView>
					<Title style={styles.title}>Update your email below</Title>
					{textInput(InputType.email, errors.email, user?.email, disabledEmailFeild)}
					{showVerificationCode && textInput(InputType.verificationCode, errors.verificationCode, null, false, true)}

					<Button
						onPress={handleSubmit(onSubmit)}
						style={styles.button}
						contentStyle={globalStyles.buttonContentStyle}
						disabled={disabledSubmitButton}
						mode='contained'
						loading={isLoading}
						labelStyle={{ color: 'white' }}
					>
						Update
					</Button>
					{updateEmailResponse.error && (
						<Text style={globalStyles.error}>{updateEmailResponse.error.message.replace(/\[\w+\]/g, '')}</Text>
					)}
					{confirmUpdateEmailResult.error && (
						<Text style={globalStyles.error}>{confirmUpdateEmailResult.error.message.replace(/\[\w+\]/g, '')}</Text>
					)}
				</SafeAreaView>
			</ScrollView>
			<Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
				Email updated successfully
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
