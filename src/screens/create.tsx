import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator, Card, Text, Title } from 'react-native-paper'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useQuery } from 'urql'
import { BLOCK_TYPES } from '../api/gql'
import { BlockType } from '../api/types'
import routes from '../navigation/routes'
import colors from '../utils/colors'
import { getComponentIcon } from '../utils/componentIcon'


export const Create = ({ navigation }) => {

    type BlockTypesResult = { blockTypes: Array<BlockType> }
    const [blockTypesResponse] = useQuery<BlockTypesResult>({
        query: BLOCK_TYPES,
    })

    const blockTypes = blockTypesResponse.data?.blockTypes

    const renderItem = ({ item }: { item: BlockType }) => {

        return (
            <Card style={styles.card} onPress={() => { navigation.push(routes.CREATE_BLOCK, item)}}>
                <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons color={colors.primary} name={getComponentIcon(item)} size={50} />
                    <Text style={styles.cardText}>{item.name}</Text>
                </Card.Content>
            </Card>
        )
    }

    if (!blockTypes) {
        return <ActivityIndicator
            {...null}
            style={styles.activityIndicator}
            color={Colors.primary} />
    }

    return (
        <View style={styles.viewContainer}>
            <FlatList
                numColumns={2}
                style={styles.flatList}
                data={blockTypes}
                renderItem={renderItem}
                keyExtractor={(item) => item.name}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {

    },
    activityIndicator: {
        flex: 1
    },
    flatList: {
        margin: 5
    },
    card: {
        flex: 1,
        margin: 5,
        aspectRatio: 1,
    },
    cardContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    cardText: {
        fontSize: 16,
        fontWeight: '400',
    }
})