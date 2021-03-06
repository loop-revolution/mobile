import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, TextInput, Text, HelperText, Title, Snackbar } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import { useMutation } from 'urql'
import { UPDATE_DISPLAY_NAME } from '../../api/gql'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getRules, InputType } from '../../utils/validation'
import lodash from 'lodash'

type UpdateResult = { signup: { sessionCode: string } }
type UpdateRequest = { newDisplayName: string }

export const EditProfile = ({ route }: { route: any }) => {
	const [isLoading, setLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { control, handleSubmit, errors } = useForm()
	const [updateUserResponse, updateUser] = useMutation<UpdateResult, UpdateRequest>(UPDATE_DISPLAY_NAME)

	const user = route.params?.user

	const textInput = (type: InputType, hasError: boolean, defaultValue: string, disabled: boolean = false) => {
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
							disabled={disabled}
							error={hasError}
							autoCapitalize='none'
						/>
						{hasError && <HelperText type='error'>This is required.</HelperText>}
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
		const request: UpdateRequest = {
			newDisplayName: formData.displayName,
		}
		updateUser(request).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				setSnackbarVisible(true)
			}
		})
	}

	return (
		<>
			<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
				<SafeAreaView>
					<Title style={styles.title}>Update your information below</Title>

					{textInput(InputType.displayName, errors.displayName, user.displayName)}
					{textInput(InputType.username, errors.username, user.username, true)}

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
					{updateUserResponse.error && (
						<Text style={globalStyles.error}>{updateUserResponse.error.message.replace(/\[\w+\]/g, '')}</Text>
					)}
				</SafeAreaView>
			</ScrollView>
			<Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
				Profile updated successfully
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
