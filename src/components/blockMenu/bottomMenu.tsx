import React, { useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, View, Text, Share } from 'react-native'
import {
	BottomSheetScrollView,
	BottomSheetBackgroundProps,
	BottomSheetBackdropProps,
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetModalProvider,
	TouchableOpacity,
} from '@gorhom/bottom-sheet'
import { CustomMenuItem, MenuComponent } from 'display-api/lib/components/menu'
import colors from '../../utils/colors'
import { Divider, Portal } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useMutation } from 'urql'
import { useNavigation } from '@react-navigation/native'
import { SET_NOTIFS, SET_STARRED } from '../../api/gql'
import routes from '../../navigation/routes'
import { redirectTo } from '../../utils/helper'
import { ActionObject } from 'display-api'
import { getComponentIcon } from '../../utils/utils'
import { blockMethod } from '../display/method'

export const BottomMenu = forwardRef(({ menu }: { menu: MenuComponent }, ref) => {
	type StarredResult = { setStarred: { id: number; starred: boolean } }
	type StarredRequest = { blockId: number; starred: boolean }
	const [, setStarred] = useMutation<StarredResult, StarredRequest>(SET_STARRED)

	type NotifsResult = { setNotifs: { id: number; notifEnabled: boolean } }
	type NotifsRequest = { blockId: number; enabled: boolean }
	const [, setNotifs] = useMutation<NotifsResult, NotifsRequest>(SET_NOTIFS)

	// hooks
	const sheetRef = useRef<BottomSheetModal>(null)
	const navigation = useNavigation()

	const snapPoints = useMemo(() => ['0%', '80%'], [])

	const handleSheetChange = useCallback(index => {
		console.log(index)
	}, [])

	useImperativeHandle(ref, () => ({
		handleOpen() {
			sheetRef.current?.present()
		},
	}))

	const handleClose = useCallback(() => {
		sheetRef.current?.dismiss()
	}, [])

	const handleShare = useCallback(() => {
		handleClose()
		Share.share({
			message: `https://app.loop.page/b/${menu.block_id}`,
		})
	}, [])

	const handleStarring = () => {
		const request: StarredRequest = { blockId: menu.block_id, starred: !menu.star_button.starred }
		setStarred(request)
	}

	const handleComments = () => {
		handleClose()
		navigation.navigate(routes.BLOCK_COMMENTS, { blockId: menu.block_id })
	}

	const handleNotifs = () => {
		const request: NotifsRequest = { blockId: menu.block_id, enabled: !menu.notifications_enabled }
		setNotifs(request)
	}

	const handlePermissions = () => {
		handleClose()
		navigation.navigate(routes.BLOCK_PERMISSIONS, { menu })
	}

	const onPressCustomItem = async (interact: ActionObject) => {
		handleClose()
		if (interact?.search) {
			navigation.navigate(routes.SEARCH, { searchComponent: interact?.search })
		} else if (interact?.redirect) {
			redirectTo(interact.redirect?.app_path, navigation)
		} else if (interact?.method) {
			const response = await blockMethod(interact?.method)
			if (response.error) {
				//TODO: Handle error based on usage.
			}
		}
	}

	const renderItem = useCallback(
		(title: string, onClick: any, subtitle?: any, icon?: any, disabled: boolean = false) => (
			<TouchableOpacity onPress={onClick} disabled={disabled} style={disabled && styles.disabled}>
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
			</TouchableOpacity>
		),
		[],
	)

	const backgroundComponent = ({ style }: BottomSheetBackgroundProps) => {
		return <View style={[style, styles.bottomSheet]} />
	}

	const backdropComponent = (props: BottomSheetBackdropProps) => {
		return <BottomSheetBackdrop {...props} enableTouchThrough={true} disappearsOnIndex={1} />
	}

	return (
		<Portal>
			<BottomSheetModalProvider>
				<BottomSheetModal
					ref={sheetRef}
					index={1}
					backgroundComponent={backgroundComponent}
					backdropComponent={backdropComponent}
					snapPoints={snapPoints}
					onChange={handleSheetChange}
				>
					<BottomSheetScrollView>
						{menu.custom &&
							menu.custom.map(({ icon, text, interact, disabled }: CustomMenuItem) =>
								renderItem(text, onPressCustomItem.bind(this, interact), null, getComponentIcon(icon), disabled),
							)}
						{menu.star_button &&
							renderItem(
								menu.star_button.starred ? 'Unstar' : 'Star',
								handleStarring,
								menu.star_button.count,
								menu.star_button.starred ? 'star' : 'star-outline',
							)}

						{renderItem(
							'Comments',
							handleComments,
							menu.comment_count,
							menu.comment_count > 0 ? 'message' : 'message-outline',
						)}
						{renderItem(
							menu.notifications_enabled ? 'Disable Notification' : 'Enable Notification',
							handleNotifs,
							null,
							menu.notifications_enabled ? 'bell-outline' : 'bell-off-outline',
						)}
						{menu.permissions &&
							renderItem(
								'Permissions',
								handlePermissions,
								menu.permissions?.full + menu.permissions?.edit + menu.permissions?.view,
							)}

						{renderItem('Share', handleShare)}
					</BottomSheetScrollView>
				</BottomSheetModal>
			</BottomSheetModalProvider>
		</Portal>
	)
})

const styles = StyleSheet.create({
	bottomSheet: {
		backgroundColor: colors.navigationPrimary,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	backdrop: {
		backgroundColor: '#272C2F',
		opacity: 0.3,
	},
	itemContainer: {
		padding: 6,
		paddingVertical: 20,
		margin: 6,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 20,
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
		backgroundColor: '#404040',
	},
	disabled: {
		opacity: 0.5,
	},
})
