import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Dialog from './Dialog'

const Dropdown = (props) => {
    const [selectModalIsOpen, setSelectModalIsOpen] = useState(false)

    const select = (value) => {
        setSelectModalIsOpen(false)
        props.onSelect(value)
    }

    return (
        <TouchableWithoutFeedback onPress={setSelectModalIsOpen.bind(this, true)}>
            <View>
                <View style={[styles.dropdown, props.dropdownStyle]}>
                    <Text style={props.textStyle}>{props.selected}</Text>
                    <Icon name="caret-down" size={24} />
                </View>


                <Dialog visible={selectModalIsOpen} close={setSelectModalIsOpen.bind(this, false)}>
                    <FlatList
                        data={props.options}
                        renderItem={({ item }) => {
                            return (
                                <TouchableWithoutFeedback onPress={select.bind(this, item.value)}>
                                    <Text style={[props.textStyle]}>{item.label}</Text>
                                </TouchableWithoutFeedback>
                            )
                        }}
                        keyExtractor={(item, index) => index + item}
                    />
                </Dialog>
            </View>
        </TouchableWithoutFeedback>

    )
}

export default Dropdown

const styles = StyleSheet.create({
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5
    }
})