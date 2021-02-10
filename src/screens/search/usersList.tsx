import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { ActivityIndicator, Avatar, Divider, List } from 'react-native-paper'
import { getInitials, textToColor } from '../../utils/utils'
import { globalStyles } from '../../utils/styles'
import { User } from '../../api/types'
import colors from '../../utils/colors'

export const UsersList = ({ users, loading }: { users: Array<User>, loading: boolean }) => {

    const renderUsersItem = ({ item }: { item: User }) => {
        const displayName = item.displayName ? item.displayName : item.username
        const color = textToColor(displayName)
        return (
            <>
                <List.Item
                    title={displayName}
                    titleStyle={styles().title}
                    description={'@' + item.username}
                    descriptionStyle={styles().description}
                    left={() => <Avatar.Text
                        size={40}
                        style={styles(color).avatar}
                        labelStyle={styles().title}
                        label={getInitials(displayName)} />} />
                <Divider />
            </>
        )
    }

    if (loading) {
        return (
            <ActivityIndicator
                {...null}
                style={globalStyles.flex1}
                color={colors.primary} />
        )
    }

    return (
        <View style={globalStyles.flex1}>
            {users ?
                <FlatList
                    style={styles().flatList}
                    data={users}
                    renderItem={renderUsersItem}
                    keyExtractor={(item) => item.username} /> : null}
        </View>
    )
}

const styles = (color = colors.primary) => StyleSheet.create({
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
})