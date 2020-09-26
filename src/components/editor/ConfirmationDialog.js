import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Button, Dialog } from '../common/styledComponents'

const SelectCocktailDialog = (props) => {
    return (
        <Dialog visible={props.visible} close={props.close}>
            <View>
                <Text>{props.message}</Text>
                <View style={styles.buttonRow}>
                    <Button style={styles.button} title="Yes" onPress={props.action} />
                    <Button style={styles.button}  title="No" onPress={props.close} />
                </View>
            </View>
        </Dialog>
    )
}

const styles = StyleSheet.create({
    buttonRow: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        width: 100
    }

})

export default SelectCocktailDialog