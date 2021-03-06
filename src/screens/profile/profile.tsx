import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator, Avatar, Button, Caption, Card, Text } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'
import { SET_STARRED, USER_PROFILE } from '../../api/gql'
import { Block, User } from '../../api/types'
import { ComponentDelegate } from '../../components/display/ComponentDelegate'
import { UserContext } from '../../context/userContext'
import routes from '../../navigation/routes'
import colors from '../../utils/colors'
import Images from '../../utils/images'
import { globalStyles } from '../../utils/styles'

export const Profile = ({ route, navigation }: { route: any; navigation: any }) => {
	const currentUser = useContext(UserContext)

	type UserProfileRequest = { id: number }
	type UserProfileResult = { userById: User }
	type StarredResult = { setStarred: { id: number; starred: boolean } }
	type StarredRequest = { blockId: number; starred: boolean }

	const [, setStarred] = useMutation<StarredResult, StarredRequest>(SET_STARRED)
	const [profileResponse] = useQuery<UserProfileResult, UserProfileRequest>({
		query: USER_PROFILE,
		variables: { id: route.params?.userId },
	})

	const user = profileResponse.data?.userById

	if (!user) {
		return <ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
	}

	const renderFeaturedBlock = () => {
		const featuredBlock: Block = user?.featured
		if (featuredBlock) {
			return (
				<View style={styles.blockContainer}>
					<Text style={styles.featuredBlockTitle}>Featured Block</Text>
					<ComponentDelegate component={JSON.parse(user?.featured?.embedDisplay)} />
				</View>
			)
		} else if (currentUser.user.id === user.id) {
			return (
				<>
					<Text style={styles.featuredBlockTitle}>Featured Block</Text>
					<Button mode='contained' uppercase={false} style={styles.addButton} onPress={() => console.log('Pressed')}>
						Add
					</Button>
				</>
			)
		} else {
			return <Text style={styles.featuredBlockTitle}>This user has no featured block</Text>
		}
	}

	const renderStarredItem = () => {
		if (!user?.featured) {
			return null
		}

		const starCount = user?.featured.starCount ?? 0
		return (
			<Button
				mode='text'
				compact
				color={colors.starring}
				style={styles.editButton}
				uppercase={false}
				onPress={() => handleStarring()}
			>
				<View style={styles.starContainer}>
					<MaterialCommunityIcons
						name={user?.featured.starred ? 'star' : 'star-outline'}
						color={colors.starring}
						size={25}
					/>
					<Caption style={styles.caption}>
						{' '}
						{starCount} {starCount === 1 ? 'star ' : 'stars '}
					</Caption>
				</View>
			</Button>
		)
	}

	const handleStarring = () => {
		const request: StarredRequest = { blockId: user.featured.id, starred: !user.featured.starred }
		setStarred(request)
	}

	return (
		<View style={globalStyles.flex1}>
			<ScrollView bounces={false}>
				<Card>
					<Card.Content style={styles.profileHeader}>
						<Avatar.Image style={styles.profilePhoto} size={100} source={Images.avatar} />
						<View style={styles.userInfo}>
							{user && <Text style={styles.username}>{user.displayName ?? user.username}</Text>}
							{user && <Caption style={styles.caption}>@{user.username}</Caption>}
							{renderStarredItem()}
							{currentUser.user.id === user.id && (
								<Button
									icon='pencil'
									mode='text'
									compact
									style={styles.editButton}
									uppercase={false}
									onPress={() => {
										navigation.push(routes.EDIT_PROFILE, { user })
									}}
								>
									Edit Profile
								</Button>
							)}
						</View>
					</Card.Content>
				</Card>
				{renderFeaturedBlock()}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	scrollViewContent: {
		flex: 1,
	},
	profileHeader: {
		backgroundColor: 'white',
		marginVertical: 20,
		marginHorizontal: 10,
		borderRadius: 0,
		flexDirection: 'row',
	},
	userInfo: {
		marginLeft: 20,
		justifyContent: 'center',
	},
	profilePhoto: {
		alignSelf: 'center',
	},
	username: {
		fontSize: 22,
		fontWeight: '500',
	},
	caption: {
		fontSize: 14,
		fontWeight: '400',
		lineHeight: 25,
	},
	featuredBlockTitle: {
		fontSize: 18,
		fontWeight: '500',
		padding: 20,
		textAlign: 'center',
	},
	addButton: {
		alignSelf: 'center',
	},
	editButton: {
		marginLeft: -12,
		marginTop: -8,
		flexWrap: 'wrap',
	},
	blockContainer: {
		marginHorizontal: 5,
	},
	starContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
})
