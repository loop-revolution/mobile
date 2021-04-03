import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { Text, Divider, TouchableRipple, Switch, Button } from 'react-native-paper'
import colors from '../../utils/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/core'
import routes from '../../navigation/routes'
import { useActionSheet } from '@expo/react-native-action-sheet'

export const BlockFilters = () => {
	const navigation = useNavigation()
	const { showActionSheetWithOptions } = useActionSheet()

	const [onlyStarred, setOnlyStarred] = useState(false)
	const [sortIndex, setSortIndex] = useState(null)

	const filters = [
		{ key: 'sort', title: 'Sort' },
		{ key: 'owner', title: 'Owner' },
		{ key: 'blockType', title: 'Block Type' },
		{ key: 'onlyStarred', title: 'Only Starred' },
	]
	const sortingOptions = ['Star count', 'Last updated', 'Creation date', 'Cancel']

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<Button
						color={colors.white}
						onPress={() => {
							setOnlyStarred(false)
						}}
					>
						Reset
					</Button>
				)
			},
		})
	}, [navigation])

	const onPress = (item: { key: string; title: string }) => {
		switch (item.key) {
			case 'sort':
				showSortingOptions()
				return
			case 'owner':
				navigation.navigate(routes.SEARCH, {
					searchComponent: { cid: 'search', type: 'User', action_text: 'Search Owner' },
					manualSelectionRoute: routes.BLOCK_FILTERS,
				})
				return
			case 'blockType':
				navigation.navigate(routes.CREATE, { isGrid: false, returningRoute: routes.BLOCK_FILTERS })
				return
		}
	}

	const showSortingOptions = () => {
		const cancelButtonIndex = 3
		showActionSheetWithOptions(
			{
				options: sortingOptions,
				cancelButtonIndex,
			},
			index => {
				setSortIndex(index)
			},
		)
	}

	const renderItem = ({ item }: { item: { key: string; title: string } }) => {
		const isSwitch = item.key === 'onlyStarred'
		return (
			<TouchableRipple
				disabled={isSwitch}
				onPress={() => {
					onPress(item)
				}}
			>
				<>
					<View key={item.key} style={styles.itemContainer}>
						<Text style={styles.itemTitle}>{item.title}</Text>
						{isSwitch ? (
							<Switch
								color={colors.primary}
								value={onlyStarred}
								onValueChange={() => {
									setOnlyStarred(!onlyStarred)
								}}
							/>
						) : (
							<View style={styles.itemRightView}>
								<Text style={styles.itemSubtitle}>
									{item.key === 'sort' && sortIndex !== null && sortingOptions[sortIndex]}
								</Text>
								<MaterialCommunityIcons name={'chevron-right'} color={colors.text} size={30} />
							</View>
						)}
					</View>
					<Divider style={styles.separator} />
				</>
			</TouchableRipple>
		)
	}

	return (
		<FlatList
			style={styles.flatList}
			data={filters}
			renderItem={renderItem}
			keyExtractor={(item, index) => index.toString()}
		/>
	)
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
