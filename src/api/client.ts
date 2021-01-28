import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "urql"

export const client = createClient({
    url: 'https://api-pr-100-zpsq.onrender.com/graphql',
    fetchOptions: async () => {
        const token = await AsyncStorage.getItem('token')
        return {
            headers: { authorization: token ? `Bearer ${token}` : '' },
        }
    },
})