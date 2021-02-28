import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { ActivityIndicator, Divider, List } from 'react-native-paper'
import { textToColor } from '../../utils/utils'
import { globalStyles } from '../../utils/styles'
import { BlockCrumbs } from '../../api/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../../utils/colors'
import routes from '../../navigation/routes'
import { useNavigation } from '@react-navigation/native';

export const BlocksList = ({ blocks, loading, selectBlock = null }: { blocks: Array<BlockCrumbs>, loading: boolean, selectBlock?: Function }) => {

    const navigation = useNavigation();

    const renderBlocksItem = ({ item }: { item: BlockCrumbs }) => {
        const lastItem = item.length > 0 ? item[item.length - 1] : null
        if (!lastItem) {
            return <></>
        }
        const displayName = item.map(({ name }) => name).join(' / ')
        const color = textToColor(displayName)
        return (
            <>
                <List.Item
                    title={displayName}
                    titleStyle={styles.title}
                    onPress={() => { selectBlock ? selectBlock(lastItem.blockId) : navigation.navigate(routes.BLOCK_PAGE, { blockId: lastItem.blockId }) }}
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
                    keyExtractor={(item) => item.map(({ blockId }) => blockId).join('.')} /> : null}
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