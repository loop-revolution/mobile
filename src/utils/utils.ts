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

export const getInitials = function (name: string) {
    var names = name.split(' '),
        initials = names[0].substring(0, 1).toUpperCase()
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }
    return initials
}

export const textToColor = function (text: string) {
    const l = 70
    const s = 60
    var hash = 0
    for (var i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    var h = hash % 360
    return 'hsl('+h+', '+s+'%, '+l+'%)';
  }