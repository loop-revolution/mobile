export enum InputType {
	displayName = "displayName",
	username = "username",
	password = "password",
	email = "email",
	verificationCode = "verificationCode",
}

export const getRules = (type: InputType) => {
	switch (type) {
		case InputType.displayName:
			return { required: true }
		case InputType.username:
			return { required: true }
		case InputType.password:
			return { required: true }
		case InputType.email:
			return {
				required: true,
				pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line no-useless-escape
			}
		case InputType.verificationCode:
			return { required: true }
		default:
			return undefined
	}
}
