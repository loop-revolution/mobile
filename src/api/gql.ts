import { gql } from "urql"

export const LOGIN_MUTATION = `
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        token
    }
  }
`

export const SIGNUP_MUTATION = `
  mutation ($username: String!, $password: String!, $email: String!) {
    signup(username: $username, password: $password, email: $email) {
        sessionCode
    }
  }
`

export const VERIFY_EMAIL_MUTATION = `
  mutation ($username: String!, $sessionCode: String!, $verificationCode: String!) {
    confirmEmail(username: $username, sessionCode: $sessionCode, verificationCode: $verificationCode) {
      token
    }
  }
`

export const WHO_AM_I = gql`
	query {
		whoami {
			id
            username
            displayName
			credits
		}
	}
`

export const USER_BLOCKS = gql`
	query($id: Int!) {
		userById(id: $id) {
			blocks {
				id
				embedDisplay
			}
		}
	}
`

export const BLOCK_TYPES = gql`
	query {
		blockTypes {
			name
			icon
			desc
		}
	}
`

export const BLOCK_CREATION_DISPLAY = gql`
	query($type: String!) {
		blockCreationDisplay(type: $type)
	}
`
