import { DefaultTheme as PaperTheme } from "react-native-paper"
import { DefaultTheme as NavigationTheme } from '@react-navigation/native'

export const DefaultPaperTheme = {
    ...PaperTheme,
    colors: {
        ...PaperTheme.colors,
        primary: '#466EFD',
        accent: '#EE6546',
        text: '#393939',
        error: '#DD3B2C'
    }
}

export const DefaultNavigationTheme = {
    ...NavigationTheme,
    colors: {
        ...NavigationTheme.colors,
        primary: '#2b2b2b',
        text: '#393939',
    },
}
