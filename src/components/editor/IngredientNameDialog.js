import React from 'react'
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Dialog from '../common/Dialog'

const IngredientNameDialog = (props) => {

    const selectIngredient = (item) => {
        props.setIngredient(props.ingredientIndex, 'name')(item)
        props.close()
    }

    return (
        <Dialog visible={props.visible} close={props.close}>
            <Text style={styles.text}>Ingredient name</Text>
            <TextInput
                style={styles.input}
                value={props.value}
                onChangeText={props.setIngredient(props.ingredientIndex, 'name')}
                onSubmitEditing={props.close} />
            <FlatList
                data={props.ingredients}
                renderItem={({ item }) => {
                    return (
                        <TouchableWithoutFeedback onPress={selectIngredient.bind(this, item)}>
                            <Text style={[styles.text]}>{item}</Text>
                        </TouchableWithoutFeedback>
                    )
                }}
                keyExtractor={(item, index) => index + item}
            />
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

export default IngredientNameDialog