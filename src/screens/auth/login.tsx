import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Headline, Caption, useTheme, Button, TextInput, Text } from 'react-native-paper'
import { useForm, Controller } from "react-hook-form"
import { useMutation } from "urql"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOGIN_MUTATION } from '../../api/gql'
import routes from '../../navigation/routes'
import { globalStyles } from '../../utils/styles'
import { SafeAreaView } from 'react-native-safe-area-context'

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
            <SafeAreaView>
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
                            value={value}
                            onChangeText={value => onChange(value)}
                            error={errors.username} />
                    )}
                    name="username"
                    rules={{ required: true }}
                    defaultValue="salmanaly" />
                {errors.username && <Caption style={styles.error}>This is required.</Caption>}

                <Controller
                    control={control}
                    render={({ onChange, value }) => (
                        <TextInput
                            mode='outlined'
                            label='Password'
                            secureTextEntry={true}
                            style={styles.passwordTextField}
                            value={value}
                            onChangeText={value => onChange(value)}
                            error={errors.password} />
                    )}
                    name="password"
                    rules={{ required: true }}
                    defaultValue="11111111" />
                {errors.password && <Caption style={styles.error}>This is required.</Caption>}

                <Button
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                    contentStyle={globalStyles.buttonContentStyle}
                    mode="contained"
                    loading={isLoading}
                    labelStyle={{ color: 'white' }}>
                    Login
            </Button>
                {loginResult.error && <Text style={styles.error}>{loginResult.error.message.replace(/\[\w+\]/g, "")}</Text>}
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
    },
    error: {
        color: '#DD3B2C'
    }
})
