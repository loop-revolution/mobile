import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@react-navigation/native'
import { Appbar } from 'react-native-paper'
import { Platform, StyleSheet } from 'react-native'
import routes from './routes'
import { Login } from '../screens/auth/login'
import { Signup } from '../screens/auth/signup'
import { VerifyEmail } from '../screens/auth/verifyEmail'
import { ForgotPassword } from '../screens/auth/forgotPassword'
import colors from '../utils/colors'

const Stack = createStackNavigator()

export const LoginNavigator = () => {
	const theme = useTheme()

	return (
		<Stack.Navigator
			initialRouteName={routes.LOGIN}
			headerMode='screen'
			screenOptions={{
				header: ({ previous, navigation }: { previous: any; navigation: any }) => {
					// const { options } = scene.descriptor
					return (
						<Appbar.Header
							theme={theme}
							style={styles.navBar}
							statusBarHeight={Platform.OS === 'android' ? 0 : undefined}
						>
							{previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
							{/* <Appbar.Content title={options.headerTitle} titleStyle={styles.navBarTitle} /> */}
						</Appbar.Header>
					)
				},
			}}
		>
			<Stack.Screen name={routes.LOGIN} component={Login} options={{ headerTitle: 'Login' }} />
			<Stack.Screen name={routes.SIGNUP} component={Signup} options={{ headerTitle: 'Signup' }} />
			<Stack.Screen
				name={routes.FORGOT_PASSWORD}
				component={ForgotPassword}
				options={{ headerTitle: 'Forgot Password' }}
			/>
			<Stack.Screen name={routes.VERIFY_EMAIL} component={VerifyEmail} options={{ headerTitle: 'Verify Email' }} />
		</Stack.Navigator>
	)
}

const styles = StyleSheet.create({
	navBar: {
		backgroundColor: colors.white,
		elevation: 0, // remove shadow on Android
		shadowOpacity: 0,
	},
	navBarTitle: {
		fontSize: 18,
		fontWeight: '500',
	},
})
