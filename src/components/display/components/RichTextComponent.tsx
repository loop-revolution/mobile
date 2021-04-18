import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { RichTextArgs } from 'display-api'
import { useCallback, useEffect, useState } from 'react'
import { blockMethod, setMethodVariable } from '../method'
import { View, StyleSheet } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import colors from '../../../utils/colors'
import { jsonToHtmlConversion, htmlToJsonCoverstion } from '../../../utils/htmlJsonConversion'

export const RichTextComponent = ({ content, editable = false, name, save, on_enter }: RichTextArgs) => {

	const [value, setValue] = useState<string>(jsonToHtmlConversion(content))

	useEffect(() => {
		const saveTimeout = setTimeout(() => {
			const components = htmlToJsonCoverstion(value)
			if (save && components !== content) {
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

	const onEnter = () => {
		on_enter && blockMethod(on_enter)
	}

	return <RichTextEditor value={value} setValue={setHtml} editable={editable} onEnter={onEnter} />
}

export const RichTextEditor = forwardRef(({ value, setValue, editable, onEnter, style }: { value: string, setValue: (newVal: string) => void, editable?: boolean, onEnter?: Function, style?: any }, ref) => {
	const richText = useRef(null)
	const [isFocused, setFocused] = useState<boolean>(false)

	useImperativeHandle(ref, () => ({
		reload() {
			richText && richText?.current?.setContentHTML('')
		}
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
				editorStyle={{ backgroundColor: 'transparent' }}
				style={[{ backgroundColor: 'transparent'}, style]}
				placeholder='Start typing...'
			/>
			{isFocused && (
				<View>
					<RichToolbar
						style={styles.richBar}
						selectedIconTint={colors.accent}
						disabledIconTint={'#bfbfbf'}
						editor={richText}
						actions={[
							actions.keyboard,
							actions.setBold,
							actions.setItalic,
							actions.setUnderline,
							actions.setStrikethrough,
							actions.removeFormat,
							actions.undo,
							actions.redo,
						]}
					/>
				</View>
			)}
		</>
	)

})

const styles = StyleSheet.create({
	richBar: {
		borderColor: colors.navigationPrimary,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
})
