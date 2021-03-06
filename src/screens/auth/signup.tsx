import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Headline, Caption, Button, TextInput, Text, HelperText } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from 'urql'
import { SIGNUP_MUTATION } from '../../api/gql'
import routes from '../../navigation/routes'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getRules, InputType } from '../../utils/validation'
import lodash from 'lodash'

type SignupResult = { signup: { sessionCode: string } }
type SignupRequest = { displayName: string; username: string; password: string; email: string }

export const Signup = ({ navigation }: { navigation: any }) => {
	const [isLoading, setLoading] = useState(false)
	const { control, handleSubmit, errors } = useForm()
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
							secureTextEntry={secureTextEntry}
							error={hasError}
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
		<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
			<SafeAreaView>
				<Headline style={styles.headline}>Sign Up</Headline>
				<Caption style={styles.caption}>Please register to continue</Caption>

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
					labelStyle={{ color: 'white' }}
				>
					Sign Up
				</Button>
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
})
