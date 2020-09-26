import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native'
import { Header, Text, TextInput, Dialog } from '../common/styledComponents'

const IngredientNameDialog = (props) => {

    const selectIngredient = (item) => {
        props.setIngredient(props.ingredientIndex, 'name')(item)
        props.close()
    }

    return (
        <Dialog visible={props.visible} close={props.close}>
            <Header>Ingredient name</Header>
            <TextInput
                value={props.value}
                onChangeText={props.setIngredient(props.ingredientIndex, 'name')}
                onSubmitEditing={props.close} />
            <FlatList
                data={props.availableIngredients}
                renderItem={({ item }) => {
                    return (
                        <TouchableWithoutFeedback onPress={selectIngredient.bind(this, item)}>
                            <Text style={styles.listItem}>{item}</Text>
                        </TouchableWithoutFeedback>
                    )
                }}
                keyExtractor={(item, index) => index + item}
            />
        </Dialog>
    )
}

const styles = StyleSheet.create({
    listItem: {
        marginTop: 3,
        marginBottom: 3
    }

})

export default IngredientNameDialog