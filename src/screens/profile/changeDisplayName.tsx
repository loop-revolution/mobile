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
import { UPDATE_DISPLAY_NAME } from '../../api/gql'
import { useMutation } from 'urql'
import { UserContext } from '../../context/userContext'
import routes from '../../navigation/routes'

type UpdateDisplayNameResult = { user: User }
type UpdateDisplayNameRequest = { newDisplayName: string }

export const ChangeDisplayName = ({ route, navigation }: { route: any; navigation: any }) => {
	const currentUser = useContext(UserContext)
	const [isLoading, setLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [updateDisplayNameResponse, updateDisplayName] = useMutation<UpdateDisplayNameResult, UpdateDisplayNameRequest>(
		UPDATE_DISPLAY_NAME,
	)

	const user = route.params?.user

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
		setLoading(true)
		const request: UpdateDisplayNameRequest = {
			newDisplayName: formData.displayName,
		}
		updateDisplayName(request).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				// setSnackbarVisible(true)
				user.displayName = formData.displayName
				currentUser.user.displayName = formData.displayName
				navigation.navigate(routes.EDIT_PROFILE, {
					user: { ...user, displayName: formData.displayName },
				})
			}
		})
	}

	return (
		<>
			<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
				<SafeAreaView>
					<Title style={styles.title}>Update your display name below</Title>
					{textInput(InputType.displayName, errors.displayName, user.displayName)}
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
					{updateDisplayNameResponse.error && (
						<Text style={globalStyles.error}>{updateDisplayNameResponse.error.message.replace(/\[\w+\]/g, '')}</Text>
					)}
				</SafeAreaView>
			</ScrollView>
			<Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
				Display Name updated successfully
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
