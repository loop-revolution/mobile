import { useState } from 'react'
import { InputArgs } from "display-api"
import { Button, TextInput } from "react-native-paper"
import { StyleSheet, View } from 'react-native'
import { globalStyles } from '../../../utils/styles'

export const InputComponent = ({ initial_value, name, label, type, confirm_cancel }: InputArgs) => {

    const [value, setValue] = useState(initial_value)

    return (
        <View>
            <TextInput
                mode='outlined'
                multiline={true}
                label={label}
                placeholder={label}
                onChangeText={value => setValue(value)}
                value={value}
                autoCapitalize="none" />

            {confirm_cancel?.enabled && value !== initial_value &&
                <View style={styles.buttonsContainer}>
                    <Button
                        onPress={() => {}}
                        contentStyle={globalStyles.buttonContentStyle}
                        mode="contained"
                        labelStyle={{ color: 'white' }}>
                        Confirm Change
                    </Button>
                    <Button
                        onPress={() => {}}
                        contentStyle={globalStyles.buttonContentStyle}
                        mode="contained"
                        labelStyle={{ color: 'white' }}>
                        Cancel Change
                    </Button>
                </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        margin: 10
    }
})