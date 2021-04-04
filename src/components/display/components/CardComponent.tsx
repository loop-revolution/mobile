import React, { useRef, useState } from 'react'
import { CardArgs } from 'display-api'
import { Card, IconButton, List } from 'react-native-paper'
import colors from '../../../utils/colors'
import { ComponentDelegate } from '../ComponentDelegate'
import { StyleSheet, View } from 'react-native'
import { getComponentIcon } from '../../../utils/utils'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomMenu } from '../../blockMenu/bottomMenu'
import { useNavigation } from '@react-navigation/core'
import routes from '../../../navigation/routes'

export const CardComponent = ({ header, color, content }: CardArgs) => {
	const [isExpanded, setExpended] = useState(false)
	const menuRef = useRef(null)
	const navigation = useNavigation()

	color = color || colors.primary

	const LeftContent = () => {
		if (header?.custom) {
			return <ComponentDelegate component={header?.custom} />
		} else {
			return <MaterialCommunityIcons color={color} name={getComponentIcon(header?.icon)} size={25} />
		}
	}

	const RightContent = () => (
		<View style={styles().titleOptions}>
			<IconButton
				style={styles().rightIcon}
				color={color}
				icon='dots-horizontal'
				onPress={() => {
					menuRef.current?.handleOpen()
				}}
			/>
			<IconButton
				style={styles().rightIcon}
				onPress={() => {
					setExpended(!isExpanded)
				}}
				color={color}
				icon={isExpanded ? 'chevron-up' : 'chevron-down'}
			/>
		</View>
	)

	return (
		<Card style={styles(color).cardContainer}>
			{header ? (
				<List.Accordion
					style={styles().header}
					titleStyle={styles().title}
					title={header?.custom ? '' : header.title}
					left={LeftContent}
					right={RightContent}
					expanded={isExpanded}
					onPress={() => {
						navigation.navigate(routes.BLOCK_PAGE, { blockId: header.block_id })
					}}
				>
					<Card.Content style={styles().cardContent}>
						<ComponentDelegate component={content} />
					</Card.Content>
				</List.Accordion>
			) : (
				<Card.Content style={styles().cardContent}>
					<ComponentDelegate component={content} />
				</Card.Content>
			)}
			{header?.menu && <BottomMenu ref={menuRef} menu={header?.menu} />}
		</Card>
	)
}

const styles = (color = colors.primary) =>
	StyleSheet.create({
		cardContainer: {
			marginHorizontal: 5,
			marginVertical: 5,
			elevation: 0,
			borderColor: '#D7DADE',
			borderWidth: 1,
			borderLeftColor: color,
			borderLeftWidth: 5,
			borderRadius: 5,
		},
		header: {
			borderBottomColor: '#EBEAF5',
			borderBottomWidth: 1,
			minHeight: 50,
		},
		cardContent: {
			padding: 5,
			paddingLeft: 5,
			paddingRight: 5,
		},
		title: {
			fontSize: 14,
			fontWeight: '600',
		},
		titleOptions: {
			flexDirection: 'row',
		},
		rightIcon: {
			margin: 0,
		},
	})
