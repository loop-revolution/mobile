import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, TouchableRipple, Divider, Appbar } from 'react-native-paper'
import colors from '../../utils/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import routes from '../../navigation/routes'

export const EditProfile = ({ route, navigation }: { route: any; navigation: any }) => {
	const user = route.params?.user

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => {
				return (
					<Appbar.BackAction
						onPress={() => {
							navigation.navigate(routes.PROFILE, { username: user.username })
						}}
					/>
				)
			},
		})
	}, [navigation, route])

	type ItemData = { title: string; subtitle: string; onPress: any }
	const renderItem = ({ title, subtitle, onPress }: ItemData, index: number) => {
		return (
			<TouchableRipple key={title + index?.toString()} onPress={onPress}>
				<>
					<View key={title} style={styles.itemContainer}>
						<Text style={styles.itemTitle}>{title}</Text>
						<View style={styles.itemRightView}>
							<Text style={styles.itemSubtitle}>{subtitle}</Text>
							<MaterialCommunityIcons name={'chevron-right'} color={colors.text} size={30} />
						</View>
					</View>
					<Divider style={styles.separator} />
				</>
			</TouchableRipple>
		)
	}

	const data: ItemData[] = [
		{
			title: 'Display Name',
			subtitle: user.displayName,
			onPress: () => {
				navigation.navigate(routes.CHANGE_DISPLAY_NAME, { user })
			},
		},
		{
			title: 'Username',
			subtitle: user.username,
			onPress: () => {
				navigation.navigate(routes.CHANGE_USER_NAME, { user })
			},
		},
		{
			title: 'Email',
			subtitle: user.email,
			onPress: () => {
				navigation.navigate(routes.CHANGE_EMAIL, { user })
			},
		},
		{
			title: 'Password',
			subtitle: '••••••••',
			onPress: () => {
				navigation.navigate(routes.CHANGE_PASSWORD)
			},
		},
	]

	return <>{data.map(renderItem)}</>
}

const styles = StyleSheet.create({
	flatList: {
		backgroundColor: colors.white,
	},
	itemContainer: {
		paddingVertical: 20,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 15,
	},
	itemTitle: {
		color: colors.text,
		fontSize: 16,
		fontWeight: '600',
	},
	itemSubtitle: {
		color: colors.text,
		opacity: 0.5,
		fontSize: 16,
		fontWeight: '300',
		marginLeft: 10,
	},
	itemRightView: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	separator: {
		height: 1,
		backgroundColor: '#DDDDDD',
	},
})
