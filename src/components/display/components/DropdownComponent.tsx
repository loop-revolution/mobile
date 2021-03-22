import * as React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DropdownArgs, DropdownOption } from 'display-api'
import { StyleSheet } from 'react-native'
import colors from '../../../utils/colors'
import { blockMethod, setMethodVariable } from '../method'
import DropDownPicker from 'react-native-dropdown-picker'
import { getComponentIcon } from '../../../utils/utils'
import { ActivityIndicator } from 'react-native-paper'

export const DropdownComponent = ({
	color_scheme,
	disabled,
	readonly,
	name,
	on_change,
	options,
	variant,
	default: initial,
	onSelect,
}: DropdownArgs & { onSelect?: (index?: number) => void }) => {
	const [selectedIndex, setSelectedIndex] = React.useState(initial ?? 0)
	const [isLoading, setLoading] = React.useState(false)

	const isOutlined = variant === 'Outline'
	const tinColor = isOutlined ? color_scheme : colors.white

	const onSelectValue = async (index: number) => {
		name && setMethodVariable(name, index.toString())
		if (on_change) {
			setLoading(true)
			const response = await blockMethod(on_change.method)
			setLoading(false)
			if (response.error) {
				//TODO: handle error based on usage
			}
		} else if (onSelect) {
			onSelect(index)
		}
	}

	const menuOptions = options.map(({ icon, text }: DropdownOption, index: number) => {
		return {
			label: text,
			value: index,
			icon: () =>
				icon && <MaterialCommunityIcons style={styles(tinColor).icon} name={getComponentIcon(icon)} size={20} />,
		}
	})
	const rightIcon = (iconName: any) => {
		if (isLoading) {
			return <ActivityIndicator size='small' />
		}
		return <MaterialCommunityIcons style={styles(tinColor).icon} name={iconName} size={20} />
	}

	return (
		<DropDownPicker
			disabled={disabled || readonly}
			items={menuOptions}
			defaultValue={selectedIndex}
			style={[styles(color_scheme).anchor, isOutlined ? styles(color_scheme).outlined : styles(color_scheme).filled]}
			itemStyle={styles().dropdownItem}
			dropDownStyle={isOutlined ? styles(color_scheme).outlined : styles(color_scheme).filled}
			labelStyle={styles(tinColor).title}
			arrowColor={tinColor}
			containerStyle={styles().dropdownContainerStyle}
			dropDownMaxHeight={200}
			customArrowUp={() => rightIcon('chevron-up')}
			customArrowDown={() => rightIcon('chevron-down')}
			onChangeItem={item => {
				setSelectedIndex(item.value)
				onSelectValue(item.value)
			}}
		/>
	)
}

const styles = (color = colors.text) =>
	StyleSheet.create({
		container: {
			marginTop: 7,
			flexDirection: 'row',
			justifyContent: 'flex-start',
		},
		anchor: {
			borderColor: color,
			padding: 10,
			borderRadius: 5,
			height: 56, //same as input's default height
			justifyContent: 'center',
			alignSelf: 'flex-start',
		},
		filled: {
			backgroundColor: color,
		},
		outlined: {
			borderColor: color,
			borderWidth: 1,
		},
		title: {
			padding: 5,
			color: color,
			fontSize: 14,
			fontWeight: '400',
			lineHeight: 18,
		},
		icon: {
			color: color,
		},
		activityIndicator: {
			marginLeft: 5,
		},
		dropdownItem: {
			justifyContent: 'flex-start',
		},
		dropdownContainerStyle: {
			height: 60,
			flex: 1,
			marginTop: 5,
		},
	})
