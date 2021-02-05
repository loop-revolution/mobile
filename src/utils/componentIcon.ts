import { IconName } from "display-api"

export const getComponentIcon = ({ icon }: { icon?: any }) => {
    switch (icon) {
        case "Folder":
            return 'folder'
        case "TaskComplete":
            return 'check'
        case "Message":
            return 'message'
        case "Box":
            return 'cube-outline'
        case "Type":
            return 'text'
        case "Feed":
            return 'rss'
        default:
            return 'cube'
    }
}