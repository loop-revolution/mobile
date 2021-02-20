import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Portal } from 'react-native-paper'
import { useQuery } from 'urql'
import { USER_BLOCKS } from '../api/gql'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import { UserContext } from '../context/userContext'
import colors from '../utils/colors'

export const Home = () => {

    const { user } = useContext(UserContext)

    type UserBlocksRequest = { id: number }
    type UserBlocksResult = { userById: { blocks: Array<{ id: number; embedDisplay: string }> } }

    const [blocksResponse] = useQuery<UserBlocksResult, UserBlocksRequest>({
        query: USER_BLOCKS,
        variables: { id: user?.id },
    })
    const blocks = blocksResponse.data?.userById.blocks

    const renderComponent = ({ item }) => {
        return <ComponentDelegate component={JSON.parse(item.embedDisplay)} />
    }

    if (!blocks) {
        return <ActivityIndicator
            {...null}
            style={styles.activityIndicator}
            color={colors.primary} />
    }

    return (
        <View style={styles.viewContainer}>
            <FlatList
                style={styles.flatList}
                data={blocks}
                renderItem={renderComponent}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    activityIndicator: {
        flex: 1
    },
    flatList: {
        paddingTop: 5,
        marginHorizontal: 5
    }
})
