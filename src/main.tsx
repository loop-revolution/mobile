import React, { useEffect, useState, useMemo, useContext } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { RootNavigator } from './navigation/rootNavigator'
import { Provider as UrqlProvider } from 'urql'
import { createAPIClient } from './api/client'
import { DefaultPaperTheme } from './utils/theme'
import { StatusBar } from 'react-native'
import { UserContext } from './context/userContext'
import { User } from './api/types';
import { WHO_AM_I } from './api/gql'

export const Main = () => {

    const [user, setStateUser] = useState<User>(null)
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        async function getUser() {
            type UserQueryResult = { whoami: User }
            const userResult = await client.query<UserQueryResult>(WHO_AM_I).toPromise()
            if (userResult.data?.whoami?.username) {
                setStateUser(userResult.data?.whoami)
            }
        }

        if (isLoggedIn) {
            getUser()
        }
    }, [isLoggedIn])

    // Setting the user logged in state in the UserContext
    const setUserLoggedIn = (isUserLoggedIn: boolean) => {
        setLoggedIn(isUserLoggedIn)
        if (isUserLoggedIn === false) {
            setStateUser(null)
        }
    }

    const userObject = useMemo(
        () => ({
            user,
            isUserLoggedIn: isLoggedIn,
            setUserLoggedIn
        }),
        [user, isLoggedIn]
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
                    <StatusBar barStyle='light-content' />
                    <RootNavigator />
                </UserContext.Provider>
            </PaperProvider>
        </UrqlProvider>
    )
}
