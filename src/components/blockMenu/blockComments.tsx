import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ComponentObject, DisplayObject } from 'display-api'
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { ActivityIndicator, Avatar, Button, Caption, Divider, Subheading } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'
import { GET_BLOCK_COMMENTS, SET_STARRED } from '../../api/gql'
import { Comment } from '../../api/types'
import colors from '../../utils/colors'
import { globalStyles } from '../../utils/styles'
import { formatDate, getInitials, textToColor } from '../../utils/utils'
import { ComponentDelegate } from '../display/ComponentDelegate'

export const BlockComments = ({ route }: { route: any }) => {
	const blockId: number = route.params?.blockId

	type BlockResult = { blockById: { comments: Array<Comment> } }
	type BlockRequest = { id: number }
	const [blockResponse] = useQuery<BlockResult, BlockRequest>({
		query: GET_BLOCK_COMMENTS,
		variables: { id: blockId },
	})

	type StarredResult = { setStarred: { id: number; starred: boolean } }
	type StarredRequest = { blockId: number; starred: boolean }
	const [, setStarred] = useMutation<StarredResult, StarredRequest>(SET_STARRED)

	const blockComments: Array<Comment> = blockResponse.data?.blockById?.comments
	if (!blockComments) {
		return <ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
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
						<MaterialCommunityIcons style={styles().menuIcon} name='dots-horizontal' color={colors.subtext} size={25} />
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
							onPress={() => {}}
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
		<View style={globalStyles.flex1}>
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
	)
}

const styles = (color = colors.primary) =>
	StyleSheet.create({
		activityIndicator: {
			flex: 1,
		},
		flatList: {
			flex: 1,
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
	})
