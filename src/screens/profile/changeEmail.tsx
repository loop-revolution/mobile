import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, HelperText, Snackbar, TextInput, Title } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User } from '../../api/types'
import { globalStyles } from '../../utils/styles'
import lodash from 'lodash'
import { getRules, InputType } from '../../utils/validation'

// type UpdateEmailResult = { user: User }
// type UpdateEmailRequest = { newEmail: string }

export const ChangeEmail = ({ route }: { route: any }) => {
	const [isLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [showVerificationCode, setShowVerificationCode] = useState(false)
	const [disabledEmailFeild, SetDisabledEmailField] = useState(false)

	// TODO: Add update email Mutation
	// const [updateEmailResponse, updateEmail] = useMutation<UpdateEmailResult, UpdateEmailRequest>(UPDATE_EMAIL)

	const user: User = route.params?.user

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
		console.log(formData)
		SetDisabledEmailField(true)
		setShowVerificationCode(true)
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
						mode='contained'
						loading={isLoading}
						labelStyle={{ color: 'white' }}
					>
						Update
					</Button>
					{/* {updateEmailResponse.error && (
						<Text style={globalStyles.error}>{updateEmailResponse.error.message.replace(/\[\w+\]/g, '')}</Text>
					)} */}
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
