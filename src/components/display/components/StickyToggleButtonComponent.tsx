import React, { useState } from 'react'
import { StickyToggleButtonArgs } from 'display-api'
import { ButtonComponent } from './ButtonComponent'

export const StickyToggleButtonComponent = ({ button, name, on_change, default_value }: StickyToggleButtonArgs) => {
	const [isEnabled, setEnabled] = useState<boolean>(default_value)

	const onChange = () => {
		setEnabled(!isEnabled)
	}

	return (
		<ButtonComponent
			text={name ? name : button.text}
			color_scheme={isEnabled ? button.color_scheme : 'gray'}
			variant={button.variant}
			icon={button.icon}
			size={button.size}
			disabled={button.disabled}
			readonly={button.readonly}
			interact={on_change}
			onChange={onChange}
		/>
	)
}
