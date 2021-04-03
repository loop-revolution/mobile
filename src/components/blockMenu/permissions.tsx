import { SearchComponent } from 'display-api'
import { MenuComponent } from 'display-api/lib/components/menu'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, SectionList } from 'react-native'
import {
	ActivityIndicator,
	Avatar,
	Button,
	Divider,
	List,
	Snackbar,
	Text,
	Title,
	TouchableRipple,
} from 'react-native-paper'
import { useMutation, useQuery } from 'urql'
import { GET_PERMISSIONS, SET_PERMISSIONS, UPDATE_VISIBILITY } from '../../api/gql'
import { Permission, User } from '../../api/types'
import routes from '../../navigation/routes'
import colors from '../../utils/colors'
import { globalStyles } from '../../utils/styles'
import { getInitials, textToColor } from '../../utils/utils'
import { useActionSheet } from '@expo/react-native-action-sheet'

export const Permissions = ({ route, navigation }: { route: any; navigation: any }) => {
	const menu: MenuComponent = route.params?.menu
	let isPublic = menu?.permissions.public

	const [full, setFull] = useState([])
	const [edit, setEdit] = useState([])
	const [view, setView] = useState([])
	const [saveEnabled, setSaveEnabled] = useState(false)
	const [isLoading, setLoading] = useState(false)
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const { showActionSheetWithOptions } = useActionSheet()

	type VisibilityResult = { updateVisibility: { id: number; public: boolean } }
	type VisibilityRequest = { blockId: number; public: boolean }
	const [visibilityResult, setVisibility] = useMutation<VisibilityResult, VisibilityRequest>(UPDATE_VISIBILITY)

	type PermissionResult = { blockById: Permission }
	type PermissionRequest = { id: number }
	const [permissionResponse, getPermissions] = useQuery<PermissionResult, PermissionRequest>({
		query: GET_PERMISSIONS,
		variables: { id: menu.block_id },
	})

	type SetPermissionRequest = { blockId: number; full: Array<number>; edit: Array<number>; view: Array<number> }
	const [, setPermissions] = useMutation<PermissionResult, SetPermissionRequest>(SET_PERMISSIONS)

	useEffect(() => {
		getPermissions()
	}, [])

	const permissionsData = [
		{ title: 'Full', data: full },
		{ title: 'Edit', data: edit },
		{ title: 'Read-Only', data: view },
	]

	if (visibilityResult.data?.updateVisibility) {
		isPublic = visibilityResult.data?.updateVisibility.public
	}

	useEffect(() => {
		if (permissionResponse.data?.blockById) {
			const permissions = permissionResponse.data?.blockById
			setFull(permissions.full)
			setEdit(permissions.edit)
			setView(permissions.view)
		}
	}, [permissionResponse])

	useEffect(() => {
		const blockById = permissionResponse.data?.blockById

		const hasFullChanged = blockById?.full.length !== full.length || blockById?.full.some((e, i) => e.id !== full[i].id)
		const hasEditChanged = blockById?.edit.length !== edit.length || blockById?.edit.some((e, i) => e.id !== edit[i].id)
		const hasViewChanged = blockById?.view.length !== view.length || blockById?.view.some((e, i) => e.id !== view[i].id)

		setSaveEnabled(hasFullChanged || hasEditChanged || hasViewChanged)
	}, [view, edit, full])

	// Capturing data from the child component
	React.useEffect(() => {
		if (route.params?.user) {
			const exists = view.some(e => e.id === route.params?.user.id)
			if (!exists) {
				setView(oldView => [...oldView, route.params?.user])
			}
		}
	}, [route.params?.user])

	const handlePermissions = () => {
		const request: VisibilityRequest = { blockId: menu?.block_id, public: !isPublic }
		setVisibility(request)
	}

	const onSubmit = () => {
		const fullIds = full.map(({ id }: User) => {
			return id
		})
		const editIds = edit.map(({ id }: User) => {
			return id
		})
		const viewIds = view.map(({ id }: User) => {
			return id
		})

		const request: SetPermissionRequest = {
			blockId: menu?.block_id,
			full: fullIds,
			edit: editIds,
			view: viewIds,
		}
		setLoading(true)
		setPermissions(request).then(async ({ data }) => {
			setLoading(false)
			if (data != undefined) {
				setSnackbarVisible(true)
			}
		})
	}

	const removeUser = (item: User) => {
		setView(oldValue => oldValue.filter(e => e.id !== item.id))
		setEdit(oldValue => oldValue.filter(e => e.id !== item.id))
		setFull(oldValue => oldValue.filter(e => e.id !== item.id))
	}

	const updatePermissionType = (item: User, index: number) => {
		const destination = index === 0 ? full : index === 1 ? edit : index === 2 ? view : undefined
		if (!destination) {
			return
		}
		const setDestination = index === 0 ? setFull : index === 1 ? setEdit : setView
		const exists = destination.some(e => e.id === item.id)
		if (!exists) {
			removeUser(item)
			setDestination(oldValue => [...oldValue, item])
		}
	}

	const showActionSheet = (item: User) => {
		const options = ['Full', 'Edit', 'Read-Only', 'Remove', 'Cancel']
		const cancelButtonIndex = 4
		const destructiveButtonIndex = 3
		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
			},
			index => {
				if (index === destructiveButtonIndex) {
					removeUser(item)
				} else {
					updatePermissionType(item, index)
				}
			},
		)
	}

	const renderItem = (item: User, section: any) => {
		const displayName = item.displayName ? item.displayName : item.username
		const color = textToColor(displayName)
		return (
			<View>
				<List.Item
					title={displayName}
					titleStyle={styles().title}
					description={'@' + item.username}
					descriptionStyle={styles().description}
					onPress={() => showActionSheet(item)}
					left={() => (
						<Avatar.Text
							size={40}
							style={styles(color).avatar}
							labelStyle={styles().title}
							label={getInitials(displayName)}
						/>
					)}
					right={() => <Text style={styles().right}>{section.title}</Text>}
				/>
				<Divider />
			</View>
		)
	}

	if (!permissionResponse.data) {
		return <ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
	}

	return (
		<View style={styles().viewContainer}>
			<TouchableRipple onPress={handlePermissions}>
				<>
					<View style={styles().itemContainer}>
						<Text style={styles().itemTitle}>Visibility</Text>
						<View style={styles().itemRightView}>
							<Text style={styles().itemSubtitle}>{isPublic ? 'Public' : 'Private'}</Text>
						</View>
					</View>
					<Divider style={styles().separator} />
				</>
			</TouchableRipple>
			<View style={styles().permissionsTitleContainer}>
				<Title style={styles().permissionsTitle}>User Permissions</Title>
				<View style={globalStyles.row}>
					<Button
						onPress={() => {
							const searchComponent: SearchComponent = {
								cid: 'search',
								type: 'User',
								action_text: 'Select User',
							}
							navigation.navigate(routes.SEARCH, {
								searchComponent: searchComponent,
								manualSelectionRoute: routes.BLOCK_PERMISSIONS,
							})
						}}
						contentStyle={globalStyles.buttonContentStyle}
						labelStyle={{ color: colors.primary }}
					>
						Add
					</Button>
					<Button
						disabled={!saveEnabled}
						onPress={onSubmit}
						contentStyle={globalStyles.buttonContentStyle}
						loading={isLoading}
						labelStyle={{ color: saveEnabled ? colors.primary : colors.subtext }}
					>
						Save
					</Button>
				</View>
			</View>
			<SectionList
				bounces={false}
				style={[styles().list]}
				sections={permissionsData}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ item, section }) => renderItem(item, section)}
				renderSectionHeader={({ section: { title, data } }) =>
					data.length > 0 && <Text style={styles().section}>{title}</Text>
				}
			/>
			<Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
				Permissions updated successfully
			</Snackbar>
		</View>
	)
}

const styles = (color = colors.primary) =>
	StyleSheet.create({
		viewContainer: {
			flex: 1,
		},
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
			marginHorizontal: 10,
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
			backgroundColor: colors.subtext,
		},
		list: {
			margin: 5,
		},
		item: {
			paddingLeft: 10,
		},
		title: {
			fontSize: 16,
			fontWeight: '600',
		},
		permissionsTitleContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		permissionsTitle: {
			fontSize: 16,
			fontWeight: '600',
			marginVertical: 15,
			marginLeft: 15,
		},
		description: {
			fontSize: 12,
			fontWeight: '400',
		},
		avatar: {
			backgroundColor: color,
		},
		section: {
			fontSize: 16,
			fontWeight: '600',
			padding: 10,
		},
		button: {
			marginHorizontal: 30,
		},
		right: {
			fontSize: 12,
			fontWeight: '400',
			alignSelf: 'center',
			marginRight: 10,
		},
	})
