import { ComponentObject } from 'display-api'
import moment from 'moment'
import React from 'react'
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native'
import { ActivityIndicator, Appbar, Divider } from 'react-native-paper'
import { useMutation, useQuery } from 'urql'
import { ALL_UPDATES, SET_LATEST_SEEN } from '../api/gql'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import { BadgeComponent } from '../components/display/components/BadgeComponent'
import routes from '../navigation/routes'
import colors from '../utils/colors'
import { globalStyles } from '../utils/styles'

export const WhatsNew = ({ route, navigation }: { route: any; navigation: any }) => {
	type Update = {
		id: number
		display: string
		createdAt: string
		seen: boolean
	}
	type UpdatesResult = { allUpdates: Array<Update> }

	const [updatesResponse, getUpdates] = useQuery<UpdatesResult>({
		query: ALL_UPDATES,
	})

	type SetLatestSeenResult = { setLatestSeen: { id: number } }
	type SetLatestSeenRequest = { latestUpdateId: number }

	const [, setLatestSeen] = useMutation<SetLatestSeenResult, SetLatestSeenRequest>(SET_LATEST_SEEN)

	const updates = updatesResponse.data?.allUpdates

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerLeft: () => {
				return (
					<Appbar.BackAction
						onPress={() => {
							const latestUpdateId = updates && updates.length > 0 ? updates[0].id : null
							latestUpdateId && setLatestSeen({ latestUpdateId })
							navigation.navigate(routes.HOME)
						}}
					/>
				)
			},
		})
	}, [navigation, route])

	const onRefresh = () => {
		getUpdates({ requestPolicy: 'network-only' })
	}

	const renderUpdateItem = ({ item }: { item: Update }) => {
		const display: ComponentObject = JSON.parse(item.display)
		const date = item.createdAt && moment(item.createdAt).format('MM/DD/YYYY')
		return (
			<>
				<View style={styles.update}>
					<View style={styles.titleContainer}>
						<Text style={styles.updateTitle}>What's New {date && `- ${date}`}</Text>
						{!item.seen && <BadgeComponent text='New' variant='Outline' />}
					</View>
					<ComponentDelegate component={display} />
				</View>
				<Divider />
			</>
		)
	}

	if (!updates && updatesResponse.fetching) {
		return <ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
	}

	return (
		<View style={globalStyles.flex1}>
			{updates.length > 0 ? (
				<FlatList
					style={styles.flatList}
					data={updates}
					renderItem={renderUpdateItem}
					refreshControl={<RefreshControl refreshing={updatesResponse.fetching} onRefresh={onRefresh} />}
					keyExtractor={item => item.id.toString()}
				/>
			) : (
				<Text style={styles.error}>There are no new updates</Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	activityIndicator: {
		flex: 1,
	},
	flatList: {
		margin: 5,
	},
	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	update: {
		padding: 15,
	},
	updateTitle: {
		fontSize: 16,
		fontWeight: '400',
	},
	error: {
		fontSize: 18,
		fontWeight: '400',
		padding: 20,
		textAlign: 'center',
	},
})
