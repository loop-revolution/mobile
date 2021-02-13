import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, Card, Dialog, IconButton, Paragraph, Portal, Text } from 'react-native-paper'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useQuery } from 'urql'
import { BLOCK_TYPES } from '../api/gql'
import { BlockType } from '../api/types'
import routes from '../navigation/routes'
import colors from '../utils/colors'
import { getComponentIcon } from '../utils/utils'


export const Create = ({ navigation }) => {

    const [infoVisible, setInfoVisible] = React.useState(false)
    const [info, setInfo] = React.useState(null)

    type BlockTypesResult = { blockTypes: Array<BlockType> }
    const [blockTypesResponse] = useQuery<BlockTypesResult>({
        query: BLOCK_TYPES,
    })
    const blockTypes = blockTypesResponse.data?.blockTypes

    const showDialog = (info: string) => {
        setInfo(info)
        setInfoVisible(true)
    }
    
    const hideDialog = () => {
        setInfoVisible(false)
        setInfo(null)
    }

    const renderItem = ({ item }: { item: BlockType }) => {

        return (
            <Card style={styles.card} onPress={() => { navigation.push(routes.CREATE_BLOCK, item) }}>
                <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons color={colors.primary} name={getComponentIcon(item)} size={50} />
                    <Text style={styles.cardText}>{item.name}</Text>
                </Card.Content>
                <IconButton onPress={() => {showDialog(item.desc)}} style={styles.info} size={20} color={"#CED6DF"} icon='information-outline' />
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
                keyExtractor={(item) => item.name} />
            
            <Portal>
                <Dialog visible={infoVisible} onDismiss={hideDialog}>
                    <Dialog.Content>
                        <Paragraph>{info}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Dismiss</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1
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
        marginTop: 20
    },
    cardText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: '400',
    },
    info: {
        alignSelf: 'flex-end'
    }
})