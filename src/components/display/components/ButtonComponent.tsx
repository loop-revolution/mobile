import React from 'react'
import { ButtonArgs, TextArgs } from "display-api"
import { Button, Text, Title } from "react-native-paper"
import { StyleSheet } from 'react-native'
import colors from '../../../utils/colors'
import { globalStyles } from '../../../utils/styles'
import { useNavigation } from '@react-navigation/native'
import routes from '../../../navigation/routes'

export const ButtonComponent = ({ text, interact }: ButtonArgs) => {

    const navigation = useNavigation()

    const onConfirm = () => {
        if (interact?.search) {
            navigation.navigate(routes.SEARCH, { searchComponent: interact?.search })
        }
    }

    return (
        <Button
            onPress={onConfirm}
            style={styles.button}
            contentStyle={globalStyles.buttonContentStyle}
            mode="contained"
            labelStyle={{ color: 'white' }}>
            {text}
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 5
    },
})