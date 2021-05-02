import { View, StyleSheet, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { useQuery } from 'urql'
import { GET_BLOCK } from '../api/gql'
import { DisplayObject } from 'display-api'
import { ActivityIndicator, Title, Appbar, Subheading } from 'react-native-paper'
import { globalStyles } from '../utils/styles'
import colors from '../utils/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import { BreadcrumbHeader } from '../components/breadcrumbHeader'
import { Block, Crumb } from '../api/types'
import { BreadcrumbList } from '../components/breadcrumbList'
import { UserContext } from '../context/userContext'
import { BottomMenu } from '../components/blockMenu/bottomMenu'

export const BlockPage = ({ route, navigation }: { route: any; navigation: any }) => {
	type BlockResult = { blockById: Block }
	type BlockRequest = { id: number }
	const { user } = useContext(UserContext)
	const menuRef = useRef(null)

	const blockId: number = route.params?.blockId ? Number(route.params.blockId) : user?.root?.id
	const [blockResponse, getBlock] = useQuery<BlockResult, BlockRequest>({
		query: GET_BLOCK,
		variables: { id: blockId },
	})

	useEffect(() => {
		getBlock()
	}, [])

	let display: DisplayObject
	const block = blockResponse.data?.blockById

	if (block?.pageDisplay) {
		display = JSON.parse(block.pageDisplay)
	}

	React.useLayoutEffect(() => {
		const lastBreadcrumb: Crumb = block?.breadcrumb?.length > 0 && block.breadcrumb[block.breadcrumb.length - 1]
		navigation.setOptions({
			headerTitle: (props: any) => (
				<BreadcrumbHeader {...props} navigation={navigation} route={route} title={lastBreadcrumb?.name} />
			),
			headerRight: () => {
				if (display?.meta?.page?.menu) {
					return (
						<Appbar.Action
							icon='dots-horizontal'
							onPress={() => {
								menuRef.current?.handleOpen()
							}}
						/>
					)
				} else {
					return null
				}
			},
		})
	}, [navigation, block])

	if (display) {
		console.log(display.display)
	}
	return (
		<View style={styles.container}>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={blockResponse.fetching}
						onRefresh={() => {
							getBlock({ requestPolicy: 'network-only' })
						}}
					/>
				}
			>
				{display ? (
					<View style={styles.innerView}>
						{display.meta?.page?.header && <Title>{display.meta?.page?.header}</Title>}
						<ComponentDelegate component={display.display} />
						{display.meta?.page?.menu && <BottomMenu ref={menuRef} menu={display.meta?.page?.menu} />}
					</View>
				) : user && !blockId ? (
					<Subheading style={styles.subheading}>
						No Blocks Found! Go ahead and create one from the bottom menu.
					</Subheading>
				) : (
					<ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
				)}
			</ScrollView>

			{block?.breadcrumb && (
				<BreadcrumbList
					navigation={navigation}
					route={route}
					breadcrumb={block.breadcrumb}
					isVisible={route.params?.isBlockListExpanded}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	innerView: {
		padding: 10,
	},
	subheading: {
		textAlign: 'center',
		margin: 10,
	},
	richBar: {
		borderColor: colors.navigationPrimary,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
})
