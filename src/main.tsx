import React from 'react'
import {
    DefaultTheme,
    Provider as PaperProvider
} from 'react-native-paper'

import { RootNavigator } from './navigation/rootNavigator'
import { Provider as UrqlProvider } from 'urql'
import { client } from './api/client'

export const Main = () => {
    return (
        <UrqlProvider value={client}>
            <PaperProvider theme={DefaultTheme}>
                <RootNavigator />
            </PaperProvider>
        </UrqlProvider>
    )
}
