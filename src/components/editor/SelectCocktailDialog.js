import React, { useEffect, useState } from 'react'
import { StyleSheet, View, TouchableWithoutFeedback, FlatList } from 'react-native'

import { Header, Text, TextInput, Dialog } from '../common/styledComponents'

const SelectCocktailDialog = (props) => {
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState(props.cocktails)

    useEffect(() => {
        setSearchResults(props.cocktails.filter(cocktail => cocktail.name.toLowerCase().includes(searchInput.toLowerCase())))
    }, [searchInput])

    const ListItem = (props) => (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <Text style={styles.listItem}>{props.name}</Text>
        </TouchableWithoutFeedback>
    )

    const SearchResultList = () => {
        if (searchResults.length > 0) {
            return <FlatList
                data={[{ name: 'New Cocktail' }].concat(searchResults)}
                renderItem={({ item }) => <ListItem name={item.name} onPress={props.selectCocktail.bind(this, item.id)}/>}
                keyExtractor={(item, index) => 'cocktail_' + index}
            />
        } else {
            return <View>
                <ListItem name="New Cocktail" onPress={props.selectCocktail.bind(this, undefined)}/>
                <Text style={styles.text}>No matching cocktails found</Text>
            </View>
        }
    }

    return (
        <Dialog visible={props.visible} close={props.close}>
            <Header>Select cocktail</Header>
            <TextInput placeholder="Search" value={searchInput} onChangeText={setSearchInput} />
            <SearchResultList />
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