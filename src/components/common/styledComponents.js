import React from 'react'
import {
    Text as NativeText,
    TextInput as NativeTextInput,
    View,
    StyleSheet,
    TouchableHighlight,
    Modal
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

const Text = (props) => <NativeText {...props} style={[styles.text, props.style]} >{props.children}</NativeText>

const Header = (props) => <NativeText {...props} style={[styles.header, props.style]}>{props.children}</NativeText>

const Button = (props) => (
    <TouchableHighlight style={[styles.button, props.style]}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={props.onPress}>
        <Header>{props.title}</Header>
    </TouchableHighlight>
)

const TextInput = React.forwardRef((props, ref) => (
        <NativeTextInput {...props} ref={ref} style={[styles.input, styles.textInput, props.style]} />
))

const Dropdown = (props) => (
    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={props.onPress} style={props.style}>
        <View style={[styles.input, styles.dropdown]}>
            <NativeText style={styles.text}>{props.value}</NativeText>
            <Icon name="caret-down" size={24} />
        </View>
    </TouchableHighlight>

)

const Dialog = (props) => (
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

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
    },
    header: {
        fontFamily: 'CherryCreamSoda-Regular',
        fontSize: 24,
        marginTop: 5,
        marginBottom: 5,
    },
    button: {
        borderWidth: 3,
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 5,
    },
    textInput: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
        paddingLeft: 10,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
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

module.exports = {
    Text,
    Header,
    Button,
    TextInput,
    Dropdown,
    Dialog
} 