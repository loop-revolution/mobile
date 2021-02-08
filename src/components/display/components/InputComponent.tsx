import React, { useState } from 'react'
import { InputArgs } from "display-api"
import { Button, TextInput } from "react-native-paper"
import { StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { blockMethod, setMethodVariable } from '../method'

export const InputComponent = ({ initial_value, name, label, type, confirm_cancel }: InputArgs) => {

    const [value, setValue] = useState<string>(initial_value)
    const [error, setError] = useState<string>(null)

    const onChange = (value: string) => {
        setValue(value)
        name && setMethodVariable(name, value)
    }

    const onConfirm = async () => {
        const res = await blockMethod(confirm_cancel.on_confirm.method)
        if (res.error) {
            setError(res.error.message.replace(/\[\w+\]/g, ""))
        }
    }

    const onCancel = () => {
        setValue(initial_value)
    }

    return (
        <View>
            <TextInput
                mode='outlined'
                style={styles.input}
                multiline={true}
                label={label}
                placeholder={label}
                onChangeText={value => onChange(value)}
                value={value}
                autoCapitalize="none" />
            {confirm_cancel?.enabled && value !== initial_value &&
                <View style={styles.buttonsContainer}>
                    <Button
                        onPress={() => onConfirm()}
                        contentStyle={globalStyles.buttonContentStyle}
                        mode="contained"
                        labelStyle={{ color: 'white' }}>
                        Confirm Change
                    </Button>
                    <Button
                        onPress={() => onCancel()}
                        contentStyle={globalStyles.buttonContentStyle}
                        mode="contained"
                        labelStyle={{ color: 'white' }}>
                        Cancel Change
                    </Button>
                </View>}
            {error && <Text style={globalStyles.error}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        margin: 10
    },
    input: {
        marginTop: 10
    }
})