import { StyleSheet, View } from 'react-native'
import React from 'react'
import { BlockCrumbs, Crumb } from '../api/types'
import { Card, Modal } from 'react-native-paper'
import { FlatList } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../utils/colors'

export const BreadcrumbList = ({
	breadcrumb,
	isVisible,
	navigation,
	route,
}: {
	breadcrumb: BlockCrumbs
	isVisible: boolean
	navigation: any
	route: any
}) => {
	const onBlockSelected = (item: Crumb) => {
		navigation.setParams({
			blockId: item.blockId,
			isBlockListExpanded: !isVisible,
		})
	}

	const renderBreadcrumbItem = ({ item }: { item: Crumb }) => {
		const blockId = route.params?.blockId

		return (
			<Card onPress={() => onBlockSelected(item)} style={blockId == item.blockId ? styles.selected : null}>
				<Card.Title
					titleStyle={styles.title}
					style={styles.header}
					title={item.name}
					left={() => <MaterialCommunityIcons color={colors.primary} name={'folder-outline'} size={25} />}
				/>
			</Card>
		)
	}

	return (
		<Modal
			visible={isVisible}
			onDismiss={() => {
				navigation.setParams({ isBlockListExpanded: !isVisible })
			}}
			style={styles.modal} >
			{breadcrumb ? (
				<FlatList data={breadcrumb} renderItem={renderBreadcrumbItem} keyExtractor={item => item.blockId.toString()} />
			) : null}
		</Modal>
	)
}

const styles = StyleSheet.create({
	title: {
		fontSize: 14,
		fontWeight: '500',
	},
	header: {
		borderBottomColor: '#EBEAF5',
		borderBottomWidth: 1,
		minHeight: 60,
	},
	modal: {
		justifyContent: 'flex-start', 
		marginTop: 0,
		// backgroundColor: colors.white,
		// position: 'absolute',
		// left: 0,
		// right: 0,
		// top: 0,
	},
	selected: {
		borderWidth: 1,
		borderColor: 'transparent',
		shadowOpacity: 1,
		elevation: 20,
	},
})
