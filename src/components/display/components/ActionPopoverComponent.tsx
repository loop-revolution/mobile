import React from 'react'
import { ActionPopoverAction, ActionPopoverArgs } from 'display-api'
import { TouchableRipple } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import routes from '../../../navigation/routes'
import { redirectTo } from '../../../utils/helper'
import { getComponentIcon } from '../../../utils/utils'
import { ComponentDelegate } from '../ComponentDelegate'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { blockMethod, setMethodVariable } from '../method'

export const ActionPopoverComponent = ({ trigger, actions }: ActionPopoverArgs) => {
	const navigation = useNavigation()
	const { showActionSheetWithOptions } = useActionSheet()

	const onPress = async (index: number) => {
		const action = actions[index]
		const interact = action?.interact
		if (interact?.search) {
			navigation.navigate(routes.SEARCH, { searchComponent: interact?.search })
		} else if (interact?.redirect) {
			redirectTo(interact.redirect?.app_path, navigation)
		} else if (interact?.method) {
			action.text && setMethodVariable(action.text, index.toString())
			const response = await blockMethod(interact?.method)
			if (response.error) {
				//TODO: Handle error based on usage.
			}
		}
	}

	const optionTitles = actions.map(({ text }: ActionPopoverAction) => text)
	const optionIcons = actions.map(({ icon }: ActionPopoverAction) => getComponentIcon(icon))
	optionTitles.push('Cancel')
	optionIcons.push('cube') //Temporary placeholder

	const showActionSheet = () => {
		const cancelButtonIndex = optionTitles.length - 1
		showActionSheetWithOptions(
			{
				options: optionTitles,
				icons: optionIcons,
				cancelButtonIndex,
			},
			buttonIndex => {
				if (actions && actions[buttonIndex]) {
					onPress(buttonIndex)
				}
			},
		)
	}

	return (
		<>
			{trigger && (
				<TouchableRipple
					onPress={() => {
						showActionSheet()
					}}
				>
					<ComponentDelegate component={trigger} />
				</TouchableRipple>
			)}
		</>
	)
}
