import React from 'react'
import { FlatList } from 'react-native'
import { Dialog } from '../common/styledComponents'
import GlassCard from './GlassCard'

const SelectGlassDialog = (props) => {
    return (

        <Dialog visible={props.visible} close={props.close}>
            <FlatList
                data={props.availableGlasses}
                renderItem={({ item, index }) => <GlassCard select={props.selectGlass.bind(this, item)} glass={item} />}
                keyExtractor={(item, index) => 'glass_' + index}
            />
        </Dialog>
    )
}

export default SelectGlassDialog