import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator, Title } from 'react-native-paper'
import colors from '../utils/colors'
import { globalStyles } from '../utils/styles'

export const BreadcrumbHeader = ({
	title,
	route,
	navigation,
}: {
	title: string
	expanded: boolean
	route: any
	navigation: any
}) => {
	const toggle = () => {
		navigation.setParams({ isBlockListExpanded: !route.params.isBlockListExpanded })
	}

	if (!title) {
		return <ActivityIndicator {...null} style={globalStyles.flex1} color={colors.white} />
	}

	return (
		<TouchableOpacity
			style={styles.titleOptions}
			onPress={() => {
				toggle()
			}}
		>
			<Title style={[globalStyles.navBarTitle, styles.title]}>{title}</Title>
			<MaterialCommunityIcons style={styles.lock} color={colors.white} name={'lock'} size={15} />
			<MaterialCommunityIcons
				style={styles.chevron}
				color={colors.white}
				name={route.params.isBlockListExpanded ? 'chevron-up' : 'chevron-down'}
				size={25}
			/>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	titleOptions: {
		flexDirection: 'row',
	},
	title: {
		color: colors.white,
		alignSelf: 'center',
	},
	lock: {
		alignSelf: 'center',
		marginLeft: 10,
	},
	chevron: {
		alignSelf: 'center',
		marginLeft: 5,
	},
})
