import * as React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DropdownArgs } from 'display-api'
import { blockMethod, setMethodVariable } from '../method'
import { getComponentIcon } from '../../../utils/utils'
import { Button } from 'react-native-paper'
import { useActionSheet } from '@expo/react-native-action-sheet'

export const DropdownComponent = ({
	color_scheme,
	disabled,
	name,
	on_change,
	options,
	variant,
	default: initial,
	onSelect,
}: DropdownArgs & { onSelect?: (index?: number) => void }) => {
	const { showActionSheetWithOptions } = useActionSheet()
	const [selectedIndex, setSelectedIndex] = React.useState(initial ?? 0)

	const isOutlined = variant === 'Outline'
	const dropdownOption = options.map(function(option) {
		return option.text
	})
	dropdownOption.push('Cancel')

	const dropdownOptionIcons = options.map(function(option) {
		return option.icon && <MaterialCommunityIcons name={getComponentIcon(option.icon)} />
	})

	const showOptions = () => {
		const optionLength = dropdownOption.length
		const cancelButtonIndex = optionLength - 1
		const icons = dropdownOptionIcons
		showActionSheetWithOptions(
			{
				options: dropdownOption,
				cancelButtonIndex,
				icons,
			},
			index => {
				if (index !== cancelButtonIndex) {
					setSelectedIndex(index)
					onSelectValue(index)
				}
			},
		)
	}

	const onSelectValue = async (index: number) => {
		name && setMethodVariable(name, index)
		if (on_change) {
			await blockMethod(on_change.method)
		} else if (onSelect) {
			onSelect(index)
		}
	}

	return (
		<Button
			disabled={disabled}
			onPress={() => {
				showOptions()
			}}
			mode={isOutlined ? 'outlined' : 'contained'}
			color={color_scheme}
			contentStyle={{ flexDirection: 'row-reverse' }}
			icon={'chevron-down'}
		>
			{dropdownOption[selectedIndex]}
		</Button>
	)
}
