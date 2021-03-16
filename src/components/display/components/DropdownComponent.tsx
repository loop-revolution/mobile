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
}: DropdownArgs) => {
	const [isVisible, setVisible] = React.useState(false)
	const [selectedIndex, setSelectedIndex] = React.useState(initial ?? 0)
	const [isLoading, setLoading] = React.useState(false)

	const openMenu = () => setVisible(true)
	const closeMenu = () => setVisible(false)

	const onSelect = async (index: number) => {
		name && setMethodVariable(name, index.toString())
		setLoading(true)
		const response = await blockMethod(on_change.method)
		setLoading(false)
		if (response.error) {
			//TODO: handle error based on usage
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
				onSelect(index)
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
				{ marginTop: 50 },
			]}
			onPress={openMenu}
		>
			<View style={globalStyles.row}>
				<Text style={styles(isOutlined ? color_scheme : colors.white).title}>{options.length > 0 ? options[selectedIndex]?.text : ''}</Text>
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
			padding: 5,
			flexDirection: 'row',
			justifyContent: 'center',
		},
		anchor: {
			borderColor: color,
			padding: 10,
			borderRadius: 5,
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
