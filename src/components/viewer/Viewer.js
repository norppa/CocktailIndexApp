import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import Cocktail from './Cocktail'
import { Text, TextInput } from '../common/styledComponents'
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
          <TextInput style={styles.search} value={searchInput} onChange={event => setSearchInput(event.nativeEvent.text)} />
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10
  },
  search: {
    width: '80%',
    marginRight: 10
  },
  list: {
    width: '100%',
  },
})