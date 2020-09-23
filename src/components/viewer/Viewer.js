import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TextInput, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import Cocktail from './Cocktail'
import Menu from './Menu'

const Viewer = (props) => {
  const [searchInput, setSearchInput] = useState('')
  const [cocktailList, setCocktailList] = useState(props.cocktails)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setCocktailList(props.cocktails.filter(cocktail => cocktail.name.toLowerCase().includes(searchInput.toLowerCase())))
  }, [searchInput])

  const menu = (option) => () => {
    switch (option) {
      case 'logout':
        return props.logout()
      case 'editor':
        return props.openEditor()
      default: 
        console.error('invalid menu option')
    }
  }

  const CocktailList = () => {
    if (cocktailList.length > 0) {
      return <FlatList
        style={styles.list}
        data={cocktailList}
        renderItem={({ item }) => <Cocktail cocktail={item} />}
        keyExtractor={(item, index) => index + item.name} />
    } else {
      return <Text style={styles.text}>No cocktails found</Text>
    }
  }

  return (
    <View style={styles.viewer}>
      <View style={styles.controls}>
        <View style={styles.textInput}>
          <TextInput type="text" value={searchInput} onChange={event => setSearchInput(event.nativeEvent.text)} />
        </View>
        <Icon name="menu" size={35} onPress={setMenuOpen.bind(this, true)} />
      </View>

      <CocktailList />

      <Menu open={menuOpen} close={setMenuOpen.bind(this, false)} onSelect={menu} />
    </View>
  )
}

export default Viewer

const styles = StyleSheet.create({
  viewer: {
    marginHorizontal: '5%',
    marginTop: 20,
    alignItems: 'center',
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  textInput: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 15
  },
  list: {
    width: '100%',
  },
  text: {
    fontFamily: 'Alegreya-Medium',
    fontSize: 22
  }
})