import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Caption, Card, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { User } from '../api/types'
import { globalStyles } from '../utils/styles'

export const Profile = ({ route, navigation }) => {

    const user: User = route.params?.user
    return (
        <View style={globalStyles.flex1}>
            <Card style={styles.profileInfo}>
                {user && <Text style={styles.username}>{user.username}</Text>}
                {user && user.displayName && <Caption>{user.displayName}</Caption>}
            </Card>
            <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flex: 1,
    },
    profileInfo: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 50,
        borderRadius: 0,
    },
    username: {
        fontSize: 16,
        fontWeight: '500'
    },
})