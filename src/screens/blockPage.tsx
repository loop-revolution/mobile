import { View, StyleSheet } from "react-native"
import React from 'react'
import { useQuery } from "urql"
import { GET_BLOCK } from "../api/gql"
import { DisplayObject } from "display-api"
import { ActivityIndicator, Title, Portal, Modal } from "react-native-paper"
import { globalStyles } from "../utils/styles"
import colors from "../utils/colors"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { ComponentDelegate } from "../components/display/ComponentDelegate"
import { BreadcrumbHeader } from "../components/breadcrumbHeader"
import { BlockCrumbs } from "../api/types"
import { BreadcrumbList } from "../components/breadcrumbList"
import { BlocksList } from "./search/blocksList"


export const BlockPage = ({ route, navigation }) => {

    type BlockResult = { blockById: { pageDisplay: string, breadcrumb: BlockCrumbs } }
    type BlockRequest = { id: number }

    const blockId: number = Number(route.params.blockId)

    const [blockResponse] = useQuery<BlockResult, BlockRequest>({
        query: GET_BLOCK,
        variables: { id: blockId }
    })

    let display: DisplayObject
    let block = blockResponse.data?.blockById

    if (block?.pageDisplay) {
        display = JSON.parse(block.pageDisplay)
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: (props: any) => (
                <BreadcrumbHeader
                    {...props}
                    navigation={navigation}
                    route={route}
                    title={display?.meta.page.header} />
            )
        })
    }, [navigation, display]);
    
    return (
        <View style={globalStyles.flex1}>
            <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
                <SafeAreaView>
                    {display ? (
                        <View>
                            {display.meta.page.header ? <Title>{display.meta.page.header}</Title> : null}
                            <ComponentDelegate component={display.display} />
                        </View>
                    ) : (
                            <ActivityIndicator
                                {...null}
                                style={globalStyles.flex1}
                                color={colors.primary} />
                        )
                    }
                </SafeAreaView>
            </ScrollView>
            {block?.breadcrumb && (
                <BreadcrumbList
                    navigation={navigation}
                    route={route}
                    breadcrumb={block.breadcrumb}
                    isVisible={route.params?.isBlockListExpanded} />
            )}
        </View >
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flex: 1,
        paddingHorizontal: 30,
    }
})