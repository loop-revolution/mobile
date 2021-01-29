import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Headline, Caption, Button, TextInput, Text } from 'react-native-paper'
import { useForm, Controller } from "react-hook-form"
import { useMutation } from "urql"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VERIFY_EMAIL_MUTATION } from '../../api/gql'
import routes from '../../navigation/routes'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getRules, InputType } from '../../utils/validation'

type VerifyEmailResult = { confirmEmail: { token: string } }
type VerifyEmailRequest = { username: string; sessionCode: string; verificationCode: string }

export const VerifyEmail = ({ route, navigation }) => {

    const [isLoading, setLoading] = useState(false)
    const { control, handleSubmit, errors } = useForm()
    const [verifyEmailResult, verifyEmail] = useMutation<VerifyEmailResult, VerifyEmailRequest>(VERIFY_EMAIL_MUTATION)

    const textInput = (type: InputType, hasError: boolean) => {
        return (
            <Controller
                control={control}
                render={({ onChange, value }) => (
                    <View style={styles.inputText}>
                        <TextInput
                            mode='outlined'
                            label='Verification Code'
                            onChangeText={value => onChange(value)}
                            value={value}
                            error={hasError}
                            autoCapitalize="none" />
                        { hasError && <Caption style={styles.error}>This is required.</Caption>}
                    </View>
                )}
                name={type}
                rules={getRules(type)}
                defaultValue="" />
        )
    }

    const onSubmit = (data: VerifyEmailRequest) => {
        const { sessionCode, username } = route.params;
        data.username = username
        data.sessionCode = sessionCode
        setLoading(true)
        verifyEmail(data)
            .then(async ({ data }) => {
                setLoading(false)
                if (data != undefined) {
                    const token = data.confirmEmail.token
                    await AsyncStorage.setItem('token', token)
                    navigation.replace(routes.HOME)
                }
            })
    }

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
            <SafeAreaView>
                <Headline style={styles.headline}>Verify Email</Headline>
                <Caption style={styles.caption}>Please enter verificaton code sent to your email</Caption>

                {textInput(InputType.verificationCode, errors.verificationCode)}

                <Button
                    onPress={handleSubmit(onSubmit)}
                    contentStyle={globalStyles.buttonContentStyle}
                    mode="contained"
                    loading={isLoading}
                    labelStyle={{ color: 'white' }}>
                    Verify
                </Button>
                {verifyEmailResult.error && <Text style={styles.error}>{verifyEmailResult.error.message.replace(/\[\w+\]/g, "")}</Text>}
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flex: 1,
        paddingHorizontal: 30,
    },
    headline: {
        marginTop: 0,
    },
    caption: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
    inputText: {
        marginBottom: 20
    },
    error: {
        color: '#DD3B2C',
    },
})
