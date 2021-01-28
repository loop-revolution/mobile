export const LOGIN_MUTATION = `
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`
