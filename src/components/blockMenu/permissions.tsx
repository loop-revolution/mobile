import { MenuComponent } from 'display-api/lib/components/menu'
import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { Divider, Text, TouchableRipple } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'
import { UPDATE_VISIBILITY } from '../../api/gql'
import colors from '../../utils/colors'

export const Permissions = ({ route, navigation }) => {

    const menu: MenuComponent = route.params?.menu
    let isPublic = menu?.permissions.public

    type VisibilityResult = { updateVisibility: { id: number, public: boolean } }
    type VisibilityRequest = { blockId: number; public: boolean }
    const [visibilityResult, setVisibility] = useMutation<VisibilityResult, VisibilityRequest>(UPDATE_VISIBILITY)

    if (visibilityResult.data?.updateVisibility) {
        isPublic = visibilityResult.data?.updateVisibility.public
    }

    const handlePermissions = () => {
        const request: VisibilityRequest = { blockId: menu?.block_id, public: !isPublic }
        setVisibility(request)
    }

    return (
        <View style={styles.viewContainer}>
            <TouchableRipple onPress={handlePermissions}>
                <>
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>Visibility</Text>
                        <View style={styles.itemRightView}>
                            <Text style={styles.itemSubtitle}>{isPublic ? 'Public' : 'Private'}</Text>
                        </View>
                    </View>
                    <Divider style={styles.separator} />
                </>
            </TouchableRipple>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1
    },
    bottomSheet: {
        backgroundColor: colors.navigationPrimary,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    backdrop: {
        backgroundColor: '#272C2F',
        opacity: 0.3
    },
    itemContainer: {
        padding: 6,
        paddingVertical: 20,
        margin: 6,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    itemSubtitle: {
        opacity: 0.5,
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 10,
    },
    itemRightView: {
        flexDirection: 'row',
    },
    separator: {
        backgroundColor: colors.subtext
    }
})