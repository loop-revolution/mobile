import { View, StyleSheet } from 'react-native'
import React, { useContext, useRef } from 'react'
import { useQuery } from 'urql'
import { GET_BLOCK } from '../api/gql'
import { DisplayObject } from 'display-api'
import { ActivityIndicator, Title, Appbar, Subheading } from 'react-native-paper'
import { globalStyles } from '../utils/styles'
import colors from '../utils/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import { BreadcrumbHeader } from '../components/breadcrumbHeader'
import { Block } from '../api/types'
import { BreadcrumbList } from '../components/breadcrumbList'
import { UserContext } from '../context/userContext'
import { BottomMenu } from '../components/blockMenu/bottomMenu'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { jsx } from 'slate-hyperscript'
import DOMParser from 'react-native-html-parser';


export const BlockPage = ({ route, navigation }: { route: any; navigation: any }) => {
	type BlockResult = { blockById: Block }
	type BlockRequest = { id: number }
	const { user } = useContext(UserContext)
	let richText = useRef();

	const blockId: number = route.params?.blockId ? Number(route.params.blockId) : user?.root?.id
	const [blockResponse] = useQuery<BlockResult, BlockRequest>({
		query: GET_BLOCK,
		variables: { id: blockId },
	})

	const menuRef = useRef(null)

	let display: DisplayObject
	const block = blockResponse.data?.blockById

	if (block?.pageDisplay) {
		display = JSON.parse(block.pageDisplay)
	}

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: (props: any) => (
				<BreadcrumbHeader {...props} navigation={navigation} route={route} title={display?.meta?.page?.header} />
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
	}, [navigation, display])


	const initHTML = `
<div>
<br/>Click the picture to switch<br/><br/>
</div>
`;

	return (
		<ComponentDelegate
			component={{
				cid: "displaylist",
				args: {
					// color: "#1f427d",
					items: [
						{
							component: {
								cid: "richtext",
								args: {
									editable: true,
									content: [
										{
											cid: "text",
											args: {
												text:
													"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus cursus nisl sit amet nisi sodales luctus. Praesent ac lacus sit amet nibh tristique scelerisque. Aenean dictum mi non nibh semper mattis. Phasellus commodo rutrum nunc vel consectetur. Proin pretium ornare lorem id accumsan. Nunc ac interdum risus. Integer mollis eu odio id lacinia. Phasellus feugiat, enim vel tincidunt suscipit, massa massa sodales diam, eu fermentum purus ligula ac nunc.",
											},
										},
									],
								},
							},
							menu: {
								cid: "menu",
								block_id: 100,
								custom: [
									{
										icon: "Plus",
										text: "Add a block",
									},
								],
							},
						},
						{
							component: {
								cid: "richtext",
								args: {
									editable: true,
									content: [
										{
											cid: "text",
											args: {
												text:
													"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus cursus nisl sit amet nisi sodales luctus. Praesent ac lacus sit amet nibh tristique scelerisque. Aenean dictum mi non nibh semper mattis. Phasellus commodo rutrum nunc vel consectetur. Proin pretium ornare lorem id accumsan. Nunc ac interdum risus. Integer mollis eu odio id lacinia. Phasellus feugiat, enim vel tincidunt suscipit, massa massa sodales diam, eu fermentum purus ligula ac nunc.",
											},
										},
									],
								},
							},
							menu: {
								cid: "menu",
								block_id: 100,
								custom: [
									{
										icon: "Plus",
										text: "Add a block",
									},
								],
							},
						},
						// {
						// 	component: {
						// 		cid: "card",
						// 		args: {
						// 			content: {
						// 				cid: "text",
						// 				args: {
						// 					text:
						// 						"wfegrhtuyrpheiwdry78fgldhsbygewvfouq345erygg o873 o73o67t oo tp 673o63 or76t234te t43wy5yrth",
						// 				},
						// 			},
						// 		},
						// 	},
						// 	menu: {
						// 		cid: "menu",
						// 		block_id: 100,
						// 		custom: [
						// 			{
						// 				icon: "Plus",
						// 				text: "Add a block",
						// 			},
						// 		],
						// 	},
						// },
					],
				},
			}}
		/>
	)

	// return (
	// 	<View style={globalStyles.flex1}>
	// 		<ScrollView contentContainerStyle={[styles.scrollViewContent]}>
	// 			{display ? (
	// 				<View>
	// 					{display.meta?.page?.header ? <Title>{display.meta?.page?.header}</Title> : null}
	// 					<ComponentDelegate component={display.display} />
	// 					{display.meta?.page?.menu && <BottomMenu ref={menuRef} menu={display.meta?.page?.menu} />}
	// 				</View>
	// 			) : user && !blockId ? (
	// 				<Subheading style={styles.subheading}>
	// 					No Blocks Found! Go ahead and create one from the bottom menu.
	// 				</Subheading>
	// 			) : (
	// 				<ActivityIndicator {...null} style={globalStyles.flex1} color={colors.primary} />
	// 			)}
	// 		</ScrollView>

	// 		{block?.breadcrumb && (
	// 			<BreadcrumbList
	// 				navigation={navigation}
	// 				route={route}
	// 				breadcrumb={block.breadcrumb}
	// 				isVisible={route.params?.isBlockListExpanded}
	// 			/>
	// 		)}
	// 	</View>
	// )
}

const styles = StyleSheet.create({
	scrollViewContent: {
		margin: 5,
	},
	subheading: {
		textAlign: 'center',
	},
	richBar: {
		borderColor: colors.navigationPrimary,
		borderTopWidth: StyleSheet.hairlineWidth,
	},
})
