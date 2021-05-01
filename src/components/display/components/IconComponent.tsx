import * as React from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { IconArgs } from "display-api"
import { getComponentIcon } from "../../../utils/utils"

export const IconComponent = ({ icon, color }: IconArgs) => {
	const iconColor = color ?? '#5276f3'
	return (
		<MaterialCommunityIcons 
		size={23} 
		style={{ marginTop: 5 }} 
		color={iconColor} 
		name={getComponentIcon(icon)} />
	)
}
