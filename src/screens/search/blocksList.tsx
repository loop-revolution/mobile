import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { ActivityIndicator, Divider, List } from 'react-native-paper'
import { textToColor } from '../../utils/utils'
import { globalStyles } from '../../utils/styles'
import { BlockCrumbs } from '../../api/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../../utils/colors'

export const BlocksList = ({ blocks, loading }: { blocks: Array<BlockCrumbs>, loading: boolean }) => {

    console.log(blocks)

    const renderBlocksItem = ({ item }: { item: BlockCrumbs }) => {
        const displayName = item.map(({name}) => name).join(' / ')
        const color = textToColor(displayName)
        return (
            <>
                <List.Item
                    title={displayName}
                    titleStyle={styles.title}
                    left={() => <MaterialCommunityIcons color={color} name={'folder-outline'} size={25} />} />
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
            {blocks ?
                <FlatList
                    style={styles.flatList}
                    data={blocks}
                    renderItem={renderBlocksItem}
                    keyExtractor={(item) => item.map(({blockId}) => blockId).join('.')} /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    activityIndicator: {
        flex: 1
    },
    flatList: {
        margin: 5
    },
    title: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '400',
    },
})