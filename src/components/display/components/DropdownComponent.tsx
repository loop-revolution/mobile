import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DropdownArgs, DropdownOption } from 'display-api'
import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { Menu, Provider, Text, TouchableRipple, ActivityIndicator } from 'react-native-paper'
import colors from '../../../utils/colors'
import { globalStyles } from '../../../utils/styles'
import { getComponentIcon } from '../../../utils/utils'
import { blockMethod, setMethodVariable } from '../method'

export const DropdownComponent = ({
	color_scheme,
	disabled,
	readonly,
	name,
	on_change,
	options,
	variant,
	default: initial,
}: DropdownArgs, { onSelect = null }: { onSelect?: Function }) => {
	const [isVisible, setVisible] = React.useState(false)
	const [selectedIndex, setSelectedIndex] = React.useState(initial ?? 0)
	const [isLoading, setLoading] = React.useState(false)

	const openMenu = () => setVisible(true)
	const closeMenu = () => setVisible(false)

	const onSelectValue = async (text: string, index: number) => {
		name && setMethodVariable(name, index.toString())
		if (on_change) {
			setLoading(true)
			const response = await blockMethod(on_change.method)
			setLoading(false)
			if (response.error) {
				//TODO: handle error based on usage
			}
		} else if (onSelect) {
			onSelect(text)
		}
	}

	const menuOptions = options.map(({ icon, text }: DropdownOption, index: number) => (
		<Menu.Item
			key={index}
			icon={getComponentIcon(icon)}
			title={text}
			titleStyle={styles().title}
			onPress={() => {
				setSelectedIndex(index)
				setVisible(false)
				onSelectValue(text, index)
			}}
		/>
	))

	const isOutlined = variant === 'Outline'
	const anchor = (
		<TouchableRipple
			disabled={disabled || readonly}
			style={[
				styles(color_scheme).anchor,
				isOutlined ? styles(color_scheme).outlined : styles(color_scheme).filled,
			]}
			onPress={openMenu}
		>
			<View style={[globalStyles.row]}>
				<Text style={styles(isOutlined ? color_scheme : colors.white).title}>
					{options.length > 0 ? options[selectedIndex]?.text : ''}
				</Text>
				{isLoading ? (
					<ActivityIndicator
						{...null}
						color={isOutlined ? color_scheme : colors.white}
						style={styles().activityIndicator}
					/>
				) : (
					<MaterialCommunityIcons color={isOutlined ? color_scheme : colors.white} size={20} name={'chevron-down'} />
				)}
			</View>
		</TouchableRipple>
	)

	return (
		<Provider>
			<View style={styles().container}>
				<Menu visible={isVisible} onDismiss={closeMenu} anchor={anchor}>
					{menuOptions}
				</Menu>
			</View>
		</Provider>
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
		activityIndicator: {
			marginLeft: 5,
		},
	})
