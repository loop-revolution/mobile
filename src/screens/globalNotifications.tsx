import { InputArgs } from 'display-api'
import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native'
import { ActivityIndicator, Caption, Divider } from 'react-native-paper'
import { useQuery } from 'urql'
import { NOTIFICATIONS } from '../api/gql'
import { Notification } from '../api/types'
import { InputComponent } from '../components/display/components/InputComponent'
import colors from '../utils/colors'
import { globalStyles } from '../utils/styles'
import { formatDate } from '../utils/utils'

export const GlobalNotifications = () => {
	const [refreshing, setRefreshing] = useState(false)

	type NotificationsResult = { notifications: Array<Notification> }

	const [notifcationResponse, getNotifications] = useQuery<NotificationsResult>({
		query: NOTIFICATIONS,
	})

	const notifications = notifcationResponse.data?.notifications

	useEffect(() => {
		if (notifcationResponse.data?.notifications) {
			setRefreshing(false)
		} else if (notifcationResponse.error) {
			setRefreshing(false)
		}
	}, [notifcationResponse])

	const onRefresh = () => {
		setRefreshing(true)
		getNotifications({ requestPolicy: 'network-only' })
	}

	const renderNotificatonItem = ({ item }: { item: Notification }) => {
		return (
			<>
				<View style={styles.notification}>
					<Text style={styles.notificationTitle}>{item.name}</Text>
					<Text style={styles.notificationSubTitle}>{item.description}</Text>
					{item.time && <Caption>{formatDate(item.time)}</Caption>}
				</View>
				<Divider />
			</>
		)
	}

	if (!notifications) {
		return <ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
	}

	return (
		<View style={globalStyles.flex1}>
			{notifications ? (
				<FlatList
					style={styles.flatList}
					data={notifications}
					renderItem={renderNotificatonItem}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
					keyExtractor={item => item.name}
				/>
			) : null}
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
	notification: {
		padding: 15,
	},
	notificationTitle: {
		fontSize: 16,
		fontWeight: '400',
	},
	notificationSubTitle: {
		fontSize: 16,
		fontWeight: '400',
		color: colors.subtext,
		lineHeight: 30,
	},
})
