import { TextArgs, TextComponent } from 'display-api'
import { parse } from 'himalaya'

export const jsonToHtmlConversion = (components: TextComponent[]): string => {
	if (components.length == 0) {
		return ''
	}

	let html = ''
	components.map(component => {
		html = `${html}${buildHtmlTag(component.args)}`
	})
	return `<div>${html}</div>`
}

export const htmlToJsonCoverstion = (html: string): TextComponent[] => {
	const components: TextComponent[] = []
	const args: TextArgs = resetArgs({ text: '' })
	const json = parse(html)
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
		return `<em>${buildHtmlTag(args)}</em>`
	}
	if (args.underline) {
		args.underline = false
		return `<u>${buildHtmlTag(args)}</u>`
	}
	if (args.strikethrough) {
		args.strikethrough = false
		return `<del>${buildHtmlTag(args)}</del>`
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
	children.forEach(obj => {
		if (obj.type == 'text') {
			const newArgs: TextArgs = Object.assign({}, args)
			newArgs.text = obj.content
			components.push({ cid: 'text', args: newArgs })
			resetArgs(args)
		}

		if (obj.type == 'element') {
			if (obj.tagName == 'b') args.bold = true
			if (obj.tagName == 'u') args.underline = true
			if (obj.tagName == 'em') args.italic = true
			if (obj.tagName == 'code') args.monospace = true
			if (obj.tagName == 'del') args.strikethrough = true
		}
		obj.children && parseChildren(obj.children, components, args)
	})
}
