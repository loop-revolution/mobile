import { DefaultTheme as PaperTheme } from "react-native-paper"
import { DarkTheme as NavigationTheme } from '@react-navigation/native'
import colors from "./colors"

export const DefaultPaperTheme = {
    ...PaperTheme,
    colors: {
        ...PaperTheme.colors,
        primary: colors.primary,
        accent: colors.accent,
        text: colors.text,
        error: colors.error
    }
}

export const DefaultNavigationTheme = {
    ...NavigationTheme,
    colors: {
        ...NavigationTheme.colors,
        primary: colors.navigationPrimary,
        background: colors.background,
        card: colors.navigationPrimary
    },
}
