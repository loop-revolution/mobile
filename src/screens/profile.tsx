import React, { useContext, useImperativeHandle } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator, Avatar, Button, Caption, Card, Text, Title } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from 'urql'
import { USER_PROFILE } from '../api/gql'
import { Block, User } from '../api/types'
import { ComponentDelegate } from '../components/display/ComponentDelegate'
import { UserContext } from '../context/userContext'
import colors from '../utils/colors'
import { globalStyles } from '../utils/styles'

export const Profile = ({ route, navigation }) => {

    const currentUser = useContext(UserContext)

    type UserProfileRequest = { id: number }
    type UserProfileResult = { userById: User }
    const [profileResponse] = useQuery<UserProfileResult, UserProfileRequest>({
        query: USER_PROFILE,
        variables: { id: route.params?.userId },
    })
    const user = profileResponse.data?.userById

    if (!user) {
        return <ActivityIndicator
            {...0}
            style={globalStyles.flex1}
            color={colors.primary} />
    }

    const renderFeaturedBlock = () => {
        const featuredBlock: Block = user?.featured
        if (featuredBlock) {
            return <View style={styles.blockContainer}>
                <Text style={styles.featuredBlockTitle}>Featured Block</Text>
                <ComponentDelegate component={JSON.parse(user?.featured?.embedDisplay)} />
            </View>
        } else if (currentUser.user.id === user.id) {
            return (
                <>
                    <Text style={styles.featuredBlockTitle}>Featured Block</Text>
                    <Button
                        mode="contained"
                        uppercase={false}
                        style={styles.addButton}
                        onPress={() => console.log('Pressed')}>
                        Add
                    </Button>
                </>
            )
        } else {
            return <Text style={styles.featuredBlockTitle}>This user has no featured block</Text>
        }
    }

    return (
        <View style={globalStyles.flex1}>
            <ScrollView bounces={false}>
                <Card>
                    <Card.Content style={styles.profileHeader}>
                        <Avatar.Image size={100} source={require('../../assets/avatar.jpg')} />
                        <View style={styles.userInfo}>
                            {user && <Text style={styles.username}>{user.username}</Text>}
                            {user && <Caption style={styles.displayName}>{user.displayName ?? user.username}</Caption>}
                            {currentUser.user.id === user.id &&
                                <Button
                                    icon="pencil"
                                    mode="text"
                                    compact
                                    style={styles.editButton}
                                    uppercase={false}
                                    onPress={() => console.log('Pressed')}>
                                    Edit Profile
                        </Button>
                            }
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
        flex: 1
    },
    profileHeader: {
        backgroundColor: 'white',
        marginVertical: 20,
        marginHorizontal: 10,
        borderRadius: 0,
        flexDirection: 'row'
    },
    userInfo: {
        marginLeft: 20,
        justifyContent: 'center'
    },
    username: {
        fontSize: 22,
        fontWeight: '500'
    },
    displayName: {
        fontSize: 16,
        fontWeight: '400'
    },
    featuredBlockTitle: {
        fontSize: 18,
        fontWeight: '500',
        padding: 20,
        textAlign: 'center'
    },
    addButton: {
        alignSelf: 'center'
    },
    editButton: {
        marginLeft: -12
    },
    blockContainer: {
        marginHorizontal: 5
    }
})