import AsyncStorage from "@react-native-async-storage/async-storage"
import { makeOperation, Operation } from "urql"

export type AuthState = { token: string } | null

export const getAuth = async ({ authState }: { authState: AuthState }) => {
	if (!authState) {
		const token = await AsyncStorage.getItem("token")
		if (token) {
			return { token }
		}
		return null
	}
	return null
}

export const willAuthError = ({ authState }: { authState: AuthState }) => {
	if (!authState) {
		return true
	}
	return false
}

export const didAuthError = ({ error }) => error.graphQLErrors.some(e => e.message.includes("[uar]"))

export const addAuthToOperation = ({ authState, operation }: { authState: AuthState; operation: Operation }) => {
	if (!authState || !authState.token) {
		return operation
	}
	const fetchOptions =
		typeof operation.context.fetchOptions === "function"
			? operation.context.fetchOptions()
			: operation.context.fetchOptions || {}
	return makeOperation(operation.kind, operation, {
		...operation.context,
		fetchOptions: {
			...fetchOptions,
			headers: {
				...fetchOptions.headers,
				Authorization: authState.token,
			},
		},
	})
}
