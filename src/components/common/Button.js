import React from 'react'
import { StyleSheet, Text, TouchableHighlight } from 'react-native'

const EditorButton = (props) => {
    return (
        <TouchableHighlight style={[styles.button, props.style]}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={props.onPress}>
            <Text style={[styles.buttonText]}>{props.title}</Text>
        </TouchableHighlight>
    )
}

export default EditorButton

const styles = StyleSheet.create({
    button: {
        borderWidth: 3,
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'CherryCreamSoda-Regular',
        fontSize: 24
    },
})