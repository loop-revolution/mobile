import { CreationObject } from 'display-api'
import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator, Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMutation, useQuery } from 'urql'
import { BLOCK_CREATION_DISPLAY, CREATE_BLOCK } from '../api/gql'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import { populateTemplate } from '../components/display/method'
import colors from '../utils/colors'
import { globalStyles } from '../utils/styles'

export const CreateBlock = ({ route, navigation }: { route: any; navigation: any }) => {
	type CreationDisplayRequest = { type: string }
	type CreationDisplayResult = { blockCreationDisplay: string }

	type CreateBlockRequest = { type: string; input: string }
	type CreateBlockResult = { createBlock: { id: number } }

	const [isLoading, setLoading] = useState(false)
	const type = route.params.name

	const [displayResult] = useQuery<CreationDisplayResult, CreationDisplayRequest>({
		query: BLOCK_CREATION_DISPLAY,
		variables: { type },
	})
	const creationObject: CreationObject = displayResult.data?.blockCreationDisplay
		? JSON.parse(displayResult.data.blockCreationDisplay)
		: null

	const [createBlockResult, createBlock] = useMutation<CreateBlockResult, CreateBlockRequest>(CREATE_BLOCK)
	if (createBlockResult.data?.createBlock?.id) {
		navigation.pop()
	} else if (createBlockResult.error) {
		setLoading(false)
	}

	const createAction = () => {
		const input = populateTemplate(creationObject.input_template)
		const request: CreateBlockRequest = {
			type,
			input,
		}
		setLoading(true)
		createBlock(request)
	}

	return (
		<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
			<SafeAreaView>
				{creationObject ? (
					<View>
						<ComponentDelegate component={creationObject.header_component} />
						<ComponentDelegate component={creationObject.main_component} />
						<Button
							onPress={() => createAction()}
							loading={isLoading}
							style={styles.button}
							contentStyle={globalStyles.buttonContentStyle}
							mode='contained'
							labelStyle={{ color: 'white' }}
						>
							Create Block
						</Button>
						{createBlockResult.error && (
							<Text style={globalStyles.error}>{createBlockResult.error.message.replace(/\[\w+\]/g, '')}</Text>
						)}
					</View>
				) : (
					<ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
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
	signupContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
})
