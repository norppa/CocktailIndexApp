import React from 'react'
import { StyleSheet, View, Modal, TouchableWithoutFeedback, } from 'react-native'

const Dialog = (props) => {
    if (!props.visible) return null

    return (
        <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={props.close}
            visible={props.visible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modal}>
                        {props.children}
                    </View>
                </View>
        </Modal>
    )
}

export default Dialog

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modal: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        opacity: 1,
        width: '70%',
        minHeight: '70%'

    },

})
