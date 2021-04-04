import React, { useRef } from 'react'
import { RichTextArgs } from 'display-api'
import { useCallback, useEffect, useState } from 'react'
import { blockMethod, setMethodVariable } from '../method'
import { View, StyleSheet } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import colors from '../../../utils/colors'
import { jsonToHtmlConversion, htmlToJsonCoverstion } from '../../../utils/htmlJsonConversion'

export const RichTextComponent = ({ content, editable = false, name, save, on_enter }: RichTextArgs) => {
	const richText = useRef(null)
	const [value, setValue] = useState<string>(jsonToHtmlConversion(content))
	const [isFocused, setFocused] = useState<boolean>(false)

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

	return (
		<View style={globalStyles.flex1}>
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
					setHtml(html)
				}}
				onKeyDown={event => {
					if (event.key === 'Enter') {
						richText.current?.blurContentEditor()
						on_enter && blockMethod(on_enter)
						return
					}
				}}
				initialContentHTML={value}
				editorStyle={{ backgroundColor: 'transparent' }}
				style={[{ backgroundColor: 'transparent' }]}
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
		</View>
	)
}

const styles = StyleSheet.create({
	richBar: {
		borderColor: colors.navigationPrimary,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
})
