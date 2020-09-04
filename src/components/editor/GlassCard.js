import React from 'react'
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from 'react-native'
import images from '../../assets/images/glasses'

const GlassCard = (props) => {
    return (
        <TouchableWithoutFeedback onPress={props.select}>
            <View style={[props.style, styles.glassCard]}>
                <Image style={styles.image} source={images[props.glass]} />
                <Text style={styles.text}>{props.glass}</Text>
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
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
    }
})