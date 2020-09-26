import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native'

import { Header, Text, TextInput, Dialog } from '../common/styledComponents'

const SelectCocktailDialog = (props) => {
    return (
        <Dialog visible={props.visible} close={props.close}>
            <Header>Select cocktail</Header>
            <TextInput placeholder="Search" />
            <FlatList
                data={[{ name: 'New Cocktail' }].concat(props.cocktails)}
                renderItem={({ item, index }) =>
                    <TouchableWithoutFeedback onPress={props.selectCocktail.bind(this, item.id)}>
                        <Text style={styles.listItem}>{item.name}</Text>
                    </TouchableWithoutFeedback>}
                keyExtractor={(item, index) => 'cocktail_' + index}
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

export default SelectCocktailDialog