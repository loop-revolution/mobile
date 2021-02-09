import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Avatar, Divider, List, Searchbar, Text } from 'react-native-paper'
import { useQuery } from 'urql'
import { USER_SEARCH } from '../api/gql'
import { User } from '../api/types'
import colors from '../utils/colors'
import { getInitials, textToColor } from '../utils/utils'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { globalStyles } from '../utils/styles'
import { useTheme } from '@react-navigation/native'

export const Search = () => {
    const [searchQuery, setSearchQuery] = useState(null)
    const [shouldFetch, setFetch] = useState(false)
    const [index, setIndex] = useState(1)
    const [routes] = useState([
        { key: 'blocks', title: 'Blocks' },
        { key: 'people', title: 'People' },
    ])
    
    const theme = useTheme()
    let timeout: any

    type UsersList = Array<User>
    type UserQueryResults = { searchUsers: UsersList }
    type UserQueryRequest = { query: string }

    let [userResult, getUsers] = useQuery<UserQueryResults, UserQueryRequest>({
        query: USER_SEARCH,
        variables: { query: searchQuery },
        pause: !searchQuery || !shouldFetch
    })
    const searchUsers = userResult.data?.searchUsers

    const onChangeSearch = (query: string) => {
        setSearchQuery(query)
        setFetch(false)
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(function () {
            setFetch(true)
        }, 500)
    }

    useEffect(() => {
        if (shouldFetch) {
            getUsers()
        }
    }, [shouldFetch])

    const renderPeopleItem = ({ item }: { item: User }) => {
        const displayName = item.displayName ? item.displayName : item.username
        const color = textToColor(displayName)
        return (
            <>
                <List.Item
                    title={displayName}
                    titleStyle={styles().title}
                    description={'@' + item.username}
                    descriptionStyle={styles().description}
                    left={() => <Avatar.Text size={40} style={styles(color).avatar} label={getInitials(displayName)} />} />
                <Divider />
            </>
        )
    }

    const renderPeopleList = () => (
        <View style={globalStyles.flex1}>
            {searchUsers ?
                <FlatList
                    style={styles().flatList}
                    data={searchUsers}
                    renderItem={renderPeopleItem}
                    keyExtractor={(item) => item.username} /> : null}
        </View>
    )

    const renderBlocksList = () => (
        <View style={globalStyles.flex1}>
        </View>
    )

    const renderTabBar = (props: any) => (
        <View style={styles().tabBarContainer}>
            <TabBar
                {...props}
                renderLabel={({ route, focused }) => (
                    <Text style={focused ? styles().selectedTabLabel : styles().unselectedTabLabel}>
                        {route.title + (searchUsers?.length ? ` (${searchUsers?.length}) ` : '')}
                    </Text>
                )}
                indicatorStyle={styles().indicator}
                style={styles().tabBar} />
        </View>
    )

    const renderScene = SceneMap({
        blocks: renderBlocksList,
        people: renderPeopleList,
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
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex} />
        </View>
    )
}

const styles = (color = colors.primary) => StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    activityIndicator: {
        flex: 1
    },
    flatList: {
        margin: 5
    },
    avatar: {
        backgroundColor: color,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    description: {
        fontSize: 12,
        fontWeight: '400',
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
