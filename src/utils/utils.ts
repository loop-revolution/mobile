import moment from 'moment'

export const getComponentIcon = (icon: string) => {
	switch (icon) {
		case 'Folder':
			return 'folder-outline'
		case 'TaskComplete':
			return 'check-circle-outline'
		case 'Message':
			return 'message'
		case 'Box':
			return 'cube-outline'
		case 'Type':
			return 'text'
		case 'Feed':
			return 'rss'
		case 'Plus':
			return 'plus'
		case 'ThumbsUp': 
			return 'thumb-up'
		case 'ThumbsDown': 
			return 'thumb-down'
		default:
			return 'cube'
	}
}

export const getInitials = (name: string) => {
	const names = name.split(' ')
	let initials = names[0].substring(0, 1).toUpperCase()
	if (names.length > 1) {
		initials += names[names.length - 1].substring(0, 1).toUpperCase()
	}
	return initials
}

export const textToColor = (text: string) => {
	const l = 70
	const s = 60
	let hash = 0
	for (let i = 0; i < text.length; i += 1) {
		hash = text.charCodeAt(i) + ((hash << 5) - hash) // eslint-disable-line no-bitwise
	}
	const h = hash % 360
	return `hsl(${h}, ${s}%, ${l}%)`
}

export function formatDate(dateStr: string) {
	const date = moment(dateStr)
	if (moment().diff(date, 'days') >= 2) {
		return date.fromNow() // 2 days ago etc
	}
	return `${date.calendar().split(' ')[0]}, at ${date.format('hh:mm a')}`
}
