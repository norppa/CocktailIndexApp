import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../common/styledComponents'

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
        color: 'red'
    },
})

export default MandatoryAlert