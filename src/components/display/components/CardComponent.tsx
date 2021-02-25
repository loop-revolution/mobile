import React, { useRef, useState } from 'react'
import { CardArgs } from "display-api"
import { Card, IconButton, List } from "react-native-paper"
import colors from '../../../utils/colors'
import { ComponentDelegate } from '../ComponentDelegate'
import { StyleSheet, View } from 'react-native'
import { getComponentIcon } from '../../../utils/utils'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import routes from '../../../navigation/routes'
import { useNavigation } from '@react-navigation/native';
import { BottomMenu } from '../../bottomMenu'

export const CardComponent = ({ header, color, content }: CardArgs) => {

    const [isExpanded, setExpended] = useState(false)

    let menuRef = useRef(null)

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
                <List.Accordion
                    style={styles().header}
                    titleStyle={styles().title}
                    title={header.title}
                    left={LeftContent}
                    expanded={isExpanded}
                    onPress={() => {
                        //TODO: Temporary solution, there is a PR active to configure the 
                        //right item for this library.
                        if (isExpanded) {
                            menuRef.current?.handleOpen()
                            // navigation.navigate(routes.BLOCK_PAGE, {blockId: header.block_id})
                        }
                        setExpended(!isExpanded)
                    }}>
                    <Card.Content style={styles().cardContent}>
                        <ComponentDelegate component={content} />
                    </Card.Content>
                </List.Accordion>
            ) : <Card.Content style={styles().cardContent}>
                    <ComponentDelegate component={content} />
                </Card.Content>}
                {header && <BottomMenu ref={menuRef} menu={header.menu} />}
        </Card>
    )
}

const styles = (color = colors.primary) => StyleSheet.create({
    cardContainer: {
        marginHorizontal: 5,
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
        minHeight: 50,
    },
    cardContent: {
        padding: 5,
        paddingLeft: 5,
        paddingRight: 5
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
    },
    titleOptions: {
        flexDirection: 'row'
    }
})