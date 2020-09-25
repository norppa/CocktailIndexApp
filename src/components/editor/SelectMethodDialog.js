import React from 'react'
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Dialog from '../common/Dialog'

const SelectMethodDialog = (props) => {
    return (
        <Dialog visible={props.visible} close={props.close}>
            <Text style={styles.text}>Select method</Text>
            <FlatList
                data={props.methods}
                renderItem={({ item }) => {
                    return (
                        <TouchableWithoutFeedback onPress={props.selectMethod.bind(this, item)}>
                            <Text style={styles.text}>{item}</Text>
                        </TouchableWithoutFeedback>
                    )
                }}
                keyExtractor={(item, index) => index + item}
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

export default SelectMethodDialog