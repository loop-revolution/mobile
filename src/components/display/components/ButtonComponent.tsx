import React from 'react'
import { ButtonArgs } from 'display-api'
import { Button } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { globalStyles } from '../../../utils/styles'
import { useNavigation } from '@react-navigation/native'
import routes from '../../../navigation/routes'
import { redirectTo } from '../../../utils/helper'
import colors from '../../../utils/colors'
import { getComponentIcon } from '../../../utils/utils'
import { blockMethod } from '../method'

export const ButtonComponent = ({
	text,
	interact,
	color_scheme,
	variant,
	icon,
	size,
	disabled,
	readonly,
	onChange,
}: ButtonArgs & { onChange?: () => void }) => {
	const navigation = useNavigation()

	const onPress = async () => {
		if (interact?.search) {
			navigation.navigate(routes.SEARCH, { searchComponent: interact?.search })
		} else if (interact?.redirect) {
			redirectTo(interact?.redirect?.app_path, navigation)
		} else if (interact?.method) {
			const response = await blockMethod(interact?.method)
			if (response.error) {
				//TODO: Handle error based on usage.
			}
		}
		onChange && onChange()
	}
	const mode = variant === 'Link' ? 'text' : variant === 'Outline' ? 'outlined' : 'contained'
	const buttonStyle: any = [styles().button]
	if (variant === 'Outline') {
		buttonStyle.push(styles(color_scheme).outline)
	}

	return (
		<View style={size === 'Small' ? globalStyles.row : null}>
			<Button
				onPress={onPress}
				style={buttonStyle}
				contentStyle={globalStyles.buttonContentStyle}
				mode={mode}
				icon={variant === 'Link' ? undefined : getComponentIcon(icon)}
				color={color_scheme}
				disabled={disabled || readonly}
				labelStyle={variant === 'Outline' || variant === 'Link' ? styles(color_scheme).colorLabel : styles().whiteLabel}
			>
				{text}
			</Button>
		</View>
	)
}
const styles = (color = colors.primary) =>
	StyleSheet.create({
		button: {
			marginVertical: 5,
		},
		whiteLabel: {
			color: 'white',
		},
		colorLabel: {
			color: color,
		},
		outline: {
			borderColor: color,
		},
	})
