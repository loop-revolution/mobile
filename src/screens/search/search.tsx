import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Searchbar, Text } from 'react-native-paper'
import { useQuery } from 'urql'
import { BLOCK_SEARCH, USER_SEARCH } from '../../api/gql'
import { User, BlockResults, BlockSortType, Block, Crumb } from '../../api/types'
import colors from '../../utils/colors'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { UsersList } from './usersList'
import { BlocksList } from './blocksList'
import { SearchComponent } from 'display-api/lib/components/search'
import { blockMethod, setMethodVariable } from '../../components/display/method'
import routes from '../../navigation/routes'
import { useIsFocused } from '@react-navigation/core'

export const Search = ({ route, navigation }: { route: any; navigation: any }) => {
	type BlockSearchFilters = { starred?: boolean; blockType?: string; ownerId?: number }
	type BlockQueryResults = { searchBlocks: Array<BlockResults> }
	type BlockQueryRequest = { query: string; filters?: BlockSearchFilters; sortBy?: BlockSortType }

	type UserQueryResults = { searchUsers: Array<User> }
	type UserQueryRequest = { query: string }
	type BlockFilterType = {
		sortBy?: { key: BlockSortType; name: string }
		blockType?: string
		owner?: User
		starred?: boolean
	}

	const [searchQuery, setSearchQuery] = useState(null)
	const [shouldFetch, setFetch] = useState(false)
	const [index, setIndex] = useState(1)
	const [tabRoutes] = useState([
		{ key: 'blocks', title: 'Blocks' },
		{ key: 'people', title: 'People' },
	])
	const [filterObject, setFilterObject] = useState<BlockFilterType>({
		sortBy: undefined,
		blockType: undefined,
		owner: undefined,
		starred: false,
	})

	const [userResult, getUsers] = useQuery<UserQueryResults, UserQueryRequest>({
		query: USER_SEARCH,
		variables: { query: searchQuery },
		pause: !searchQuery || !shouldFetch,
	})
	const [blockResult, getBlocks] = useQuery<BlockQueryResults, BlockQueryRequest>({
		query: BLOCK_SEARCH,
		variables: {
			query: searchQuery,
			filters: {
				blockType: filterObject?.blockType,
				starred: filterObject?.starred,
				ownerId: filterObject?.owner?.id,
			},
			sortBy: filterObject?.sortBy?.key,
		},
		pause: !searchQuery || !shouldFetch,
	})

	const isFocused = useIsFocused()

	const searchComponent: SearchComponent = route.params?.searchComponent
	const manualSelectionRoute: string = route.params?.manualSelectionRoute

	useEffect(() => {
		setFetch(true)
	}, [isFocused])

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: () => searchComponent?.action_text ?? 'Search',
		})
	}, [navigation])

	let timeout: any
	const onChangeSearch = (query: string) => {
		setSearchQuery(query)
		setFetch(false)
		if (timeout) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(function() {
			setFetch(true)
		}, 300)
	}

	useEffect(() => {
		if (shouldFetch) {
			getUsers()
			getBlocks()
		}
	}, [shouldFetch])

	useEffect(() => {
		return () => {
			onCancel()
		}
	}, [])


	// This will be called when the block
	// is selected from the search component
	const onSelectBlockAction = async (blockCrumb: Crumb) => {
		console.log(searchComponent?.then)
		console.log(blockCrumb)
		if (searchComponent?.then) {
			searchComponent?.name && setMethodVariable(searchComponent?.name, blockCrumb.blockId.toString())
			const response = await blockMethod(searchComponent?.then?.method)
			if (response.error) {
				//TODO: handle error
				navigation.pop()
			} else {
				navigation.pop()
			}
		}
	}

	// This will be called when the user
	// is selected from the search component
	const onSelectAction = async (user: User) => {
		if (searchComponent?.then) {
			searchComponent?.name && setMethodVariable(searchComponent?.name, user.id.toString())
			const response = await blockMethod(searchComponent?.then?.method)
			if (response.error) {
				//TODO: handle error
				navigation.pop()
			} else {
				navigation.pop()
			}
		} else if (manualSelectionRoute) {
			// This will be called when there is a manual
			// selectUser action passed from the previous component
			navigation.navigate(manualSelectionRoute, { user })
		}
	}

	const onCancel = async () => {
		console.log('Cancel called')
		if (searchComponent?.cancel) {
			const response = await blockMethod(searchComponent?.cancel?.method)
			if (response.error) {
				//TODO: handle error
				console.log(response.error)
			}
		}
	}

	const renderTabBar = (props: any) => (
		<View style={styles().tabBarContainer}>
			<TabBar
				{...props}
				renderLabel={({ route, focused }) => (
					<Text style={focused ? styles().selectedTabLabel : styles().unselectedTabLabel}>{route.title}</Text>
				)}
				indicatorStyle={styles().indicator}
				style={styles().tabBar}
			/>
			<Button
				disabled={index === 1}
				style={styles().filters}
				onPress={() => {
					navigation.navigate(routes.BLOCK_FILTERS, { filterObject, setFilterObject })
				}}
			>
				Filters
			</Button>
		</View>
	)

	const renderScene = SceneMap({
		blocks: () =>
			BlocksList({
				blocks: blockResult.data?.searchBlocks,
				loading: blockResult.fetching,
			}),
		people: () =>
			UsersList({
				users: userResult.data?.searchUsers,
				loading: userResult.fetching,
			}),
	})

	return (
		<View style={styles().viewContainer}>
			<View style={styles().searchbarContainer}>
				<Searchbar
					style={styles().searchBar}
					inputStyle={styles().searchText}
					autoCapitalize='none'
					placeholder='Search'
					onChangeText={onChangeSearch}
					value={searchQuery}
				/>
			</View>
			{searchComponent?.type === 'Block' ? (
				<BlocksList
					blocks={blockResult.data?.searchBlocks}
					loading={blockResult.fetching}
					selectBlock={searchComponent?.then ? onSelectBlockAction : undefined}
				/>
			) : searchComponent?.type === 'User' ? (
				<UsersList users={userResult.data?.searchUsers} loading={userResult.fetching} selectUser={onSelectAction} />
			) : (
				<TabView
					renderTabBar={renderTabBar}
					navigationState={{ index, routes: tabRoutes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
				/>
			)}
		</View>
	)
}

const styles = () =>
	StyleSheet.create({
		viewContainer: {
			flex: 1,
			backgroundColor: 'white',
		},
		title: {
			fontSize: 16,
			fontWeight: '600',
		},
		selectedTabLabel: {
			color: colors.text,
			fontWeight: '600',
			fontSize: 13,
		},
		unselectedTabLabel: {
			color: colors.text,
			fontWeight: '400',
			fontSize: 13,
		},
		tabBarContainer: {
			backgroundColor: '#EDEFF1',
			borderBottomColor: '#DDDDDD',
			borderBottomWidth: 1,
			flexDirection: 'row',
			alignContent: 'space-between',
		},
		tabBar: {
			marginRight: '20%',
			backgroundColor: 'transparent',
			flex: 2,
		},
		filters: {
			alignSelf: 'center',
			justifyContent: 'flex-end',
		},
		indicator: {
			backgroundColor: colors.primary,
		},
		searchText: {
			color: colors.text,
			fontWeight: '500',
			fontSize: 15,
		},
		searchbarContainer: {
			backgroundColor: colors.navigationPrimary,
		},
		searchBar: {
			marginHorizontal: 10,
			marginVertical: 10,
			borderRadius: 22,
			height: 44,
		},
	})
