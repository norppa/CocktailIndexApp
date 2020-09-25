import React from 'react'
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Dialog from '../common/Dialog'
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

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
    },
    input: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 5,
        padding: 3,
        paddingLeft: 10,
    },
    cocktailSelect: {
        marginTop: 3,
        marginBottom: 3
    }

})

export default SelectGlassDialog