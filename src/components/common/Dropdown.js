import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Dialog from './Dialog'

const Dropdown = (props) => {

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={[props.style, styles.dropdown]}>
                <Text style={styles.text}>{props.value}</Text>
                <Icon name="caret-down" size={24} />
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
    },
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
    },
})