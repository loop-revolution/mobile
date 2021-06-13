import { CreationObject } from 'display-api'
import React, { useContext, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ActivityIndicator, Button } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'
import { BLOCK_CREATION_DISPLAY, CREATE_BLOCK } from '../api/gql'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import { populateTemplate } from '../components/display/method'
import { UserContext } from '../context/userContext'
import routes from '../navigation/routes'
import colors from '../utils/colors'
import { globalStyles } from '../utils/styles'

export const CreateBlock = ({ route, navigation }: { route: any; navigation: any }) => {
	type CreationDisplayRequest = { type: string }
	type CreationDisplayResult = { blockCreationDisplay: string }

	type CreateBlockRequest = { type: string; input: string }
	type CreateBlockResult = { createBlock: { id: number } }

	const { user } = useContext(UserContext)

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
		// Navigate to block page if it's not the root block else home
		if (user?.root?.id) {
			navigation.navigate(routes.BLOCK_PAGE, { blockId: createBlockResult.data?.createBlock?.id })
		} else {
			navigation.navigate(routes.HOME)
		}
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
		<KeyboardAwareScrollView style={styles.scrollViewContent}>
			{creationObject ? (
				<>
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
				</>
			) : (
				<ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
			)}
		</KeyboardAwareScrollView>
	)
}

const styles = StyleSheet.create({
	scrollViewContent: {
		paddingHorizontal: 20,
		marginTop: 20,
	},
	headline: {
		marginTop: 0,
	},
	caption: {
		marginBottom: 10,
	},
	button: {
		marginVertical: 20,
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
