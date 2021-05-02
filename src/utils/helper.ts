import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import routes from '../navigation/routes'

export async function registerForPushNotificationsAsync() {
	const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
	let finalStatus = existingStatus

	// only ask if permissions have not already been determined, because
	// iOS won't necessarily prompt the user a second time.
	if (existingStatus !== 'granted') {
		// Android remote notification permissions are granted during the app
		// install, so this will only ask on iOS
		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
		finalStatus = status
	}

	// Stop here if the user did not grant permissions
	if (finalStatus !== 'granted') {
		return null
	}

	// Get the token that uniquely identifies this device
	const token = (await Notifications.getExpoPushTokenAsync()).data

	return token
}

export function redirectTo(appPath: string, navigation: any) {
	const url = appPath.replace(/^\/|\/$/g, '')

	console.log('url: ', url)

	const segments = url.split('/')

	console.log(segments)

	if (segments.length > 1) {
		if (segments[0] === 'b') {
			navigation.navigate(routes.BLOCK_PAGE, { blockId: segments[1] })
		} else {
			navigation.navigate(routes.PROFILE, { username: segments[1] })
		}
	}
}
