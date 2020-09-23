const images = (name) => {
    switch (name) {
        case 'Coupe': return require('./coupe.png')
        case 'Double Old Fashioned': return require('./double_old_fashioned.png')
        case 'Old Fashioned': return require('./old_fashioned.png')
        case 'Hurricane': return require('./hurricane.png')
        case 'Zombie': return require('./zombie.png')
        default: return require('./not_selected.png')
    }
}

export default images