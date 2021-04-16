import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Headline, Button, TextInput, Text, HelperText, IconButton } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from 'urql'
import { SIGNUP_MUTATION } from '../../api/gql'
import routes from '../../navigation/routes'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getRules, InputType } from '../../utils/validation'
import lodash from 'lodash'
import colors from '../../utils/colors'

type SignupResult = { signup: { sessionCode: string } }
type SignupRequest = { displayName: string; username: string; password: string; email: string }

export const Signup = ({ navigation }: { navigation: any }) => {
	const [isLoading, setLoading] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [showPassword, setShowPassword] = useState(false)
	const [signupResult, signup] = useMutation<SignupResult, SignupRequest>(SIGNUP_MUTATION)

	const textInput = (type: InputType, hasError: boolean, secureTextEntry: boolean = false) => {
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
							secureTextEntry={secureTextEntry ? !showPassword : false}
							error={hasError}
							autoCapitalize='none'
							right={
								type === InputType.password && (
									<TextInput.Icon
										name={() => (
											<IconButton
												onPress={() => setShowPassword(!showPassword)}
												color={colors.subtext}
												style={{ marginRight: 10 }}
												icon={showPassword ? 'eye' : 'eye-off'}
												size={25}
											/>
										)}
									/>
								)
							}
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

	const onSubmit = (formData: SignupRequest) => {
		setLoading(true)
		signup(formData).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				navigation.push(routes.VERIFY_EMAIL, {
					sessionCode: data.signup.sessionCode,
					username: formData.username,
				})
			}
		})
	}

	return (
		<ScrollView bounces={false} contentContainerStyle={[styles.scrollViewContent]}>
			<SafeAreaView>
				<Headline style={styles.headline}>Sign Up</Headline>

				{textInput(InputType.displayName, errors.displayName)}
				{textInput(InputType.username, errors.username)}
				{textInput(InputType.password, errors.password, true)}
				{textInput(InputType.email, errors.email)}

				<Button
					onPress={handleSubmit(onSubmit)}
					style={styles.button}
					contentStyle={globalStyles.buttonContentStyle}
					mode='contained'
					loading={isLoading}
					labelStyle={styles.buttonLabelStyle}
				>
					Create Free Account
				</Button>
				<View style={styles.signInContainer}>
					<Text style={styles.signInLabel}>Already have an account?</Text>
					<Button
						labelStyle={styles.signInLabel}
						onPress={() => {
							navigation.goBack()
						}}
					>
						Sign In
					</Button>
				</View>
				{signupResult.error && (
					<Text style={globalStyles.error}>{signupResult.error.message.replace(/\[\w+\]/g, '')}</Text>
				)}
			</SafeAreaView>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollViewContent: {
		flex: 1,
		paddingHorizontal: 30,
		backgroundColor: colors.white,
	},
	headline: {
		marginVertical: 10,
		fontWeight: '500',
		fontSize: 32,
		alignSelf: 'center',
		color: '#323C47',
	},
	button: {
		marginTop: 20,
	},
	buttonLabelStyle: {
		color: 'white',
		textTransform: 'capitalize',
		fontWeight: '600',
		fontSize: 16,
		lineHeight: 24,
	},
	inputText: {
		marginTop: 10,
	},
	signInContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
	},
	signInLabel: {
		textTransform: 'capitalize',
		fontWeight: '500',
		fontSize: 14,
	},
})
