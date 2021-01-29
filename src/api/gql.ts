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
