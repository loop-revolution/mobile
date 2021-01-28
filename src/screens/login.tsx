import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Headline, Caption, useTheme, Button, TextInput, Text } from 'react-native-paper'
import { useForm, Controller } from "react-hook-form"
import { useMutation } from "urql"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOGIN_MUTATION } from '../api/gql'
import routes from '../navigation/routes'

type LoginResult = { login: { token: string } }
type LoginRequest = { username: string; password: string }

export const Login = ({ navigation }) => {
    const theme = useTheme()

    const [isLoading, setLoading] = React.useState(false)
    const { control, handleSubmit, errors } = useForm()
    const [loginResult, login] = useMutation<LoginResult, LoginRequest>(LOGIN_MUTATION)

    const onSubmit = (data: LoginRequest) => {
        setLoading(true)
        login(data)
            .then(async ({ data }) => {
                setLoading(false)
                if (data != undefined) {
                    const token = data.login.token
                    await AsyncStorage.setItem('token', token)
                    navigation.replace(routes.HOME)
                }
            })
    }

    return (
        <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
            <Headline style={styles.headline}>
                Login
            </Headline>
            <Caption style={styles.caption}>
                Please login to continue
            </Caption>
            <Controller
                control={control}
                render={({ onChange, value }) => (
                    <TextInput
                        mode='outlined'
                        label='Username or Email'
                        onChangeText={value => onChange(value)}
                        value={value} />
                )}
                name="username"
                rules={{ required: true }}
                defaultValue="" />
            {errors.username && <Caption>This is required.</Caption>}

            <Controller
                control={control}
                render={({ onChange, value }) => (
                    <TextInput
                        mode='outlined'
                        label='Password'
                        secureTextEntry={true}
                        style={styles.passwordTextField}
                        value={value}
                        onChangeText={value => onChange(value)} />
                )}
                name="password"
                rules={{ required: true }}
                defaultValue="" />
            {errors.password && <Caption>This is required.</Caption>}

            <Button
                onPress={handleSubmit(onSubmit)}
                style={styles.button}
                mode="contained"
                loading={isLoading}
                labelStyle={{ color: 'white' }}>
                Login
            </Button>
            {loginResult.error && <Text>{loginResult.error.message.replace(/\[\w+\]/g, "")}</Text>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flex: 1,
        paddingHorizontal: 30,
    },
    headline: {
        marginTop: 10,
    },
    caption: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
    passwordTextField: {
        marginTop: 10
    }
})
