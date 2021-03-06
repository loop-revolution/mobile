import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import React, { useContext } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Divider, Drawer, Text, Button } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { UserContext } from '../context/userContext'
import colors from '../utils/colors'
import Images from '../utils/images'
import routes from './routes'

export function DrawerContent(props: DrawerContentComponentProps) {
	const { user, setUserLoggedIn } = useContext(UserContext)

	const logout = async () => {
		await AsyncStorage.removeItem('token')
		setUserLoggedIn(false)
		props.navigation.reset({
			index: 0,
			routes: [{ name: routes.LOGIN }],
		})
	}

	return (
		<DrawerContentScrollView {...props}>
			<Animated.View style={styles.drawerContent}>
				<Drawer.Section>
					<TouchableOpacity
						onPress={() => {
							props.navigation.closeDrawer()
						}}
						style={styles.logoSection}
					>
						<Image style={styles.logoIcon} source={Images.logoIcon} />
						<Image source={Images.logoText} />
					</TouchableOpacity>
					<Divider style={styles.separator} />
					<View style={styles.userInfoSection}>
						<Text style={styles.title}>{user ? user.displayName ?? user.username : 'Loading...'}</Text>
						{user && <Text style={styles.subtitle}>@{user.username}</Text>}
						{user && <Text style={styles.credits}>{user.credits} credits</Text>}
						{user && (
							<View>
								<Button
									style={styles.button}
									contentStyle={styles.buttonContent}
									labelStyle={styles.buttonLabel}
									onPress={() => {}}
									mode='outlined'
								>
									Send Credits
								</Button>
							</View>
						)}
					</View>
					<Divider style={styles.separator} />
					<DrawerItem
						icon={() => <Image source={Images.settings} />}
						label='Account Settings'
						labelStyle={styles.optionLabel}
						onPress={() => {}}
					/>
					<Divider style={styles.separator} />
					<DrawerItem
						icon={() => <Image source={Images.help} />}
						label='Help & Feedback'
						labelStyle={styles.optionLabel}
						onPress={() => {}}
					/>
					<Divider style={styles.separator} />
					<DrawerItem
						icon={() => <MaterialCommunityIcons color={'#868686'} name='logout' size={20} />}
						label='Logout'
						labelStyle={styles.optionLabel}
						onPress={() => {
							logout()
						}}
					/>
					<Divider style={styles.separator} />
				</Drawer.Section>
			</Animated.View>
		</DrawerContentScrollView>
	)
}

const styles = StyleSheet.create({
	drawerContent: {
		flex: 1,
	},
	logoSection: {
		marginLeft: 16,
		flexDirection: 'row',
		marginVertical: 10,
	},
	userInfoSection: {
		marginHorizontal: 22,
		marginTop: 20,
		marginBottom: 26,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 16,
		lineHeight: 24,
		color: colors.white,
	},
	subtitle: {
		fontSize: 16,
		lineHeight: 24,
		color: colors.subtext,
	},
	credits: {
		fontSize: 16,
		lineHeight: 24,
		color: colors.accent,
	},
	logoIcon: {
		marginRight: 14,
	},
	button: {
		marginTop: 12,
		borderColor: colors.white,
	},
	buttonContent: {
		height: 44,
	},
	buttonLabel: {
		color: colors.white,
	},
	optionLabel: {
		color: colors.white,
		fontSize: 15,
	},
	optionIcon: {
		tintColor: colors.white,
	},
	separator: {
		backgroundColor: '#404040',
	},
})
