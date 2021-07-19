import React, { useEffect, useState, useMemo } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { RootNavigator } from './navigation/rootNavigator'
import { Provider as UrqlProvider } from 'urql'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { createAPIClient } from './api/client'
import { DefaultPaperTheme } from './utils/theme'
import { StatusBar } from 'react-native'
import { UserContext } from './context/userContext'
import { User } from './api/types'
import { ADD_EXPO_TOKEN, WHO_AM_I } from './api/gql'
import { registerForPushNotificationsAsync } from './utils/helper'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const Main = () => {
	const [user, setStateUser] = useState<User>(null)
	const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
	const [pushToken, setPushToken] = useState<string>(null)

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setPushToken(token))
	}, [])

	useEffect(() => {
		async function getUser() {
			type UserQueryResult = { whoami: User }
			const userResult = await client.query<UserQueryResult>(WHO_AM_I).toPromise()
			if (userResult.data?.whoami?.username) {
				setStateUser(userResult.data?.whoami)
			} else {
				await AsyncStorage.removeItem('token')
				setStateUser(null)
				setLoggedIn(false)
			}
		}

		if (isLoggedIn) {
			getUser()
		}
	}, [isLoggedIn])

	function addExpoToken() {
		type AddExpoTokenQueryResult = { addExpoTokens: { id: String } }
		type AddExpoTokenQueryRequest = { token: String }
		client
			.mutation<AddExpoTokenQueryResult, AddExpoTokenQueryRequest>(ADD_EXPO_TOKEN, { token: pushToken })
			.toPromise()
	}

	// Setting the user logged in state in the UserContext
	const setUserLoggedIn = (isUserLoggedIn: boolean, addPushToken: boolean = false) => {
		setLoggedIn(isUserLoggedIn)
		if (isUserLoggedIn === false) {
			setStateUser(null)
		}

		if (addPushToken && pushToken && isUserLoggedIn) {
			addExpoToken()
		}
	}

	const userObject = useMemo(
		() => ({
			user,
			isUserLoggedIn: isLoggedIn,
			setUserLoggedIn,
		}),
		[user, isLoggedIn],
	)

	const client = useMemo(() => {
		if (isLoggedIn === null) {
			return null
		}
		return createAPIClient()
	}, [isLoggedIn])

	if (!client) {
		return null
	}

	return (
		<UrqlProvider value={client}>
			<PaperProvider theme={DefaultPaperTheme}>
				<UserContext.Provider value={userObject}>
					<ActionSheetProvider>
						<>
							<StatusBar barStyle='light-content' />
							<RootNavigator />
						</>
					</ActionSheetProvider>
				</UserContext.Provider>
			</PaperProvider>
		</UrqlProvider>
	)
}
