import { TextArgs, TextComponent } from 'display-api'
import { parse } from 'himalaya'

export const jsonToHtmlConversion = (components: TextComponent[]): string => {
	if (components.length == 0) {
		return ''
	}

	let html = ''
	const newComponents = [...components]

	newComponents.map(component => {
		const textArgs = Object.assign({}, component.args)
		html = `${html}${buildHtmlTag(textArgs)}`
	})
	return `<div>${html}</div>`
}

export const htmlToJsonCoverstion = (html: string): TextComponent[] => {
	const components: TextComponent[] = []
	const args: TextArgs = resetArgs({ text: '' })
	const json = parse(html)
	if (json.length == 0) {
		return components
	}
	parseChildren(json[0].children, components, args)
	return components
}

const buildHtmlTag = (args: TextArgs) => {
	if (args.preset === 'Heading') {
		args.preset = null
		return `<H2>${buildHtmlTag(args)}</H2>`
	}
	if (args.bold) {
		args.bold = false
		return `<b>${buildHtmlTag(args)}</b>`
	}
	if (args.italic) {
		args.italic = false
		return `<i>${buildHtmlTag(args)}</i>`
	}
	if (args.underline) {
		args.underline = false
		return `<u>${buildHtmlTag(args)}</u>`
	}
	if (args.strikethrough) {
		args.strikethrough = false
		return `<strike>${buildHtmlTag(args)}</strike>`
	}
	if (args.monospace) {
		args.monospace = false
		return `<code style="background-color:lightgray";>${buildHtmlTag(args)}</code>`
	}
	return args.text
}

const resetArgs = (args: TextArgs) => {
	args.text = ''
	args.bold = false
	args.italic = false
	args.underline = false
	args.strikethrough = false
	args.monospace = false
	return args
}

const parseChildren = (children: Array<any>, components: TextComponent[], args: TextArgs) => {
	children?.forEach(obj => {
		if (obj.type == 'text') {
			const newArgs: TextArgs = Object.assign({}, args)
			newArgs.text = obj.content
			components.push({ cid: 'text', args: newArgs })
			resetArgs(args)
		}

		if (obj.type == 'element') {
			if (obj.tagName == 'b') args.bold = true
			if (obj.tagName == 'u') args.underline = true
			if (obj.tagName == 'i') args.italic = true
			if (obj.tagName == 'code') args.monospace = true
			if (obj.tagName == 'strike') args.strikethrough = true
		}
		obj.children && parseChildren(obj.children, components, args)
	})
}
