import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'

import { RootNavigator } from './navigation/rootNavigator'
import { Provider as UrqlProvider } from 'urql'
import { client } from './api/client'
import { DefaultPaperTheme } from './utils/theme'

export const Main = () => {
    return (
        <UrqlProvider value={client}>
            <PaperProvider theme={DefaultPaperTheme}>
                <RootNavigator />
            </PaperProvider>
        </UrqlProvider>
    )
}
