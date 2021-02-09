import React, { useEffect, useState } from 'react'
import { InputArgs, MethodObject } from "display-api"
import { Button, TextInput } from "react-native-paper"
import { StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { populateTemplate, setMethodVariable } from '../method'
import { BLOCK_METHOD_MUTATION } from '../../../api/gql'
import { useMutation } from 'urql'

export const InputComponent = ({ initial_value, name, label, type, confirm_cancel }: InputArgs) => {

    const [value, setValue] = useState<string>(initial_value)
    const [error, setError] = useState<string>(null)
    const [isLoading, setLoading] = useState(false)
    const [blockMethodResponse, blockMethod] = useMutation<BlockMethodResponse, BlockMethodRequest>(BLOCK_METHOD_MUTATION)

    type BlockMethodResponse = { blockMethod: { id: number } }
    type BlockMethodRequest = {
        type: string
        blockId: number
        methodName: string
        args: string
    }

    const onChange = (value: string) => {
        setValue(value)
        name && setMethodVariable(name, value)
    }

    const onConfirm = async () => {
        const method: MethodObject = confirm_cancel.on_confirm.method
        const args = populateTemplate(method.arg_template)
        const request: BlockMethodRequest = {
            type: method.type,
            blockId: parseInt(method.block_id),
            methodName: method.method_name,
            args,
        }
        setLoading(true)
        blockMethod(request)
    }

    const onCancel = () => {
        setValue(initial_value)
    }

    useEffect(() => {
        if (blockMethodResponse.data?.blockMethod?.id) {
            setLoading(false)
        } else if (blockMethodResponse.error) {
            setLoading(false)
            setError(blockMethodResponse.error.message.replace(/\[\w+\]/g, ""))
        }
    }, [blockMethodResponse])

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
                        onPress={onConfirm}
                        loading={isLoading}
                        contentStyle={globalStyles.buttonContentStyle}
                        mode="contained"
                        icon="check"
                        labelStyle={{ color: 'white' }}>
                        Confirm
                    </Button>
                    <Button
                        onPress={onCancel}
                        contentStyle={globalStyles.buttonContentStyle}
                        style={styles.button}
                        mode="contained"
                        icon="close"
                        labelStyle={{ color: 'white' }}>
                        Cancel
                    </Button>
                </View>}
            {error && <Text style={globalStyles.error}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-end',
    },
    button: {
        marginLeft: 10
    },
    input: {
        marginTop: 10
    }
})