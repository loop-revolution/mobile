export type Crumb = {
	blockId: number
	name: string
}

export type BlockCrumbs = Array<Crumb>

export type BlockType = {
	name: string
	icon: string
	desc: string
}

export type Block = {
	id: number
	pageDisplay: string
	embedDisplay: string
	breadcrumb: BlockCrumbs
	starred: boolean
	starCount: number
}

export type BlockResults = {
	id: number
	color: string
	icon: string
	crumbs: BlockCrumbs
}

export enum BlockSortType {
	DEFAULT = 'DEFAULT',
	STAR_COUNT = 'STAR_COUNT',
	UPDATED = 'UPDATED',
	CREATED = 'CREATED',
}

export type User = {
	id: number
	username: string
	displayName: string
	email: string
	credits: number
	root: Block
	featured: Block
}

export type Notification = {
	name: string
	description: string
	blockLink: number
	time: string
}

export type Permission = {
	full: Array<User>
	edit: Array<User>
	view: Array<User>
}
