import React, { useRef } from 'react'
import { TextArgs, TextComponent } from "display-api"
const json2html = require('node-json2html');
import escapeHtml from 'escape-html'
import { Node, Text } from 'slate'

export const jsonToHtmlConversion = (components: TextComponent[]): string => {
    // let textArgs = component.args
    // const { text, bold, underline, monospace, preset, strikethrough, italic } = textArgs
    // let heading = false
    // if (preset === "Heading") {
    //     heading = true
    // }

    // let template = {
    //     '<>': 'div', 'html': addTag({ ...component.args })
    // }

    // console.log("json2html: ", json2html)
    // let html = json2html.transform({}, template)
    // return html

    // const convertComponentToSlateText = (component: TextComponent) => {
    //     let textArgs = component.args
    //     const { text, bold, underline, monospace, preset, strikethrough, italic } = textArgs
    //     let heading = false
    //     if (preset === "Heading") {
    //         heading = true
    //     }
    //     return {
    //         bold,
    //         code: monospace,
    //         heading,
    //         italic,
    //         strikethrough,
    //         text,
    //         underline,
    //     }
    // }

    // let slateTexts: Text[] = components.map(convertComponentToSlateText)
    // let slateObject = { type: 'paragraph', children: slateTexts }
    // let html = serialize(slateObject)

    if (components.length == 0) {
        return ''
    }

    let html = ''
    components.map(component => {
        html = `${html}${buildHtmlTag(component.args)}`
    })
    return `<div>${html}</div>`
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

// const serialize = node => {
//     debugger
//     if (Text.isText(node)) {
//         return escapeHtml(node.text)
//     }

//     const children = node.children.map(n => serialize(n)).join('')

//     switch (node) {
//         case 'quote':
//             return `< blockquote > <p>${children} </p></blockquote > `
//         case 'paragraph':
//             return `< p > ${children} </p>`
//         case 'link':
//             return `<a href="${escapeHtml(node.url)}">${children}</a>`
//         case 'bold':
//             return `<b><p>${children}</p></b>`
//         case 'italic':
//             return `<em>${children}</em>`
//         case 'underline':
//             return `<u>${children}</u>`
//         default:
//             return children
//     }
// }