import * as React from 'react'
import { useNavigation } from '@react-navigation/core'
import { LinkArgs } from 'display-api'
import { Linking } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { redirectTo } from '../../../utils/helper'
import { TextComponent } from './TextComponent'
import colors from '../../../utils/colors'

export const LinkComponent = ({ text, app_path, url, no_style }: LinkArgs) => {
	const navigation = useNavigation()

	text.color = no_style ? text.color : colors.text
	text.underline = !no_style

	const onPress = () => {
		if (app_path) {
			redirectTo(app_path, navigation)
		} else if (url && Linking.canOpenURL(url)) {
			Linking.openURL(url)
		}
	}

	return <TouchableRipple onPress={onPress}>{TextComponent({ ...text }, { isLink: true })}</TouchableRipple>
}
