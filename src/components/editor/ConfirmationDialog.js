import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Dialog from '../common/Dialog'
import Button from '../common/Button'

const SelectCocktailDialog = (props) => {
    return (
        <Dialog visible={props.visible} close={props.close}>
            <View>
                <Text style={styles.text}>{props.message}</Text>
                <Button title="Yes" onPress={props.action} />
                <Button title="No" onPress={props.close} />
            </View>
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

export default SelectCocktailDialog