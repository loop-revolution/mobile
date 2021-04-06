import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Searchbar, Text } from 'react-native-paper'
import { useQuery } from 'urql'
import { BLOCK_SEARCH, USER_SEARCH } from '../../api/gql'
import { User, BlockCrumbs } from '../../api/types'
import colors from '../../utils/colors'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { UsersList } from './usersList'
import { BlocksList } from './blocksList'
import { SearchComponent } from 'display-api/lib/components/search'
import { blockMethod, setMethodVariable } from '../../components/display/method'
import routes from '../../navigation/routes'

export const Search = ({ route, navigation }: { route: any; navigation: any }) => {
	type BlockQueryResults = { searchBlocks: Array<BlockCrumbs> }
	type BlockQueryRequest = { query: string }

	type UserQueryResults = { searchUsers: Array<User> }
	type UserQueryRequest = { query: string }

	const [searchQuery, setSearchQuery] = useState(null)
	const [shouldFetch, setFetch] = useState(false)
	const [blocksLoading, setBlocksLoading] = useState(false)
	const [usersLoading, setUsersLoading] = useState(false)
	const [index, setIndex] = useState(1)
	const [tabRoutes] = useState([
		{ key: 'blocks', title: 'Blocks' },
		{ key: 'people', title: 'People' },
	])

	const [userResult, getUsers] = useQuery<UserQueryResults, UserQueryRequest>({
		query: USER_SEARCH,
		variables: { query: searchQuery },
		pause: !searchQuery || !shouldFetch,
	})
	const [blockResult, getBlocks] = useQuery<BlockQueryResults, BlockQueryRequest>({
		query: BLOCK_SEARCH,
		variables: { query: searchQuery },
		pause: !searchQuery || !shouldFetch,
	})

	const searchComponent: SearchComponent = route.params?.searchComponent
	const manualSelectionRoute: string = route.params?.manualSelectionRoute

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
			setUsersLoading(true)
			setBlocksLoading(true)
			getUsers()
			getBlocks()
		}
	}, [shouldFetch])

	useEffect(() => {
		if (blockResult.data?.searchBlocks) {
			setBlocksLoading(false)
		}
		if (userResult.data?.searchUsers) {
			setUsersLoading(false)
		}
	}, [blockResult, userResult])

	useEffect(() => {
		return () => {
			onCancel()
		}
	}, [])

	// This will be called when the user or block
	// is selected from the search component
	const onSelectAction = async (user: User) => {
		if (searchComponent?.then) {
			searchComponent?.name && setMethodVariable(searchComponent?.name, user.id.toString())
			const response = await blockMethod(searchComponent?.then?.method)
			if (response.error) {
				//TODO: handle error
				console.log(response.error)
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
					navigation.navigate(routes.BLOCK_FILTERS)
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
				loading: blocksLoading,
			}),
		people: () =>
			UsersList({
				users: userResult.data?.searchUsers,
				loading: usersLoading,
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
					loading={blocksLoading}
					selectBlock={searchComponent?.then ? onSelectAction : undefined}
				/>
			) : searchComponent?.type === 'User' ? (
				<UsersList users={userResult.data?.searchUsers} loading={usersLoading} selectUser={onSelectAction} />
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
