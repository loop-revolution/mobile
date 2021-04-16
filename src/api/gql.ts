/* eslint-disable */

import { gql } from 'urql'

export const LOGIN_MUTATION = `
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        token
    }
  }
`

export const SIGNUP_MUTATION = `
  mutation ($displayName: String!, $username: String!, $password: String!, $email: String!) {
    signup(displayName: $displayName, username: $username, password: $password, email: $email) {
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

export const FORGOT_PASSWORD = gql`
	mutation($username: String!) {
		forgotPassword(username: $username) {
			sessionCode
			email
		}
	}
`

export const CONFIRM_FORGOT_PASSWORD = gql`
	mutation($username: String!, $sessionCode: String!, $verificationCode: String!, $newPassword: String!) {
		confirmForgotPassword(
			username: $username
			sessionCode: $sessionCode
			verificationCode: $verificationCode
			newPassword: $newPassword
		) {
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
			email
			root {
				id
			}
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

export const CREATE_BLOCK = gql`
	mutation($type: String!, $input: String!) {
		createBlock(type: $type, input: $input) {
			id
		}
	}
`

export const BLOCK_METHOD_MUTATION = gql`
	mutation($type: String!, $blockId: Int!, $methodName: String!, $args: String!) {
		blockMethod(type: $type, blockId: $blockId, methodName: $methodName, args: $args) {
			id
		}
	}
`

export const GET_BLOCK = gql`
	query($id: Int!) {
		blockById(id: $id) {
			pageDisplay
			commentsCount
			breadcrumb {
				name
				blockId
			}
		}
	}
`

export const GET_BLOCK_COMMENTS = gql`
	query($id: Int!) {
		blockById(id: $id) {
			comments {
				id
				createdAt
				starred
				starCount
				author {
					displayName
					username
				}
				block {
					id
					type
					starred
					pageDisplay
					embedDisplay
					commentsCount
				}
			}
		}
	}
`

export const USER_SEARCH = gql`
	query($query: String!) {
		searchUsers(query: $query) {
			id
			displayName
			username
			email
		}
	}
`

export const BLOCK_SEARCH = gql`
	query($query: String!, $filters: BlockSearchFilters, $sortBy: BlockSortType) {
		searchBlocks(query: $query, filters: $filters, sortBy: $sortBy) {
			id
			color
			icon
			crumbs {
				blockId
				name
			}
		}
	}
`

export const NOTIFICATIONS = gql`
	query {
		notifications {
			name
			description
			time
		}
	}
`

export const ADD_EXPO_TOKEN = gql`
	mutation($token: String!) {
		addExpoTokens(token: $token) {
			id
		}
	}
`

export const SET_STARRED = gql`
	mutation($blockId: Int!, $starred: Boolean!) {
		setStarred(blockId: $blockId, starred: $starred) {
			id
			starred
		}
	}
`

export const SET_NOTIFS = gql`
	mutation($blockId: Int!, $enabled: Boolean!) {
		setNotifs(blockId: $blockId, enabled: $enabled) {
			id
			notifEnabled
		}
	}
`

export const UPDATE_VISIBILITY = gql`
	mutation($blockId: Int!, $public: Boolean!) {
		updateVisibility(blockId: $blockId, public: $public) {
			id
			public
		}
	}
`

export const USER_BY_ID = gql`
	query($id: Int!) {
		userById(id: $id) {
			id
			username
			displayName
			credits
			featured {
				id
				pageDisplay
				embedDisplay
				starred
				starCount
			}
		}
	}
`

export const USER_PROFILE = gql`
	query($username: String!) {
		userByName(username: $username) {
			id
			username
			displayName
			credits
			email
			featured {
				id
				pageDisplay
				embedDisplay
				starred
				starCount
			}
		}
	}
`

export const UPDATE_DISPLAY_NAME = gql`
	mutation($newDisplayName: String!) {
		updateDisplayName(newDisplayName: $newDisplayName) {
			id
			username
			displayName
		}
	}
`

export const UPDATE_USER_NAME = gql`
	mutation($newUsername: String!, $password: String!) {
		updateUsername(newUsername: $newUsername, password: $password) {
			id
			username
			displayName
		}
	}
`

export const UPDATE_PROFILE = gql`
	mutation($newUsername: String!, $password: String!, $newDisplayName: String!) {
		updateUsername(newUsername: $newUsername, password: $password) {
			id
			username
			displayName
		}
		updateDisplayName(newDisplayName: $newDisplayName) {
			id
			username
			displayName
		}
	}
`

export const UPDATE_PASSWORD = gql`
	mutation($newPassword: String!, $password: String!) {
		updatePassword(newPassword: $newPassword, password: $password) {
			id
		}
	}
`

export const UPDATE_EMAIL = gql`
	mutation($newEmail: String!) {
		updateEmail(newEmail: $newEmail) {
			sessionCode
		}
	}
`

export const CONFIRM_UPDATE_EMAIL = gql`
	mutation($sessionCode: String!, $verificationCode: String!) {
		confirmUpdateEmail(sessionCode: $sessionCode, verificationCode: $verificationCode) {
			id
			email
			username
		}
	}
`

export const GET_PERMISSIONS = gql`
	query($id: Int!) {
		blockById(id: $id) {
			full: permFull(level: FULL) {
				id
				username
				displayName
			}
			edit: permFull(level: EDIT) {
				id
				username
				displayName
			}
			view: permFull(level: VIEW) {
				id
				username
				displayName
			}
		}
	}
`

export const SET_PERMISSIONS = gql`
	mutation($full: [Int!]!, $edit: [Int!]!, $view: [Int!]!, $blockId: Int!) {
		setPerms(permFull: $full, permEdit: $edit, permView: $view, blockId: $blockId) {
			full: permFull(level: FULL) {
				id
				username
				displayName
			}
			edit: permFull(level: EDIT) {
				id
				username
				displayName
			}
			view: permFull(level: VIEW) {
				id
				username
				displayName
			}
		}
	}
`
