import { useActionSheet } from '@expo/react-native-action-sheet'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/stack'
import { ComponentObject, DisplayObject } from 'display-api'
import React, { useCallback, useRef, useState } from 'react'
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Keyboard, Button as Btn } from 'react-native'
import { FlatList, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ActivityIndicator, Avatar, Button, Caption, Divider, Subheading } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation, useQuery } from 'urql'
import { GET_BLOCK_COMMENTS, SET_STARRED, CREATE_BLOCK, CREATE_COMMENT } from '../../api/gql'
import { Comment } from '../../api/types'
import routes from '../../navigation/routes'
import colors from '../../utils/colors'
import { htmlToJsonCoverstion } from '../../utils/htmlJsonConversion'
import { globalStyles } from '../../utils/styles'
import { formatDate, getInitials, textToColor } from '../../utils/utils'
import { ComponentDelegate } from '../display/ComponentDelegate'
import { RichTextEditor } from '../display/components/RichTextComponent'

export const BlockComments = ({ route, navigation }: { route: any, navigation: any }) => {

	const blockId: number = route.params?.blockId
	const title: string = route.params?.title

	type BlockResult = { blockById: { comments: Array<Comment> } }
	type BlockRequest = { id: number }
	type CreateBlockResult = { createBlock: { id: number } }
	type CreateBlockRequest = { type: string; input: string }
	type CreateCommentResult = { createComment: Comment }
	type CreateCommentRequest = { blockId: number; contentId: number }
	type StarredResult = { setStarred: { id: number; starred: boolean } }
	type StarredRequest = { blockId: number; starred: boolean }

	const headerHeight = useHeaderHeight()
	const safeAreaInsets = useSafeAreaInsets()
	const [value, setValue] = useState<string>("")
	const richTextEditorRef = useRef(null)
	const { showActionSheetWithOptions } = useActionSheet()

	const [, createBlockMut] = useMutation<CreateBlockResult, CreateBlockRequest>(CREATE_BLOCK)
	const [, createCommentMut] = useMutation<CreateCommentResult, CreateCommentRequest>(CREATE_COMMENT)
	const [, setStarred] = useMutation<StarredResult, StarredRequest>(SET_STARRED)
	const [blockResponse] = useQuery<BlockResult, BlockRequest>({
		query: GET_BLOCK_COMMENTS,
		variables: { id: blockId },
	})

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: () => title ?? 'Comments',
		})
	}, [navigation])

	const blockComments: Array<Comment> = blockResponse.data?.blockById?.comments
	if (!blockComments) {
		return <ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
	}

	const onEnter = async () => {
		const components = htmlToJsonCoverstion(value)
		const content = { content: components }
		const input = JSON.stringify(content)
		const type = "text"
		createBlockMut({
			type,
			input,
		}).then((res) => {
			const contentId = res.data?.createBlock?.id
			if (contentId) {
				createCommentMut({ blockId, contentId })
					.then((res) => {
						if (res.data?.createComment?.id) {
							setValue('')
							richTextEditorRef?.current?.reload()
						}
					})
			}
		})
	}

	const showOptions = (item: Comment) => {
		const options = ['Reply', 'Pin', 'Delete', 'Cancel']
		const cancelButtonIndex = 3
		const destructiveButtonIndex = 2
		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
				destructiveButtonIndex,
			},
			index => {
				if (index === 0) {
					navigation.push(routes.BLOCK_COMMENTS, {
						blockId: item.block.id,
						title: 'Thread'
					})
				}
			},
		)
	}

	const renderCommentListItem = ({ item }: { item: Comment }) => {
		const displayName = item.author.displayName ? item.author.displayName : item.author.username
		const color = textToColor(displayName)

		const handleStarring = (item: Comment) => {
			const request: StarredRequest = { blockId: item.block.id, starred: !item.block.starred }
			setStarred(request)
		}

		const renderItemTitle = (item: Comment) => {
			return (
				<View style={styles().commentText}>
					<View style={globalStyles.row}>
						<View>
							<Text style={styles().title}>{item.author.displayName ?? item.author.username}</Text>
							<Caption>{formatDate(item.createdAt)}</Caption>
						</View>
					</View>
					<View style={styles().itemRightView}>
						<MaterialCommunityIcons
							onPress={() => handleStarring(item)}
							name={item.block.starred ? 'star' : 'star-outline'}
							color={colors.starring}
							size={22}
						/>
						<Caption style={styles().starCount}>{item.starredCount}</Caption>
						<MaterialCommunityIcons onPress={() => showOptions(item)} style={styles().menuIcon} name='dots-horizontal' color={colors.subtext} size={25} />
					</View>
				</View>
			)
		}

		const renderDescription = (item: Comment) => {
			let display: ComponentObject
			if (item.block.type === 'text' || item.block.type === 'data') {
				const displayObject: DisplayObject = item.block?.pageDisplay && JSON.parse(item.block.pageDisplay)
				display = displayObject.display
				if (display.cid === 'richtext') {
					display.args.editable = false
				}
			} else {
				display = item.block?.embedDisplay && JSON.parse(item.block.embedDisplay)
			}

			return (
				<View>
					<ComponentDelegate component={display} />
					{item.block.commentsCount > 0 && (
						<Button
							style={styles().repliesButton}
							contentStyle={styles().repliesButton}
							onPress={() => {
								navigation.push(routes.BLOCK_COMMENTS, {
									blockId: item.block.id,
									title: 'Thread'
								})
							}}
							mode='text'
							labelStyle={[styles().repliesLabel]}
						>
							{`${item.block.commentsCount} replies`}
						</Button>
					)}
				</View>
			)
		}

		return (
			<>
				<View style={styles().listItem}>
					<Avatar.Text
						size={40}
						style={styles(color).avatar}
						labelStyle={styles().title}
						label={getInitials(displayName)}
					/>
					<View style={globalStyles.flex1}>
						{renderItemTitle(item)}
						{renderDescription(item)}
					</View>
				</View>
				<Divider style={styles().separator} />
			</>
		)
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : null}
			style={styles().container}
			keyboardVerticalOffset={headerHeight - safeAreaInsets.bottom}
		>
			<SafeAreaView style={styles().container}>
				<View style={styles().container}>
					{blockComments && blockComments.length > 0 ? (
						<FlatList
							style={styles().flatList}
							data={blockComments}
							renderItem={renderCommentListItem}
							keyExtractor={item => item.id.toString()}
						/>
					) : (
						<Subheading style={styles().subheading}>No comments found!</Subheading>
					)}
				</View>
				<View
					style={styles().commentInputContainer}
				>
					<RichTextEditor
						ref={richTextEditorRef}
						style={styles().commentInput}
						value={value}
						setValue={setValue}
						editable={true}
						onEnter={onEnter} />
					{/* <MaterialCommunityIcons
						style={styles().sendButton}
						onPress={() => {}}
						name={'send'}
						color={colors.text}
						size={22}
					/> */}
				</View>
			</SafeAreaView>
		</KeyboardAvoidingView>
	)
}

const styles = (color = colors.primary) =>
	StyleSheet.create({
		activityIndicator: {
			flex: 1,
		},
		container: {
			flex: 1,
			backgroundColor: colors.white
		},
		flatList: {
			backgroundColor: colors.white,
		},
		listItem: {
			padding: 20,
			flexDirection: 'row',
		},
		avatar: {
			backgroundColor: color,
			marginRight: 15,
		},
		commentText: {
			flexDirection: 'row',
			minWidth: '100%',
			justifyContent: 'space-between',
		},
		title: {
			fontSize: 14,
			color: colors.text,
			fontWeight: '600',
		},
		itemRightView: {
			flexDirection: 'row',
		},
		starCount: {
			paddingLeft: 5,
			fontSize: 11,
		},
		menuIcon: {
			paddingLeft: 10,
		},
		repliesLabel: {
			fontSize: 11,
			textTransform: 'lowercase',
			marginLeft: 0,
			marginRight: 0,
			marginTop: 0,
			marginBottom: 0,
			fontWeight: 'normal',
		},
		repliesButton: {
			alignSelf: 'flex-start',
			marginTop: 5,
		},
		subheading: {
			textAlign: 'center',
			marginTop: 10,
		},
		separator: {
			backgroundColor: '#CFD7E1',
			marginHorizontal: 15,
		},
		commentInputContainer: {
			// flexDirection: 'row',
			backgroundColor: colors.white,
			shadowOpacity: 1,
			elevation: 5,
			shadowColor: colors.border,
			borderTopColor: colors.border,
			borderTopWidth: 1,
		},
		commentInput: {
			minHeight: 60,
			paddingTop: 8,
			backgroundColor: colors.white
		},
		sendButton: {
			paddingHorizontal: 20,
			alignSelf: 'center'
		}
	})