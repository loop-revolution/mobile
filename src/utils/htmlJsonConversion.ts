import React, { useRef } from 'react'
import { TextArgs, TextComponent } from "display-api"
const json2html = require('node-json2html');

export const jsonToHtmlConversion = (component: TextComponent): string => {
    // let textArgs = component.args
    // const { text, bold, underline, monospace, preset, strikethrough, italic } = textArgs
    // let heading = false
    // if (preset === "Heading") {
    //     heading = true
    // }

    let template = {
        '<>': 'div', 'html': addTag({ ...component.args })
    }

    console.log("json2html: ", json2html)
    let html = json2html.transform({}, template)
    return html
}

const addTag = (args: TextArgs) => {
    if (args.bold) {
        args.bold = false
        return [{ '<>': 'b', html: addTag(args) }]
    }
    if (args.italic) {
        args.italic = false
        return { '<>': 'b', html: [addTag(args)] }
    }
    if (args.underline) {
        args.underline = false
        return { '<>': 'b', html: [addTag(args)] }
    }
    return args.text
}