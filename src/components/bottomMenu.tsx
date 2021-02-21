import React, { useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, View, Text, Share } from 'react-native'
import BottomSheet, { BottomSheetScrollView, BottomSheetBackgroundProps, BottomSheetBackdropProps, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { MenuComponent } from 'display-api/lib/components/menu'
import colors from '../utils/colors'
import { Divider, Portal, TouchableRipple } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useMutation } from 'urql'
import { SET_NOTIFS, SET_STARRED } from '../api/gql'

export const BottomMenu = forwardRef(({ menu }: { menu: MenuComponent }, ref) => {

    type StarredResult = { setStarred: { id: number, starred: boolean } }
    type StarredRequest = { blockId: number; starred: boolean }
    const [starredResult, setStarred] = useMutation<StarredResult, StarredRequest>(SET_STARRED)

    type NotifsResult = { setNotifs: { id: number, notifEnabled: boolean } }
    type NotifsRequest = { blockId: number; enabled: boolean }
    const [notifsResult, setNotifs] = useMutation<NotifsResult, NotifsRequest>(SET_NOTIFS)


    // hooks
    const sheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['0%', '80%'], [])

    const handleSheetChange = useCallback(index => {
        console.log('handleSheetChange', index)
    }, [])

    useImperativeHandle(ref, () => ({
        handleOpen() {
            sheetRef.current?.snapTo(1)
        }
    }))

    const handleClose = useCallback(() => {
        sheetRef.current?.close()
    }, [])

    const handleShare = useCallback(() => {
        sheetRef.current?.close()
        Share.share({
            message: `https://app.loop.page/b/${menu.block_id}`
        })
    }, [])

    const handleStarring = () => {
        const request: StarredRequest = { blockId: menu.block_id, starred: !menu.star_button.starred }
        setStarred(request)
    }

    const handleNotifs = () => {
        const request: NotifsRequest = { blockId: menu.block_id, enabled: !menu.notifications_enabled }
        setNotifs(request)
    }

    const renderItem = useCallback(
        (title, onClick, subtitle?, icon?) => (
            <TouchableRipple onPress={onClick}>
                <>
                    <View key={title} style={styles.itemContainer}>
                        <Text style={styles.itemTitle}>{title}</Text>
                        <View style={styles.itemRightView}>
                            {icon != null ? <MaterialCommunityIcons name={icon} color={colors.starring} size={20} /> : null}
                            {subtitle != null ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
                        </View>
                    </View>
                    <Divider style={styles.separator} />
                </>
            </TouchableRipple>
        ), []
    )

    const backgroundComponent = ({ style }: BottomSheetBackgroundProps) => {
        return <View style={[style, styles.bottomSheet]} />
    }

    const backdropComponent = (props: BottomSheetBackdropProps) => {
        return <BottomSheetBackdrop {...props} enableTouchThrough={true} />
    }

    return (
        <Portal>
            <BottomSheet
                ref={sheetRef}
                index={-1}
                backgroundComponent={backgroundComponent}
                backdropComponent={backdropComponent}
                snapPoints={snapPoints}
                onChange={handleSheetChange}>
                <BottomSheetScrollView>
                    {menu.star_button &&
                        renderItem(
                            menu.star_button.starred ? 'Unstar' : 'Star',
                            handleStarring,
                            menu.star_button.count,
                            menu.star_button.starred ? 'star' : 'star-outline')
                    }
                    {renderItem(
                            menu.notifications_enabled ? 'Disable Notification' : 'Enable Notification',
                            handleNotifs,
                            null,
                            menu.notifications_enabled ? 'bell' : 'bell-off')
                    }
                    {menu.permissions &&
                        renderItem(
                            'Permissions',
                            handleClose,
                            menu.permissions?.full + menu.permissions.edit + menu.permissions?.view)
                    }
                    {renderItem(
                        'Share',
                        handleShare,
                    )}
                </BottomSheetScrollView>
            </BottomSheet>
        </Portal>
    )
})

const styles = StyleSheet.create({
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
        color: colors.white,
        fontSize: 16,
        fontWeight: '400',
    },
    itemSubtitle: {
        color: colors.white,
        opacity: 0.5,
        fontSize: 16,
        fontWeight: '400',
        marginLeft: 10,
    },
    itemRightView: {
        flexDirection: 'row',
    },
    separator: {
        backgroundColor: '#404040'
    }
})