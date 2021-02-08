import { MethodObject } from "display-api"
import { useClient } from "urql"
import { BLOCK_METHOD_MUTATION } from "../../api/gql"

declare global {
	interface Window {
		loop_method_vars?: {
			[varname: string]: string
		}
	}
}

export const setMethodVariable = (name: string, value: string) => {
	if (window.loop_method_vars == undefined) {
		window.loop_method_vars = {}
	}
	window.loop_method_vars[name] = value
	return window.loop_method_vars
}

export const getMethodVariable = (name: string) => {
	return window.loop_method_vars ? window.loop_method_vars[name] : undefined
}

export const getMethodVariables = () => {
	return window.loop_method_vars || {}
}

export const populateTemplate = (template: string) => {
	let input = template
	let vars = template.match(/\$\[[\w\d]+\]\$/g)
	if (vars) {
		vars.forEach((wrappedName: string) => {
			const name = wrappedName.replace(/[\$\[\]]/g, "")
			const value = getMethodVariable(name) || ""
			if (value) {
				input = input.replace(wrappedName, JSON.stringify(value))
			}
		})
	}
	return input
}
