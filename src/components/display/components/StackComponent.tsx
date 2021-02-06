import React, { Component } from 'react'
import { StackArgs } from "display-api"
import { Text, Title } from "react-native-paper"
import colors from '../../../utils/colors'
import { ComponentDelegate } from '../ComponentDelegate'
import { View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export const StackComponent = ({ direction = 'vertical', items }: StackArgs) => {

    const content = items.map(({ component }) => (
		<ComponentDelegate component={component} key={JSON.stringify(component)} />
    ))
    
	switch (direction) {
		case "horizontal":
			return <ScrollView style={styles.horizontal}>{content}</ScrollView>
		case "fit":
			return <View style={styles.fit}>{content}</View>
		default:
			return <View style={styles.vertical}>{content}</View>
	}
}

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: 'row',
    },
    vertical: {
        flexDirection: 'column'
    },
    fit: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
})