import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Headline, Caption, Button, TextInput, Text, HelperText, IconButton } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from 'urql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOGIN_MUTATION } from '../../api/gql'
import routes from '../../navigation/routes'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getRules, InputType } from '../../utils/validation'
import { UserContext } from '../../context/userContext'
import lodash from 'lodash'
import colors from '../../utils/colors'

type LoginResult = { login: { token: string } }
type LoginRequest = { username: string; password: string }

export const Login = ({ navigation }: { navigation: any }) => {
	const [isLoading, setLoading] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [showPassword, setShowPassword] = useState(false)
	const [loginResult, login] = useMutation<LoginResult, LoginRequest>(LOGIN_MUTATION)
	const { setUserLoggedIn } = useContext(UserContext)

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

	const onSubmit = (data: LoginRequest) => {
		setLoading(true)
		login(data).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				const token = data.login.token
				console.log(token)
				await AsyncStorage.setItem('token', token)
				setUserLoggedIn(true, true)
				navigation.replace(routes.HOME)
			}
		})
	}

	return (
		<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
			<SafeAreaView>
				<Headline style={styles.headline}>Login</Headline>
				<Caption style={styles.caption}>Login to start boosting your productivity!</Caption>

				{textInput(InputType.username, errors.username)}
				{textInput(InputType.password, errors.password, true)}

				<Button
					onPress={handleSubmit(onSubmit)}
					contentStyle={globalStyles.buttonContentStyle}
					mode='contained'
					loading={isLoading}
					labelStyle={{ color: 'white' }}
				>
					Login
				</Button>
				<View style={styles.signupContainer}>
					<Text style={styles.signUpLabel}>Don't have an account?</Text>
					<Button
						labelStyle={styles.signUpLabel}
						onPress={() => {
							navigation.push(routes.SIGNUP)
						}}
					>
						Sign Up
					</Button>
				</View>
				<View style={styles.signupContainer}>
					<Button
						labelStyle={styles.signUpLabel}
						onPress={() => {
							navigation.push(routes.FORGOT_PASSWORD)
						}}
					>
						Forgot Password?
					</Button>
				</View>
				{loginResult.error && (
					<Text style={styles.serverError}>{loginResult.error.message.replace(/\[\w+\]/g, '')}</Text>
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
	caption: {
		alignSelf: 'center',
		marginBottom: 30,
		fontSize: 16,
		fontWeight: '500',
		color: colors.subtext,
		textAlign: 'center',
	},
	button: {
		marginTop: 20,
	},
	inputText: {
		marginBottom: 20,
	},
	serverError: {
		color: '#DD3B2C',
		textAlign: 'center',
	},
	signupContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
	},
	signUpLabel: {
		textTransform: 'capitalize',
		fontWeight: '500',
		fontSize: 14,
	},
})
