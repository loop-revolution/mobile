import { View, StyleSheet } from "react-native"
import React, { useContext } from 'react'
import { useQuery } from "urql"
import { GET_BLOCK } from "../api/gql"
import { DisplayObject } from "display-api"
import { ActivityIndicator, Title, Portal, Modal, Subheading } from "react-native-paper"
import { globalStyles } from "../utils/styles"
import colors from "../utils/colors"
import { ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { ComponentDelegate } from "../components/display/ComponentDelegate"
import { BreadcrumbHeader } from "../components/breadcrumbHeader"
import { Block, BlockCrumbs } from "../api/types"
import { BreadcrumbList } from "../components/breadcrumbList"
import { BlocksList } from "./search/blocksList"
import { UserContext } from "../context/userContext"


export const BlockPage = ({ route, navigation }) => {

    type BlockResult = { blockById:  Block}
    type BlockRequest = { id: number }
    const { user } = useContext(UserContext)

    const blockId: number = route.params?.blockId ? Number(route.params.blockId) : user?.root?.id
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
                    ) : user && !blockId ? (
                        <Subheading style={styles.subheading}>No Blocks Found! Go ahead and create one from the bottom menu.</Subheading>
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
    },
    subheading: {
        textAlign: 'center'
    }
})