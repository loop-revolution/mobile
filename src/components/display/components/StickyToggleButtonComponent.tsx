import React, { useState } from 'react'
import { StickyToggleButtonArgs } from 'display-api'
import { ButtonComponent } from './ButtonComponent'
import { blockMethod, setMethodVariable } from '../method'
import { useNavigation } from '@react-navigation/core'
import routes from '../../../navigation/routes'
import { redirectTo } from '../../../utils/helper'

export const StickyToggleButtonComponent = ({ button, name, on_change, default_value }: StickyToggleButtonArgs) => {
	const [isEnabled, setEnabled] = useState<boolean>(default_value)
	const navigation = useNavigation()

	const onChange = async () => {
		setEnabled(!isEnabled)
		name && setMethodVariable(name, isEnabled)

		if (on_change?.search) {
			navigation.navigate(routes.SEARCH, { searchComponent: on_change?.search })
		} else if (on_change?.redirect) {
			redirectTo(on_change?.redirect?.app_path, navigation)
		} else if (on_change?.method) {
			const response = await blockMethod(on_change?.method)
			if (response.error) {
				//TODO: Handle error based on usage.
			}
		}
	}

	return (
		<ButtonComponent
			text={button.text}
			color_scheme={isEnabled ? button.color_scheme : 'gray'}
			variant={button.variant}
			icon={button.icon}
			size={button.size}
			disabled={button.disabled}
			readonly={button.readonly}
			onChange={onChange}
		/>
	)
}
