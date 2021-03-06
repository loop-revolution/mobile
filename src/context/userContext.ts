import { createContext } from 'react'
import { User } from '../api/types'

type UserContextType = {
	user: User
	isUserLoggedIn: boolean
	setUserLoggedIn: (isLoggedIn: boolean, addPushToken?: boolean) => void
}

const UserContext = createContext<UserContextType>({
	user: null,
	isUserLoggedIn: false,
	setUserLoggedIn: () => {},
})

export { UserContext }
