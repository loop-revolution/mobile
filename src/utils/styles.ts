import { StyleSheet } from 'react-native'
import colors from './colors'

export const globalStyles = StyleSheet.create({
	buttonContentStyle: {
		height: 50,
	},
	navBarTitle: {
		alignSelf: 'flex-start',
		fontSize: 18,
		fontWeight: '500',
	},
	flex1: {
		flex: 1,
	},
	error: {
		color: colors.error,
		textAlign: 'center',
		marginTop: 10,
	},
})
