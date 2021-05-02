import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { RichTextArgs } from 'display-api'
import { useCallback, useEffect, useState } from 'react'
import { blockMethod, setMethodVariable } from '../method'
import { View, StyleSheet } from 'react-native'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import colors from '../../../utils/colors'
import { jsonToHtmlConversion, htmlToJsonCoverstion } from '../../../utils/htmlJsonConversion'
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons'

export const RichTextComponent = ({ content, editable = false, name, save, on_enter, bordered }: RichTextArgs) => {
	const [value, setValue] = useState<string>(jsonToHtmlConversion(content))

	useEffect(() => {
		const saveTimeout = setTimeout(() => {
			const components = htmlToJsonCoverstion(value)
			if (save && components != content) {
				save && blockMethod(save)
			}
		}, 1000)
		return () => clearTimeout(saveTimeout)
	}, [value])

	const setHtml = useCallback(
		(val: string) => {
			setValue(val)
			const components = htmlToJsonCoverstion(val)
			name && setMethodVariable(name, components)
		},
		[name],
	)

	useEffect(() => {
		setHtml(value)
	}, [])

	const onEnter = () => {
		on_enter && blockMethod(on_enter)
	}

	let editorStyle = null
	if (bordered) {
		editorStyle = { bordered: true, paddingLeft: 10 }
	}

	return (
		<RichTextEditor value={value} setValue={setHtml} editable={editable} onEnter={onEnter} editorStyle={editorStyle} />
	)
}

export const RichTextEditor = forwardRef(
	(
		{
			value,
			setValue,
			editable,
			onEnter,
			style,
			editorStyle,
		}: {
			value: string
			setValue: (newVal: string) => void
			editable?: boolean
			onEnter?: Function
			style?: any
			editorStyle?: any
		},
		ref,
	) => {
		const richText = useRef(null)
		const [isFocused, setFocused] = useState<boolean>(false)

		const contentCSSText = `
			font-size: ${editorStyle?.fontSize ?? 14}px; 
			color: ${editorStyle?.color ?? colors.text}; 
			padding-left: ${editorStyle?.paddingLeft ?? 0}px;
			margin-left: ${editorStyle?.marginLeft ?? 0}px;
			border: ${editorStyle?.bordered ? '1px solid rgb(226, 232, 240);' : '0px;'}
		`

		useImperativeHandle(ref, () => ({
			reload() {
				richText && richText?.current?.setContentHTML('')
			},
		}))

		return (
			<>
				<RichEditor
					disabled={!editable}
					ref={richText}
					scrollEnabled={false}
					onFocus={() => {
						setFocused(true)
					}}
					onBlur={() => {
						setFocused(false)
					}}
					onChange={html => {
						setValue(html)
					}}
					onKeyDown={event => {
						if (event.key === 'Enter') {
							richText.current?.blurContentEditor()
							onEnter && onEnter()
							return
						}
					}}
					initialContentHTML={value}
					editorStyle={{ backgroundColor: 'transparent', contentCSSText }}
					style={[{ backgroundColor: 'transparent' }, style]}
					placeholder='Start typing...'
				/>
				{isFocused && (
					<View>
						<RichToolbar
							style={styles.richBar}
							selectedIconTint={colors.accent}
							disabledIconTint={'#bfbfbf'}
							unselectedButtonStyle={styles.toolbarButton}
							selectedButtonStyle={styles.toolbarButton}
							disabledButtonStyle={styles.toolbarButton}
							editor={richText}
							actions={[
								actions.keyboard,
								actions.setBold,
								actions.setItalic,
								actions.setUnderline,
								actions.setStrikethrough,
								actions.undo,
								actions.redo,
								actions.removeFormat,
							]}
							iconMap={{
								[actions.keyboard]: ({ tintColor }: { tintColor: string }) => (
									<MaterialCommunityIcons color={tintColor} size={26} name='keyboard-outline' />
								),
								[actions.setBold]: ({ tintColor }: { tintColor: string }) => (
									<FontAwesome5 color={tintColor} size={16} name='bold' />
								),
								[actions.setItalic]: ({ tintColor }: { tintColor: string }) => (
									<FontAwesome5 color={tintColor} size={16} name='italic' />
								),
								[actions.setUnderline]: ({ tintColor }: { tintColor: string }) => (
									<FontAwesome5 color={tintColor} size={16} name='underline' />
								),
								[actions.setStrikethrough]: ({ tintColor }: { tintColor: string }) => (
									<FontAwesome5 color={tintColor} size={16} name='strikethrough' />
								),
								[actions.undo]: ({ tintColor }: { tintColor: string }) => (
									<FontAwesome5 color={tintColor} size={16} name='undo' />
								),
								[actions.redo]: ({ tintColor }: { tintColor: string }) => (
									<FontAwesome5 color={tintColor} size={16} name='redo' />
								),
								[actions.removeFormat]: ({ tintColor }: { tintColor: string }) => (
									<Ionicons color={tintColor} size={26} name='close' />
								),
							}}
						/>
					</View>
				)}
			</>
		)
	},
)

const styles = StyleSheet.create({
	richBar: {
		backgroundColor: 'transparent',
		alignItems: 'flex-start',
	},
	toolbarButton: {
		marginHorizontal: 5,
	},
})
