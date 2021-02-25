import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Searchbar, Text } from 'react-native-paper'
import { stringifyVariables, useQuery } from 'urql'
import { BLOCK_SEARCH, USER_SEARCH } from '../../api/gql'
import { User, BlockCrumbs, SearchMode } from '../../api/types'
import colors from '../../utils/colors'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { UsersList } from './usersList'
import { BlocksList } from './blocksList'

export const Search = ({ route, navigation }) => {

    type BlockQueryResults = { searchBlocks: Array<BlockCrumbs> }
    type BlockQueryRequest = { query: string }

    type UserQueryResults = { searchUsers: Array<User> }
    type UserQueryRequest = { query: string }

    const [searchQuery, setSearchQuery] = useState(null)
    const [shouldFetch, setFetch] = useState(false)
    const [blocksLoading, setBlocksLoading] = useState(false)
    const [usersLoading, setUsersLoading] = useState(false)
    const [index, setIndex] = useState(1)
    const [routes] = useState([
        { key: 'blocks', title: 'Blocks' },
        { key: 'people', title: 'People' },
    ])

    const searchMode: SearchMode = route.params?.mode

    let [userResult, getUsers] = useQuery<UserQueryResults, UserQueryRequest>({
        query: USER_SEARCH,
        variables: { query: searchQuery },
        pause: !searchQuery || !shouldFetch
    })
    let [blockResult, getBlocks] = useQuery<BlockQueryResults, BlockQueryRequest>({
        query: BLOCK_SEARCH,
        variables: { query: searchQuery },
        pause: !searchQuery || !shouldFetch
    })

    let timeout: any
    const onChangeSearch = (query: string) => {
        setSearchQuery(query)
        setFetch(false)
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(function () {
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

    const renderTabBar = (props: any) => (
        <View style={styles().tabBarContainer}>
            <TabBar
                {...props}
                renderLabel={({ route, focused }) => (
                    <Text style={focused ? styles().selectedTabLabel : styles().unselectedTabLabel}>
                        {route.title}
                    </Text>
                )}
                indicatorStyle={styles().indicator}
                style={styles().tabBar} />
        </View>
    )

    const renderScene = SceneMap({
        blocks: () => BlocksList({
            blocks: blockResult.data?.searchBlocks,
            loading: blocksLoading
        }),
        people: () => UsersList({
            users: userResult.data?.searchUsers,
            loading: usersLoading
        }),
    })

    return (
        <View style={styles().viewContainer}>
            <View style={styles().searchbarContainer}>
                <Searchbar
                    style={styles().searchBar}
                    inputStyle={styles().searchText}
                    autoCapitalize="none"
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery} />
            </View>
            {searchMode == SearchMode.Block ?
                <BlocksList blocks={blockResult.data?.searchBlocks} loading={blocksLoading} />
                : searchMode == SearchMode.User ?
                    <UsersList users={userResult.data?.searchUsers} loading={usersLoading} />
                    : <TabView
                        renderTabBar={renderTabBar}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex} />
            }

        </View>
    )
}

const styles = () => StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: 'white'
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
    },
    tabBar: {
        marginHorizontal: '15%',
        backgroundColor: 'transparent',
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
        backgroundColor: colors.navigationPrimary
    },
    searchBar: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 22,
        height: 44
    }
})
