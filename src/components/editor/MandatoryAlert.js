import React from 'react'
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, FlatList, View } from 'react-native'

const MandatoryAlert = (props) => {
    if (props.type !== props.value) return null

    return (
        <View style={[props.style, styles.alert]}>
            <Text style={styles.text}>{props.value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    alert: {
        marginTop: 6,
        marginBottom: 3,
    },
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
        color: 'red'
    },
})

export default MandatoryAlert