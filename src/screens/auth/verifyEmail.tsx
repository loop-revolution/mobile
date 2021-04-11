import React, { useContext, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Headline, Caption, TextInput, Text, HelperText } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from 'urql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VERIFY_EMAIL_MUTATION } from '../../api/gql'
import routes from '../../navigation/routes'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getRules, InputType } from '../../utils/validation'
import { UserContext } from '../../context/userContext'
import CodeInput from 'react-native-confirmation-code-input';
import colors from '../../utils/colors'

type VerifyEmailResult = { confirmEmail: { token: string } }
type VerifyEmailRequest = { username: string; sessionCode: string; verificationCode: string }

export const VerifyEmail = ({ route, navigation }: { route: any; navigation: any }) => {
	const [isLoading, setLoading] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [verifyEmailResult, verifyEmail] = useMutation<VerifyEmailResult, VerifyEmailRequest>(VERIFY_EMAIL_MUTATION)
	const { setUserLoggedIn } = useContext(UserContext)

	const textInput = (type: InputType, hasError: boolean) => {
		return (
			<Controller
				control={control}
				render={({ onChange, value }) => (
					<View style={styles.inputText}>
						<TextInput
							mode='outlined'
							label='Verification Code'
							onChangeText={value => onChange(value)}
							value={value}
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

	const onSubmit = (code: string) => {
		const request: VerifyEmailRequest = {
			username: route.params?.username,
			sessionCode: route.params?.sessionCode,
			verificationCode: code
		}
		setLoading(true)
		verifyEmail(request).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				const token = data.confirmEmail.token
				await AsyncStorage.setItem('token', token)
				setUserLoggedIn(true, true)
				navigation.replace(routes.HOME)
			}
		})
	}

	return (
		<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
			<SafeAreaView>
				<Headline style={styles.headline}>Verify Email</Headline>
				<Caption style={styles.caption}>Please enter verificaton code sent to your email</Caption>

				<View style={styles.codeInputContainer}>
					<CodeInput
						keyboardType='number-pad'
						autoFocus={true}
						codeLength={6}
						activeColor={colors.primary}
						inactiveColor={colors.border}
						ignoreCase={true}
						inputPosition='full-width'
						size={50}
						cellBorderWidth={2}
						codeInputStyle={styles.codeInput}
						onFulfill={(code: string) => onSubmit(code)}
					/>
				</View>
				{verifyEmailResult.error && (
					<Text style={globalStyles.error}>{verifyEmailResult.error.message.replace(/\[\w+\]/g, '')}</Text>
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
		marginTop: 0,
	},
	caption: {
		marginBottom: 10,
	},
	button: {
		marginTop: 20,
	},
	inputText: {
		marginBottom: 20,
	},
	codeInputContainer: {
		paddingBottom: 50
	},
	codeInput: {
		height: 60,
		borderRadius: 2,
		fontSize: 18,
		color: colors.text
	}
})
