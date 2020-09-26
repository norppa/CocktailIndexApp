import React from 'react'
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native'
import images from '../../img/images'
import { Text } from '../common/styledComponents'

const GlassCard = (props) => {
    return (
        <TouchableWithoutFeedback onPress={props.select}>
            <View style={[props.style, styles.glassCard]}>
                <Image style={styles.image} source={images(props.glass)} />
                <Text>{props.glass}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default GlassCard

const styles = StyleSheet.create({
    glassCard: {
        borderWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginRight: 10,
    },
})