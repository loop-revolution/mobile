export type User = { 
    id: number;
    username: string;
    displayName: string;
    credits: number;
}

export type Crumb = { blockId: number, name: string }
export type BlockCrumbs = Array<Crumb>

export type BlockType = {
    name: string;
    icon: string;
    desc: string;
}