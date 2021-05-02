import { StyleSheet, View } from 'react-native'
import React, { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { DisplayListArgs, DisplayListItem } from 'display-api'
import { ComponentDelegate } from '../ComponentDelegate'
import { IconButton } from 'react-native-paper'
import colors from '../../../utils/colors'
import { BottomMenu } from '../../blockMenu/bottomMenu'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

export const DisplayListComponent = ({ items }: DisplayListArgs) => {
	const menuRefs = useRef([]);

	menuRefs.current = items.map(
		(ref, index) => menuRefs.current[index] = React.createRef()
	)
	const renderItem = ({ item, index }: { item: DisplayListItem; index: number }) => {
		return (
			<>
				<View style={styles.item}>
					<IconButton
						disabled={!item.menu}
						style={styles.rightIcon}
						color={colors.primary}
						icon='dots-horizontal'
						onPress={() => {
							menuRefs.current[index].current?.handleOpen()
						}}
					/>
					<ComponentDelegate component={item.component} />
				</View>
				{item.menu && <BottomMenu ref={menuRefs.current[index]} menu={item.menu} />}
			</>
		)
	}

	return (
		<KeyboardAwareFlatList
			style={styles.flatList}
			data={items}
			renderItem={renderItem}
			keyExtractor={(item, index) => index.toString()}
		/>
	)
}

const styles = StyleSheet.create({
	flatList: {
		margin: 5,
	},
	item: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
	},
	rightIcon: {
		margin: 0,
	},
})
