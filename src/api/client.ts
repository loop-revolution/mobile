import AsyncStorage from "@react-native-async-storage/async-storage"
import { cacheExchange, Client, createClient, dedupExchange, errorExchange, fetchExchange } from "urql"
import { authExchange } from "@urql/exchange-auth"
import { AuthState, addAuthToOperation, getAuth, willAuthError, didAuthError } from "./auth"
import { NavigationHelpersContext } from "@react-navigation/native"

export let client: Client
export function createAPIClient() {
    client = createClient({
        url: "https://api-pr-151.onrender.com/",
        exchanges: [
            dedupExchange,
            cacheExchange,
            errorExchange({
                onError: async (error) => {
                    const isAuthError = error.graphQLErrors.some((e) => e.message.includes("[uar]"))
                    if (isAuthError) {
                        await AsyncStorage.removeItem("token")
                    }
                },
            }),
            authExchange<AuthState>({
                addAuthToOperation,
                getAuth,
                willAuthError,
                didAuthError
            }),
            fetchExchange,
        ],
    })
    return client
}