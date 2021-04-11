import React, { useContext, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import lodash from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { Button, Caption, Headline, HelperText, TextInput, Text } from 'react-native-paper'
import { getRules, InputType } from '../../utils/validation'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyles } from '../../utils/styles'
import { FORGOT_PASSWORD, CONFIRM_FORGOT_PASSWORD } from '../../api/gql'
import { useMutation } from 'urql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../../context/userContext'
import routes from '../../navigation/routes'

type ForgotPasswordResult = { forgotPassword: { sessionCode: string } }
type ForgotPasswordRequest = { username: string }

type ConfirmForgotPasswordResult = { confirmForgotPassword: { token: string } }
type ConfirmForgotPasswordRequest = {
	username: string
	sessionCode: string
	verificationCode: string
	newPassword: string
}

export const ForgotPassword = ({ navigation }: { navigation: any }) => {
	const { control, handleSubmit, errors } = useForm()
	const [isLoading, setLoading] = useState(false)
	const [showVerificationCode, setShowVerificationCode] = useState(false)
	const [sessionCode, setSessionCode] = useState('')
	const [readOnlyUserNameField, setReadOnlyUserNameField] = useState(false)
	const { setUserLoggedIn } = useContext(UserContext)

	const [forgotPasswordResult, forgotPassword] = useMutation<ForgotPasswordResult, ForgotPasswordRequest>(
		FORGOT_PASSWORD,
	)
	const [confirmForgotPasswordResult, confirmForgotPassword] = useMutation<
		ConfirmForgotPasswordResult,
		ConfirmForgotPasswordRequest
	>(CONFIRM_FORGOT_PASSWORD)

	const textInput = (
		type: InputType,
		hasError: boolean,
		secureTextEntry: boolean = false,
		readonly: boolean = false,
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
							onChangeText={value => onChange(value)}
							value={value}
							secureTextEntry={secureTextEntry}
							error={hasError}
							editable={!readonly}
							autoCapitalize='none'
						/>
						{hasError && <HelperText type='error'>This is required.</HelperText>}
					</View>
				)}
				name={type}
				rules={getRules(type)}
				defaultValue=''
			/>
		)
	}

	const onSubmit = (formData: any) => {
		setLoading(true)
		if (!formData.verificationCode) {
			const forgotPasswordRequest: ForgotPasswordRequest = { username: formData.username }
			forgotPassword(forgotPasswordRequest).then(({ data }) => {
				setLoading(false)
				if (data != undefined) {
					const code = data.forgotPassword.sessionCode
					setReadOnlyUserNameField(true)
					setSessionCode(code)
					setShowVerificationCode(true)
				}
			})
		} else {
			const request: ConfirmForgotPasswordRequest = {
				username: formData.username,
				newPassword: formData.newPassword,
				sessionCode: sessionCode,
				verificationCode: formData.verificationCode,
			}
			confirmForgotPassword(request).then(async ({ data }) => {
				setLoading(false)
				if (data != undefined) {
					const token = data.confirmForgotPassword.token
					await AsyncStorage.setItem('token', token)
					setUserLoggedIn(true, true)
					navigation.replace(routes.HOME)
				}
			})
		}
	}

	return (
		<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
			<SafeAreaView>
				<Headline style={styles.headline}>Forgot Password</Headline>
				<Caption style={styles.caption}>Please enter username to continue</Caption>
				{textInput(InputType.username, errors.username, false, readOnlyUserNameField)}
				{showVerificationCode && (
					<View>
						{textInput(InputType.newPassword, errors.newPassword, true)}
						{textInput(InputType.verificationCode, errors.verificationCode)}
					</View>
				)}
				<Button
					onPress={handleSubmit(onSubmit)}
					style={styles.button}
					contentStyle={globalStyles.buttonContentStyle}
					mode='contained'
					loading={isLoading}
					labelStyle={{ color: 'white' }}
				>
					{showVerificationCode ? 'Verify' : 'Submit'}
				</Button>
				{forgotPasswordResult.error && (
					<Text style={styles.serverError}>{forgotPasswordResult.error.message.replace(/\[\w+\]/g, '')}</Text>
				)}
				{confirmForgotPasswordResult.error && (
					<Text style={styles.serverError}>{confirmForgotPasswordResult.error.message.replace(/\[\w+\]/g, '')}</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollViewContent: {
		flex: 1,
		paddingHorizontal: 30,
	},
	headline: {
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
	serverError: {
		color: '#DD3B2C',
		textAlign: 'center',
	},
})
