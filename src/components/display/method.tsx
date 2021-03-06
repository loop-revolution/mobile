import { MethodObject } from 'display-api'
import { client } from '../../api/client'
import { BLOCK_METHOD_MUTATION } from '../../api/gql'

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
	const vars = template.match(/\$\[[\w\d]+\]\$/g)
	if (vars) {
		vars.forEach((wrappedName: string) => {
			const name = wrappedName.replace(/[\$\[\]]/g, '') // eslint-disable-line no-useless-escape
			const value = getMethodVariable(name) || ''
			if (value) {
				input = input.replace(wrappedName, JSON.stringify(value))
			}
		})
	}
	return input
}

type BlockMethodReturn = { blockMethod: { id: number } }
type BlockMethodVars = {
	type: string
	blockId: number
	methodName: string
	args: string
}

export const blockMethod = async (method: MethodObject) => {
	let args: string = null
	if (method.arg_template) {
		args = populateTemplate(method.arg_template)
	}
	const response = await client
		.mutation<BlockMethodReturn, BlockMethodVars>(BLOCK_METHOD_MUTATION, {
			type: method.type,
			blockId: parseInt(method.block_id),
			methodName: method.method_name,
			args,
		})
		.toPromise()
	return response
}
