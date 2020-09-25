import React from 'react'
import { StyleSheet, Text, TextInput, TouchableWithoutFeedback, FlatList } from 'react-native'
import Dialog from '../common/Dialog'

const SelectCocktailDialog = (props) => {
    return (
        <Dialog visible={props.visible} close={props.close}>
            <Text style={styles.text}>Select cocktail to edit</Text>
            <TextInput style={[styles.input, styles.cocktailSelect]} placeholder="Search" />
            <FlatList
                data={[{ name: 'New Cocktail' }].concat(props.cocktails)}
                renderItem={({ item, index }) =>
                    <TouchableWithoutFeedback onPress={props.selectCocktail.bind(this, item.id)}>
                        <Text style={[styles.text, styles.cocktailSelect]}>{item.name}</Text>
                    </TouchableWithoutFeedback>}
                keyExtractor={(item, index) => 'cocktail_' + index}
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

export default SelectCocktailDialog