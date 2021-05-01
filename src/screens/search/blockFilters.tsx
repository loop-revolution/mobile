import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { Text, Divider, TouchableRipple, Switch, Button } from 'react-native-paper'
import colors from '../../utils/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import routes from '../../navigation/routes'
import { useActionSheet } from '@expo/react-native-action-sheet'

export const BlockFilters = ({ route, navigation }: { route: any; navigation: any }) => {
	const { showActionSheetWithOptions } = useActionSheet()

	console.log('route.params?.filterObject: ', route.params?.filterObject)
	let filterObject = route.params?.filterObject
	const setFilterObject: Function = route.params?.setFilterObject

	// set BlockType retured from create routes
	filterObject.blockType = route.params?.blockType?.name ?? filterObject.blockType
	setFilterObject(filterObject)

	// set Owner retured from search routes
	filterObject.owner = route.params?.user ?? filterObject.owner
	setFilterObject(filterObject)

	const sortingOptions = ['Star count', 'Last updated', 'Creation date', 'Cancel']
	const filterObjectSortIndex = filterObject?.sortBy && sortingOptions.indexOf(filterObject?.sortBy)

	const [sortIndex, setSortIndex] = useState(filterObjectSortIndex)
	const [onlyStarred, setOnlyStarred] = useState(false)

	const filters = [
		{ key: 'sort', title: 'Sort' },
		{ key: 'owner', title: 'Owner' },
		{ key: 'blockType', title: 'Block Type' },
		{ key: 'onlyStarred', title: 'Only Starred' },
	]

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<Button
						color={colors.white}
						onPress={() => {
							filterObject = null
							setFilterObject({})
							setSortIndex(null)
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
				navigation.push(routes.SEARCH, {
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
				if (index !== 3) {
					setSortIndex(index)
					const sortByValue = sortingOptions[index]
					filterObject.sortBy = sortByValue
					setFilterObject(filterObject)
				}
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
									filterObject.starred = onlyStarred
									setFilterObject(filterObject)
								}}
							/>
						) : (
							<View style={styles.itemRightView}>
								<Text style={styles.itemSubtitle}>
									{item.key === 'sort' && sortIndex !== null && sortingOptions[sortIndex]}
									{item.key === 'owner' &&
										filterObject.owner &&
										(filterObject.owner?.displayName ?? filterObject.owner?.username)}
									{item.key === 'blockType' && filterObject.blockType && filterObject.blockType}
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
