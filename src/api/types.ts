export enum SearchMode {
    Block,
    User,
    All,
  }

export type User = { 
    id: number
    username: string
    displayName: string
    credits: number
    root: Block
}

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
    breadcrumb: BlockCrumbs
}

export type Notification = {
    name: string
    description: string
    blockLink: number
    time: string
}
