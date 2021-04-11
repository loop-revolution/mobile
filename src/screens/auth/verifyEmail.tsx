import React, { useContext } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Headline, Caption, Text } from 'react-native-paper'
import { useMutation } from 'urql'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VERIFY_EMAIL_MUTATION } from '../../api/gql'
import routes from '../../navigation/routes'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { UserContext } from '../../context/userContext'
import CodeInput from 'react-native-confirmation-code-input'
import colors from '../../utils/colors'

type VerifyEmailResult = { confirmEmail: { token: string } }
type VerifyEmailRequest = { username: string; sessionCode: string; verificationCode: string }

export const VerifyEmail = ({ route, navigation }: { route: any; navigation: any }) => {
	const [verifyEmailResult, verifyEmail] = useMutation<VerifyEmailResult, VerifyEmailRequest>(VERIFY_EMAIL_MUTATION)
	const { setUserLoggedIn } = useContext(UserContext)

	const onSubmit = (code: string) => {
		const request: VerifyEmailRequest = {
			username: route.params?.username,
			sessionCode: route.params?.sessionCode,
			verificationCode: code,
		}
		verifyEmail(request).then(async ({ data }) => {
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
	codeInputContainer: {
		paddingBottom: 60,
	},
	codeInput: {
		height: 60,
		borderRadius: 2,
		fontSize: 18,
		color: colors.text,
	},
})
