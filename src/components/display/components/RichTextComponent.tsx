import React, { useRef } from 'react'
import { RichTextArgs } from "display-api"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createEditor, Text } from "slate"
import { Editable, RenderLeafProps, Slate, withReact } from "slate-react"
import { setMethodVariable } from "../method"
import { View, StyleSheet, Keyboard } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import colors from '../../../utils/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Portal } from 'react-native-paper'
import { jsonToHtmlConversion } from '../../../utils/htmlJsonConversion'

export const RichTextComponent = ({ content, editable = false, name, save, on_enter }: RichTextArgs) => {

	let richText = useRef();
	const [value, doSetValue] = useState<string[]>(content.map(jsonToHtmlConversion))


	const initHTML = `<div>
	This is a rich text editor 
	<b><i>This is a rich text editor</i></b> 
	This is a rich text editor 
	<u>This is a rich text editor</u><b><i><u> 
	This is a rich text editor 
	</u></i></b></div><div>
	This is a rich text editor 
	<b><i>This is a rich text editor</i></b> 
	This is a rich text editor 
	<u>This is a rich text editor</u><b><i><u> 
	This is a rich text editor 
	</u></i></b></div>`;
	const [isFocused, setFocused] = useState<boolean>(false)

	return (
		<View style={globalStyles.flex1}>
			{/* <SafeAreaView style={globalStyles.flex1}> */}

			{/* <ScrollView style={globalStyles.flex1}> */}
			<RichEditor
				disabled={!editable}
				ref={richText}
				scrollEnabled={false}
				onFocus={() => { setFocused(true) }}
				onBlur={() => { setFocused(false) }}
				onChange={(text) => {
					console.log("text: ", text)
				}}
				initialContentHTML={initHTML}
				editorStyle={{ backgroundColor: 'transparent' }}
				style={[{ backgroundColor: 'transparent' }]}
				placeholder='Start typing...'
			/>

			{/* <Portal> */}
			{
				isFocused && <View>
					<RichToolbar
						style={styles.richBar}
						selectedIconTint={colors.accent}
						disabledIconTint={'#bfbfbf'}
						editor={richText}
					/>
				</View>
			}
			{/* </ScrollView> */}
			{/* </Portal> */}
			{/* </SafeAreaView> */}
		</View >
	)
}

const styles = StyleSheet.create({
	richBar: {
		borderColor: colors.navigationPrimary,
		borderTopWidth: StyleSheet.hairlineWidth,
		// marginTop: 100,
		// backgroundColor: 'red',
		// flex: 1,
		// justifyContent: 'flex-end'
		// position: 'absolute',
		// bottom: 0
	},
})

