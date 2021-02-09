import React from 'react'
import { CardArgs } from "display-api"
import { Card, IconButton } from "react-native-paper"
import colors from '../../../utils/colors'
import { ComponentDelegate } from '../ComponentDelegate'
import { StyleSheet, View } from 'react-native'
import { getComponentIcon } from '../../../utils/componentIcon'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import routes from '../../../navigation/routes'
import { useNavigation } from '@react-navigation/native';

export const CardComponent = ({ header, color, content }: CardArgs) => {

    const navigation = useNavigation();
    color = color || colors.primary
    const LeftContent = () => <MaterialCommunityIcons color={color} name={getComponentIcon(header)} size={25} />
    const RightContent = (content: any) => (
        <View style={styles().titleOptions}>
            <IconButton color={color} icon='dots-horizontal' onPress={() => { navigation.navigate(routes.BLOCK_PAGE, {blockId: header.block_id}) }} />
            <IconButton color={color} icon='chevron-down' />
        </View>
    )

    return (
        <Card style={styles(color).cardContainer}>
            {header ? (
                <Card.Title
                    style={styles().header}
                    titleStyle={styles().title}
                    title={header.title}
                    left={LeftContent}
                    right={() => RightContent(content)} />
            ) : null}
            <Card.Content style={styles().cardContent}>
                <ComponentDelegate component={content} />
            </Card.Content>
        </Card>
    )
}

const styles = (color = colors.primary) => StyleSheet.create({
    cardContainer: {
        marginHorizontal: 10,
        marginVertical: 5,
        elevation: 0,
        borderColor: '#D7DADE',
        borderWidth: 1,
        borderLeftColor: color,
        borderLeftWidth: 5,
        borderRadius: 5
    },
    header: {
        borderBottomColor: '#EBEAF5',
        borderBottomWidth: 1,
        minHeight: 50
    },
    cardContent: {
        marginTop: 15
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
    },
    titleOptions: {
        flexDirection: 'row'
    }
})